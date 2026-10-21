import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Camera, CameraOff, Eye, Smile, AlertCircle, EyeOff, Sliders, CheckCircle2, Minimize2, Maximize2 } from 'lucide-react';
import { FilesetResolver, FaceLandmarker } from '@mediapipe/tasks-vision';
import api from '../../services/api';
import { useApp } from '../../context/AppContext';

/**
 * MediaPipe Face Landmarker Singleton
 * Provides 478 3D landmarks including precise iris centers:
 * - Left Iris Center: landmark 468
 * - Right Iris Center: landmark 473
 * - Left Eye contour: 33, 133, 159, 145
 * - Right Eye contour: 263, 362, 386, 374
 * - 52 Facial Blendshapes (eyeBlinkLeft, eyeLookInLeft, mouthSmileLeft, etc.)
 */
let landmarkerPromise = null;

async function getFaceLandmarker() {
  if (!landmarkerPromise) {
    landmarkerPromise = (async () => {
      let vision = null;
      try {
        vision = await FilesetResolver.forVisionTasks('/wasm');
      } catch (e) {
        console.warn('[FaceLandmarker] Local wasm failed, using CDN fallback...', e);
        vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm'
        );
      }

      // Try GPU first
      try {
        return await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: '/models/face_landmarker.task',
            delegate: 'GPU'
          },
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          runningMode: 'VIDEO',
          numFaces: 2 // Detect parent + child and isolate child's face
        });
      } catch (gpuErr) {
        console.warn('[FaceLandmarker] GPU delegate failed, trying CPU...', gpuErr);
        try {
          return await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/face_landmarker.task',
              delegate: 'CPU'
            },
            outputFaceBlendshapes: true,
            outputFacialTransformationMatrixes: true,
            runningMode: 'VIDEO',
            numFaces: 2
          });
        } catch (localCpuErr) {
          console.warn('[FaceLandmarker] Local model failed, trying CDN model...', localCpuErr);
          return await FaceLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
              delegate: 'CPU'
            },
            outputFaceBlendshapes: true,
            outputFacialTransformationMatrixes: true,
            runningMode: 'VIDEO',
            numFaces: 2
          });
        }
      }
    })();
  }
  return landmarkerPromise;
}

// Eye contour landmark indices for HUD drawing
const LEFT_EYE_CONTOUR = [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7];
const RIGHT_EYE_CONTOUR = [263, 466, 388, 387, 386, 385, 384, 398, 362, 382, 381, 380, 374, 373, 390, 249];

export default function CameraAttentionMode({
  isEnabled,
  onToggle,
  onEmotionDetected = null,
  onGazeUpdate = null,
  targetEmotion = null,
  targetPosition = null // Dynamic target coordinates on screen: { x: percentage, y: percentage, name?: string }
}) {
  const { t, profile } = useApp();
  const videoRef = useRef(null);
  const overlayCanvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const lastBackendCallRef = useRef(0);
  const smoothedGazeRef = useRef({ x: 50, y: 50 });
  const isLockedOnBallRef = useRef(false);
  const targetPositionRef = useRef(targetPosition);

  useEffect(() => {
    targetPositionRef.current = targetPosition;
  }, [targetPosition]);

  // States
  const [modelReady, setModelReady] = useState(false);
  const [streamActive, setStreamActive] = useState(false);
  const [permissionError, setPermissionError] = useState(null);

  // Telemetry
  const [faceDetected, setFaceDetected] = useState(false);
  const [eyesOpen, setEyesOpen] = useState(false);
  const [isAttentive, setIsAttentive] = useState(false);
  const [eyeContactStatus, setEyeContactStatus] = useState('Camera Starting...');
  const [eyeContactScore, setEyeContactScore] = useState(0);
  const [gazeDirection, setGazeDirection] = useState('Centered');
  const [currentEmotion, setCurrentEmotion] = useState('Calm / Attentive');
  const [matchCelebrated, setMatchCelebrated] = useState(false);

  // Sensitivity (0.7 = lenient, 1.0 = standard, 1.3 = strict)
  const [sensitivity, setSensitivity] = useState(1.0);
  const [showSettings, setShowSettings] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // 1. Initialize MediaPipe FaceLandmarker
  useEffect(() => {
    let active = true;
    getFaceLandmarker()
      .then((landmarker) => {
        if (active) {
          landmarkerRef.current = landmarker;
          setModelReady(true);
        }
      })
      .catch((err) => {
        console.error('[FaceLandmarker] Initialization failed:', err);
        if (active) {
          setPermissionError('Could not load AI vision model. Please check network connection.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  // 2. Initialize Camera Stream
  useEffect(() => {
    let active = true;
    setPermissionError(null);

    if (isEnabled) {
      setEyeContactStatus('Starting camera...');

      navigator.mediaDevices?.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      })
      .then((stream) => {
        if (!active) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadeddata = () => {
            videoRef.current.play().then(() => {
              setStreamActive(true);
            }).catch(() => {});
          };
        }
      })
      .catch((err) => {
        console.warn('[CameraAttentionMode] Camera access error:', err);
        setPermissionError('Camera access was blocked or not found. Please allow camera permissions.');
        setStreamActive(false);
        if (onGazeUpdate) {
          onGazeUpdate({ isAttentive: false, score: 0, eyesOpen: false, reason: 'Camera Blocked' });
        }
      });
    } else {
      setStreamActive(false);
      setFaceDetected(false);
      setEyesOpen(false);
      setIsAttentive(false);
      setEyeContactScore(0);
      setEyeContactStatus('Camera Off');
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (onGazeUpdate) {
        onGazeUpdate({ isAttentive: false, score: 0, eyesOpen: false, reason: 'Camera Off' });
      }
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isEnabled]);

  const handleVideoRef = useCallback((node) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.onloadeddata = () => {
        node.play().then(() => setStreamActive(true)).catch(() => {});
      };
    }
  }, []);

  // 3. High-Precision MediaPipe Vision Loop
  const analyzeFrame = useCallback(() => {
    if (!isEnabled || !streamActive || !videoRef.current || !landmarkerRef.current) {
      return;
    }

    const video = videoRef.current;
    if (video.readyState < 2) {
      animFrameRef.current = requestAnimationFrame(analyzeFrame);
      return;
    }

    const canvas = overlayCanvasRef.current;
    const ctx = canvas ? canvas.getContext('2d') : null;
    const cw = canvas ? canvas.width : 224;
    const ch = canvas ? canvas.height : 144;

    try {
      // Run MediaPipe Face Landmarker if a new video frame is ready
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;
        const results = landmarkerRef.current.detectForVideo(video, performance.now());

        if (ctx) {
          ctx.clearRect(0, 0, cw, ch);
        }

        // ── Case A: No Face Detected in Frame ──
        if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
          setFaceDetected(false);
          setEyesOpen(false);
          setIsAttentive(false);
          setEyeContactScore(0);
          setEyeContactStatus('Center Face in Frame');
          setGazeDirection('Searching');
          setCurrentEmotion('Searching...');

          if (onGazeUpdate) {
            onGazeUpdate({ isAttentive: false, score: 0, eyesOpen: false, reason: 'Center Face in Frame' });
          }

          animFrameRef.current = requestAnimationFrame(analyzeFrame);
          return;
        }

        // ── Case B: Face Detected — Isolate Child's Face Specifically ──
        setFaceDetected(true);

        // Child Face Selector: If parent + child are both in view, anchor onto the child in front!
        let childFaceIdx = 0;
        if (results.faceLandmarks.length > 1) {
          let bestChildScore = -1;
          for (let fIdx = 0; fIdx < results.faceLandmarks.length; fIdx++) {
            const face = results.faceLandmarks[fIdx];
            let minX = 1, maxX = 0, minY = 1, maxY = 0;
            for (let pIdx = 0; pIdx < face.length; pIdx++) {
              const pt = face[pIdx];
              if (pt.x < minX) minX = pt.x;
              if (pt.x > maxX) maxX = pt.x;
              if (pt.y < minY) minY = pt.y;
              if (pt.y > maxY) maxY = pt.y;
            }
            const faceArea = (maxX - minX) * (maxY - minY);
            const centerY = (minY + maxY) / 2;
            // Child sits closer (larger bounding box) and lower in frame
            const score = faceArea * 1.6 + centerY * 0.4;
            if (score > bestChildScore) {
              bestChildScore = score;
              childFaceIdx = fIdx;
            }
          }
        }

        const lm = results.faceLandmarks[childFaceIdx];

        // Blendshape dictionary for the isolated child's face
        const blendshapes = {};
        if (results.faceBlendshapes && results.faceBlendshapes[childFaceIdx]) {
          for (const cat of results.faceBlendshapes[childFaceIdx].categories) {
            blendshapes[cat.categoryName] = cat.score;
          }
        }

        // ── 1. True Eyelid Openness & Blink Detection ──
        // Landmark Eye Aspect Ratio (EAR)
        const leftH = Math.hypot(lm[159].x - lm[145].x, lm[159].y - lm[145].y);
        const leftW = Math.hypot(lm[33].x - lm[133].x, lm[33].y - lm[133].y);
        const leftEAR = leftW > 0 ? (leftH / leftW) : 0;

        const rightH = Math.hypot(lm[386].x - lm[374].x, lm[386].y - lm[374].y);
        const rightW = Math.hypot(lm[263].x - lm[362].x, lm[263].y - lm[362].y);
        const rightEAR = rightW > 0 ? (rightH / rightW) : 0;

        const blinkL = blendshapes.eyeBlinkLeft ?? (leftEAR < 0.16 ? 1.0 : 0.0);
        const blinkR = blendshapes.eyeBlinkRight ?? (rightEAR < 0.16 ? 1.0 : 0.0);

        // MediaPipe Gaze blendshapes
        const lookOutL = blendshapes.eyeLookOutLeft ?? 0;
        const lookInL = blendshapes.eyeLookInLeft ?? 0;
        const lookOutR = blendshapes.eyeLookOutRight ?? 0;
        const lookInR = blendshapes.eyeLookInRight ?? 0;
        const lookDown = Math.max(blendshapes.eyeLookDownLeft ?? 0, blendshapes.eyeLookDownRight ?? 0);
        const lookUp = Math.max(blendshapes.eyeLookUpLeft ?? 0, blendshapes.eyeLookUpRight ?? 0);

        // Screen right = child's left = lookOutL + lookInR (positive X deflection)
        // Screen left = child's right = lookInL + lookOutR (negative X deflection)
        const gazeHBlend = (lookOutL + lookInR) - (lookInL + lookOutR);
        const gazeVBlend = lookDown - lookUp;

        // Robust physiological blink/eye-closure detection:
        // When sitting in front of a laptop, looking down naturally causes eyelids to droop (lookDown 0.35-0.70).
        // This must NEVER be falsely classified as closed eyes. True eye closure requires full bilateral closure.
        const isLookingDownAtLaptop = lookDown > 0.28;
        const blinkThreshold = isLookingDownAtLaptop ? 0.82 : (0.70 / sensitivity);
        const earThreshold = 0.11 * sensitivity;

        const leftClosed = (blinkL > blinkThreshold) && (leftEAR < earThreshold);
        const rightClosed = (blinkR > blinkThreshold) && (rightEAR < earThreshold);
        // Only classify as eyes closed if BOTH eyes are firmly shut or sleeping
        const areEyesClosed = leftClosed && rightClosed;
        const areEyesOpen = !areEyesClosed;
        setEyesOpen(areEyesOpen);

        // ── 2. Head Yaw & Pitch (Turned Away Detection) ──
        const nose = lm[1];
        const leftCheek = lm[234];
        const rightCheek = lm[454];
        const forehead = lm[10];
        const chin = lm[152];

        const spanToLeftFace = Math.abs(nose.x - leftCheek.x);
        const spanToRightFace = Math.abs(rightCheek.x - nose.x);
        const totalFaceSpan = spanToLeftFace + spanToRightFace;
        const yawRatio = totalFaceSpan > 0 ? (spanToLeftFace / totalFaceSpan) : 0.5;

        const spanToForehead = Math.abs(nose.y - forehead.y);
        const spanToChin = Math.abs(chin.y - nose.y);
        const totalVerticalSpan = spanToForehead + spanToChin;
        const pitchRatio = totalVerticalSpan > 0 ? (spanToForehead / totalVerticalSpan) : 0.5;

        // Laptop boundaries: Webcam is above display, so child's face yaw within ~50° is facing the laptop
        const isTurnedLeft = yawRatio < (0.16 / sensitivity);
        const isTurnedRight = yawRatio > (1 - (0.16 / sensitivity));

        // Looking at a laptop screen naturally produces pitchRatio between 0.25 and 0.86.
        // Only looking up into ceiling or chin-tucked into chest/floor is out-of-bounds.
        const isPitchedDown = pitchRatio > (0.88 * sensitivity) && lookDown > 0.85;
        const isPitchedUp = pitchRatio < (0.18 / sensitivity);

        const isHeadTurnedFar = isTurnedLeft || isTurnedRight || isPitchedDown || isPitchedUp;

        // ── 3. Exact Iris Gaze Position (Corner-to-Corner Laptop Screen) ──
        // Left Eye Iris (screen left in mirror view)
        const leftMinX = Math.min(lm[33].x, lm[133].x);
        const leftMaxX = Math.max(lm[33].x, lm[133].x);
        const leftSpanX = Math.max(0.001, leftMaxX - leftMinX);
        const leftIrisRatio = (lm[468].x - leftMinX) / leftSpanX;

        // Right Eye Iris (screen right in mirror view)
        const rightMinX = Math.min(lm[263].x, lm[362].x);
        const rightMaxX = Math.max(lm[263].x, lm[362].x);
        const rightSpanX = Math.max(0.001, rightMaxX - rightMinX);
        const rightIrisRatio = (lm[473].x - rightMinX) / rightSpanX;

        const avgIrisHRatio = (leftIrisRatio + rightIrisRatio) / 2;

        // Vertical Iris Position
        const leftSpanY = Math.max(0.001, Math.abs(lm[145].y - lm[159].y));
        const leftIrisVRatio = (lm[468].y - lm[159].y) / leftSpanY;
        const rightSpanY = Math.max(0.001, Math.abs(lm[374].y - lm[386].y));
        const rightIrisVRatio = (lm[473].y - lm[386].y) / rightSpanY;
        const avgIrisVRatio = (leftIrisVRatio + rightIrisVRatio) / 2;

        // Head offsets mapped onto laptop screen proportions
        const headYawOffset = (yawRatio - 0.50) * 50;
        const headPitchOffset = (pitchRatio - 0.50) * 45;

        // Screen Gaze: Maps 0% (top-left corner) to 100% (bottom-right corner) of laptop display
        const rawGazeX = 50 + headYawOffset + (avgIrisHRatio - 0.50) * 105 + gazeHBlend * 30;
        const rawGazeY = 50 + headPitchOffset + (avgIrisVRatio - 0.50) * 75 + gazeVBlend * 35;

        // Snappy EMA Smoothing filter (alpha = 0.28)
        const smoothAlpha = 0.28;
        smoothedGazeRef.current.x = smoothedGazeRef.current.x * (1 - smoothAlpha) + rawGazeX * smoothAlpha;
        smoothedGazeRef.current.y = smoothedGazeRef.current.y * (1 - smoothAlpha) + rawGazeY * smoothAlpha;

        const gazeScreenX = Math.max(0, Math.min(100, smoothedGazeRef.current.x));
        const gazeScreenY = Math.max(0, Math.min(100, smoothedGazeRef.current.y));

        // Off-screen glances: Only when pupils/gaze completely exit laptop screen boundaries
        const isGlanceLeft = (avgIrisHRatio < 0.12 && gazeHBlend < -0.65) || smoothedGazeRef.current.x < -8;
        const isGlanceRight = (avgIrisHRatio > 0.88 && gazeHBlend > 0.65) || smoothedGazeRef.current.x > 108;
        const isGlanceDown = (lookDown > 0.90 && avgIrisVRatio > 0.88 && pitchRatio > 0.85) || smoothedGazeRef.current.y > 108;
        const isGlanceUp = (lookUp > 0.85 && avgIrisVRatio < 0.15) || smoothedGazeRef.current.y < -8;

        // ── 4. Screen-Wide Attention & Direction Classification (Autism Protocol) ──
        // For an autistic child, watching ANY part of the laptop screen (corners, edges, center, star, or road)
        // represents valid visual engagement and counts as eye contact attention!
        let directionKey = 'onTarget';
        let attentive = false;
        let status = '';
        let dir = 'Centered';
        let score = 0;
        let targetDist = 0;

        const targetPos = targetPositionRef.current;

        if (areEyesClosed) {
          status = t('eyesClosed');
          dir = t('eyesClosed');
          directionKey = 'eyes_closed';
          score = 0;
          attentive = false;
          isLockedOnBallRef.current = false;
        } else if (isTurnedLeft || isGlanceLeft) {
          status = isTurnedLeft ? t('faceTurnedLeft') : t('lookingLeftAway');
          dir = t('lookingLeftAway');
          directionKey = 'look_left';
          score = 20;
          attentive = false;
          isLockedOnBallRef.current = false;
        } else if (isTurnedRight || isGlanceRight) {
          status = isTurnedRight ? t('faceTurnedRight') : t('lookingRightAway');
          dir = t('lookingRightAway');
          directionKey = 'look_right';
          score = 20;
          attentive = false;
          isLockedOnBallRef.current = false;
        } else if (isPitchedDown || isGlanceDown) {
          status = isPitchedDown ? t('headTiltedDown') : t('lookingDownAway');
          dir = t('lookingDownAway');
          directionKey = 'look_down';
          score = 20;
          attentive = false;
          isLockedOnBallRef.current = false;
        } else if (isPitchedUp || isGlanceUp) {
          status = isPitchedUp ? t('headTiltedUp') : t('lookingUpAway');
          dir = t('lookingUpAway');
          directionKey = 'look_up';
          score = 20;
          attentive = false;
          isLockedOnBallRef.current = false;
        } else if (isHeadTurnedFar) {
          status = t('faceTurnedAway');
          dir = t('faceTurnedAway');
          directionKey = 'turned_away';
          score = 15;
          attentive = false;
          isLockedOnBallRef.current = false;
        } else {
          // Child is looking AT THE LAPTOP SCREEN!
          // Every point within screen corners (0% to 100% X, 0% to 100% Y) is valid Eye Contact & Attention!
          attentive = true;
          directionKey = 'onTarget';

          if (targetPos) {
            const dX = gazeScreenX - targetPos.x;
            const dY = gazeScreenY - targetPos.y;
            targetDist = Math.hypot(dX, dY * 0.75);

            // Ball pursuit lock threshold (40% radius around moving star)
            const isNearBall = targetDist <= (40 * sensitivity);

            if (isNearBall) {
              status = t('trackingMovingBall');
              dir = t('ballLocked');
              score = Math.min(100, Math.max(92, Math.round(98 - targetDist * 0.15)));
              isLockedOnBallRef.current = true;
            } else {
              status = t('watchingScreenVisuals');
              dir = t('screenFocused');
              score = 90;
              isLockedOnBallRef.current = false;
            }
          } else {
            status = t('watchingScreen');
            dir = t('screenFocused');
            score = 92;
            isLockedOnBallRef.current = false;
          }
        }

        setIsAttentive(attentive);
        setEyeContactStatus(status);
        setGazeDirection(dir);
        setEyeContactScore(score);

        // ── 5. Emotion & Mood Detection (Happy, Sad, Angry, Surprised, Calm, Scared, Excited, Tired) ──
        const smileScore = Math.max(blendshapes.mouthSmileLeft ?? 0, blendshapes.mouthSmileRight ?? 0);
        const dimpleScore = Math.max(blendshapes.mouthDimpleLeft ?? 0, blendshapes.mouthDimpleRight ?? 0);
        const browDownScore = Math.max(blendshapes.browDownLeft ?? 0, blendshapes.browDownRight ?? 0);
        const browInnerUp = blendshapes.browInnerUp ?? 0;
        const browOuterUp = Math.max(blendshapes.browOuterUpLeft ?? 0, blendshapes.browOuterUpRight ?? 0);
        const frownScore = Math.max(blendshapes.mouthFrownLeft ?? 0, blendshapes.mouthFrownRight ?? 0);
        const mouthShrugLower = blendshapes.mouthShrugLower ?? 0;
        const mouthPout = Math.max(blendshapes.mouthPucker ?? 0, blendshapes.mouthRollLower ?? 0, mouthShrugLower);
        const mouthPress = Math.max(blendshapes.mouthPressLeft ?? 0, blendshapes.mouthPressRight ?? 0);
        const mouthUpperUp = Math.max(blendshapes.mouthUpperUpLeft ?? 0, blendshapes.mouthUpperUpRight ?? 0);
        const eyeWideScore = Math.max(blendshapes.eyeWideLeft ?? 0, blendshapes.eyeWideRight ?? 0);
        const eyeSquint = Math.max(blendshapes.eyeSquintLeft ?? 0, blendshapes.eyeSquintRight ?? 0);
        const jawOpen = blendshapes.jawOpen ?? 0;

        let emo = 'Calm / Peaceful 😌';
        let emoKey = 'calm';
        let emoConf = 92;

        if (areEyesClosed) {
          emo = 'Resting / Eyes Closed 😴';
          emoKey = 'tired';
          emoConf = 96;
        } else if (jawOpen > 0.44 && eyeWideScore < 0.20 && smileScore < 0.15) {
          // Yawning
          emo = 'Sleepy / Yawning 🥱';
          emoKey = 'tired';
          emoConf = 92;
        } else if (smileScore > 0.42 && (jawOpen > 0.18 || eyeWideScore > 0.18)) {
          // Ecstatic / Excited laughing
          emo = 'Excited / Joyful 🥰';
          emoKey = 'excited';
          emoConf = Math.min(99, Math.round(80 + smileScore * 20));
        } else if (smileScore > 0.22 || dimpleScore > 0.26 || (smileScore > 0.16 && eyeSquint > 0.18)) {
          // Cheerful smile
          emo = 'Smiling / Happy 😊';
          emoKey = 'happy';
          emoConf = Math.min(99, Math.round(75 + smileScore * 25));
        } else if (
          (jawOpen > 0.28 && eyeWideScore > 0.20) ||
          (jawOpen > 0.35 && browOuterUp > 0.22) ||
          (jawOpen > 0.32 && browInnerUp > 0.22 && smileScore < 0.15)
        ) {
          // Surprised
          emo = 'Surprised / Amazed 😮';
          emoKey = 'surprised';
          emoConf = Math.min(98, Math.round(75 + Math.max(eyeWideScore, jawOpen) * 25));
        } else if (eyeWideScore > 0.25 && browInnerUp > 0.28 && smileScore < 0.15 && (jawOpen > 0.14 || mouthPress > 0.18)) {
          // Scared
          emo = 'Scared / Startled 😨';
          emoKey = 'scared';
          emoConf = Math.min(95, Math.round(70 + eyeWideScore * 30));
        } else if (
          (browDownScore > 0.28 && (mouthPress > 0.16 || frownScore > 0.16 || mouthUpperUp > 0.16)) ||
          (browDownScore > 0.38 && smileScore < 0.15)
        ) {
          // Angry / Furrowed scowl
          emo = 'Angry / Grumpy 😠';
          emoKey = 'angry';
          emoConf = Math.min(98, Math.round(75 + browDownScore * 25));
        } else if (
          frownScore > 0.28 ||
          (frownScore > 0.18 && browInnerUp > 0.28 && smileScore < 0.12) ||
          (mouthPout > 0.35 && browInnerUp > 0.25 && smileScore < 0.12)
        ) {
          // Sadness / Pouting
          emo = 'Sad / Pouting 😢';
          emoKey = 'sad';
          emoConf = Math.min(98, Math.round(75 + Math.max(frownScore, mouthPout) * 25));
        } else {
          // Calm & Neutral Resting Expression (natural state when observing screen)
          emo = 'Calm / Peaceful 😌';
          emoKey = 'calm';
          emoConf = 92;
        }

        setCurrentEmotion(emo);

        if (onGazeUpdate) {
          onGazeUpdate({
            isAttentive: attentive,
            score,
            eyesOpen: areEyesOpen,
            reason: status,
            directionKey: directionKey,
            gazeX: Math.round(gazeScreenX),
            gazeY: Math.round(gazeScreenY),
            targetX: targetPosition?.x ?? 50,
            targetY: targetPosition?.y ?? 50,
            targetDist: Math.round(targetDist),
            emotion: emo,
            emotionKey: emoKey,
            emotionConfidence: emoConf
          });
        }

        if (targetEmotion) {
          const t = targetEmotion.toLowerCase().trim();
          let isMatch = false;

          if (t.includes('happy') || t.includes('smile')) {
            isMatch = (emoKey === 'happy' || emoKey === 'excited' || smileScore > 0.20);
          } else if (t.includes('sad') || t.includes('cry') || t.includes('pout')) {
            isMatch = (emoKey === 'sad' || frownScore > 0.20 || mouthPout > 0.26);
          } else if (t.includes('angry') || t.includes('mad') || t.includes('grump')) {
            isMatch = (emoKey === 'angry' || browDownScore > 0.24);
          } else if (t.includes('calm') || t.includes('peace') || t.includes('relax')) {
            // Calm matches when face is in relaxed, tranquil resting state
            isMatch = (emoKey === 'calm' || (areEyesOpen && smileScore < 0.25 && frownScore < 0.22 && browDownScore < 0.26 && jawOpen < 0.25));
          } else if (t.includes('surpris') || t.includes('amaze')) {
            isMatch = (emoKey === 'surprised' || (jawOpen > 0.24 && (eyeWideScore > 0.16 || browOuterUp > 0.18)));
          } else if (t.includes('scare') || t.includes('fear')) {
            isMatch = (emoKey === 'scared' || (eyeWideScore > 0.20 && browInnerUp > 0.22));
          } else if (t.includes('excit') || t.includes('joy')) {
            isMatch = (emoKey === 'excited' || (smileScore > 0.28 && jawOpen > 0.14));
          } else if (t.includes('tire') || t.includes('sleep') || t.includes('yawn')) {
            isMatch = (emoKey === 'tired' || jawOpen > 0.36 || areEyesClosed);
          }

          if (isMatch && !matchCelebrated) {
            setMatchCelebrated(true);
            if (onEmotionDetected) {
              onEmotionDetected({ emotion: emo, emotionKey: emoKey, confidence: emoConf });
            }
            setTimeout(() => setMatchCelebrated(false), 2500);
          }
        }

        // ── 6. Live Visual HUD Rendering on Overlay Canvas ──
        if (ctx) {
          // Mirrored coordinate converter: Video is mirrored with scale-x-[-1]
          // So screen X is (1 - landmark.x) * cw
          const toScreenX = (normX) => (1 - normX) * cw;
          const toScreenY = (normY) => normY * ch;

          const hudColor = !areEyesOpen ? '#ef4444' : attentive ? '#10b981' : '#f59e0b';

          // A. Draw Left & Right Eyelid Curves
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = hudColor;
          ctx.shadowColor = hudColor;
          ctx.shadowBlur = 6;

          // Draw contour helper
          const drawContour = (indices) => {
            ctx.beginPath();
            for (let i = 0; i < indices.length; i++) {
              const pt = lm[indices[i]];
              const px = toScreenX(pt.x);
              const py = toScreenY(pt.y);
              if (i === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.stroke();
          };

          drawContour(LEFT_EYE_CONTOUR);
          drawContour(RIGHT_EYE_CONTOUR);

          // B. Draw High-Precision Pupil Reticles on BOTH Pupils!
          if (areEyesOpen) {
            const pupils = [
              { x: lm[468].x, y: lm[468].y }, // Left iris
              { x: lm[473].x, y: lm[473].y }  // Right iris
            ];

            pupils.forEach((p) => {
              const px = toScreenX(p.x);
              const py = toScreenY(p.y);

              // Outer glowing reticle circle
              ctx.beginPath();
              ctx.arc(px, py, 6, 0, Math.PI * 2);
              ctx.strokeStyle = attentive ? '#34d399' : '#fbbf24';
              ctx.lineWidth = 1.5;
              ctx.stroke();

              // Inner sharp pupil center dot
              ctx.beginPath();
              ctx.arc(px, py, 2.5, 0, Math.PI * 2);
              ctx.fillStyle = attentive ? '#00F5FF' : '#fbbf24';
              ctx.fill();

              // Pupil Crosshair '+' lines
              ctx.beginPath();
              ctx.moveTo(px - 9, py);
              ctx.lineTo(px + 9, py);
              ctx.moveTo(px, py - 9);
              ctx.lineTo(px, py + 9);
              ctx.strokeStyle = attentive ? '#00F5FF' : '#f59e0b';
              ctx.lineWidth = 1.5;
              ctx.stroke();
            });
          } else {
            // Closed eyes indicator: Red slashes over eye areas
            const eyeCenters = [
              { x: (lm[33].x + lm[133].x) / 2, y: (lm[159].y + lm[145].y) / 2 },
              { x: (lm[263].x + lm[362].x) / 2, y: (lm[386].y + lm[374].y) / 2 }
            ];

            ctx.strokeStyle = '#ef4444';
            ctx.lineWidth = 3;
            eyeCenters.forEach((c) => {
              const cx = toScreenX(c.x);
              const cy = toScreenY(c.y);
              ctx.beginPath();
              ctx.moveTo(cx - 10, cy);
              ctx.lineTo(cx + 10, cy);
              ctx.stroke();
            });
          }

          // C. Dynamic Moving Ball Radar Tracking Mini-Map (Top-Right of HUD)
          if (targetPosition) {
            const radarW = 54;
            const radarH = 36;
            const radarX = cw - radarW - 6;
            const radarY = 6;

            // Radar background box
            ctx.fillStyle = 'rgba(5, 7, 22, 0.88)';
            ctx.strokeStyle = attentive ? '#10b981' : '#00F5FF';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.roundRect ? ctx.roundRect(radarX, radarY, radarW, radarH, 5) : ctx.rect(radarX, radarY, radarW, radarH);
            ctx.fill();
            ctx.stroke();

            // Radar screen center crosshair
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.beginPath();
            ctx.moveTo(radarX + radarW / 2, radarY + 2);
            ctx.lineTo(radarX + radarW / 2, radarY + radarH - 2);
            ctx.moveTo(radarX + 2, radarY + radarH / 2);
            ctx.lineTo(radarX + radarW - 2, radarY + radarH / 2);
            ctx.stroke();

            // Target Moving Ball on Radar (Cyan)
            const tX = radarX + (Math.max(5, Math.min(95, targetPosition.x)) / 100) * radarW;
            const tY = radarY + (Math.max(5, Math.min(95, targetPosition.y)) / 100) * radarH;
            ctx.beginPath();
            ctx.arc(tX, tY, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00F5FF';
            ctx.shadowColor = '#00F5FF';
            ctx.shadowBlur = 6;
            ctx.fill();

            // Child's Current Gaze on Radar (Emerald if on-target, Amber if off-target)
            const gX = radarX + (Math.max(5, Math.min(95, gazeScreenX)) / 100) * radarW;
            const gY = radarY + (Math.max(5, Math.min(95, gazeScreenY)) / 100) * radarH;
            ctx.beginPath();
            ctx.arc(gX, gY, 3, 0, Math.PI * 2);
            ctx.fillStyle = attentive ? '#34d399' : '#f59e0b';
            ctx.shadowColor = attentive ? '#34d399' : '#f59e0b';
            ctx.fill();

            // Line connecting gaze to ball
            ctx.beginPath();
            ctx.moveTo(gX, gY);
            ctx.lineTo(tX, tY);
            ctx.strokeStyle = attentive ? 'rgba(52, 211, 153, 0.8)' : 'rgba(245, 158, 11, 0.6)';
            ctx.lineWidth = 1;
            if (!attentive) ctx.setLineDash([2, 2]);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.shadowBlur = 0;

            // Status label inside radar
            ctx.fillStyle = attentive ? '#34d399' : '#f59e0b';
            ctx.font = 'bold 7px sans-serif';
            ctx.fillText(attentive ? 'STAR ⭐' : 'FOLLOW', radarX + 4, radarY + radarH - 3);
          }

          // Reset shadow
          ctx.shadowBlur = 0;
        }

        // ── 7. Backend ML Evaluation Audit Sync (every 3s) ──
        const now = Date.now();
        if (now - lastBackendCallRef.current > 3000) {
          lastBackendCallRef.current = now;
          api.evaluateFrame([
            { x: lm[1].x, y: lm[1].y, z: lm[1].z },
            { x: lm[468].x, y: lm[468].y, z: lm[468].z },
            { x: lm[473].x, y: lm[473].y, z: lm[473].z }
          ]).catch(() => {});
        }
      }
    } catch (e) {
      console.warn('[FaceLandmarker] Frame analysis error:', e);
    }

    animFrameRef.current = requestAnimationFrame(analyzeFrame);
  }, [isEnabled, streamActive, sensitivity, targetEmotion, matchCelebrated, onEmotionDetected, onGazeUpdate]);

  useEffect(() => {
    if (streamActive && modelReady) {
      animFrameRef.current = requestAnimationFrame(analyzeFrame);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [streamActive, modelReady, analyzeFrame]);

  return (
    <div className="relative flex flex-col items-end select-none font-sans z-30">
      {/* ── Toggle Button ── */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onToggle}
          className={`px-3.5 py-1.5 rounded-full font-black text-xs border backdrop-blur-md transition-all flex items-center gap-2 shadow-lg ${
            isEnabled
              ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white border-white/90 ring-2 ring-cyan-400/50'
              : 'bg-white/15 text-white/90 border-white/25 hover:bg-white/25'
          }`}
        >
          {isEnabled ? <Camera className="w-4 h-4 text-white animate-pulse" /> : <CameraOff className="w-4 h-4 text-cyan-300" />}
          <span>{targetEmotion ? t('emotionCameraActive') : t('starTrackerActive')}: {isEnabled ? 'ACTIVE' : 'OFF'}</span>
        </button>

        {isEnabled && (
          <>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              title={isMinimized ? 'Expand Camera View' : 'Minimize Camera View'}
              className="p-1.5 rounded-full bg-slate-800/80 border border-white/20 text-white hover:bg-slate-700 transition"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5 text-cyan-300" /> : <Minimize2 className="w-3.5 h-3.5 text-cyan-300" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              title="Adjust Sensitivity"
              className="p-1.5 rounded-full bg-slate-800/80 border border-white/20 text-white hover:bg-slate-700 transition"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-300" />
            </button>
          </>
        )}

        {isEnabled && isMinimized && (
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shadow-md flex items-center gap-1.5 ml-1 ${
            isAttentive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-red-500/25 text-red-300 border-red-500/50 animate-pulse'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isAttentive ? 'bg-emerald-400 animate-ping' : 'bg-red-400'}`} />
            <span>{isAttentive ? (targetEmotion ? `🎭 ${currentEmotion}` : `⭐ ${t('ballLocked')}`) : eyeContactStatus}</span>
          </span>
        )}
      </div>

      {/* Permission Warning */}
      {isEnabled && permissionError && (
        <div className="absolute right-0 top-full mt-2 max-w-xs px-3 py-2 rounded-xl bg-amber-950/90 border border-amber-400/60 text-amber-200 text-[11px] flex items-center gap-1.5 shadow-xl z-50">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>{permissionError}</span>
        </div>
      )}

      {/* Sensitivity Slider Popup */}
      {isEnabled && showSettings && (
        <div className="absolute right-0 top-full mt-2 w-64 p-2.5 rounded-xl bg-slate-900/95 border border-cyan-400/50 shadow-2xl text-[11px] text-white space-y-1.5 z-50">
          <div className="flex justify-between font-bold text-cyan-300">
            <span>Detection Sensitivity:</span>
            <span>{sensitivity < 0.85 ? 'Lenient' : sensitivity > 1.15 ? 'Strict' : 'Normal'}</span>
          </div>
          <input
            type="range"
            min="0.6"
            max="1.4"
            step="0.1"
            value={sensitivity}
            onChange={(e) => setSensitivity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
          <p className="text-[10px] text-slate-400">Lenient: lower lighting / glasses. Strict: rapid gaze shifts.</p>
        </div>
      )}

      {/* ── LIVE AI COMPUTER VISION HUD ── */}
      {isEnabled && (
        <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl border-2 border-cyan-400/50 bg-slate-950/95 backdrop-blur-xl overflow-hidden shadow-[0_10px_35px_rgba(0,245,255,0.45)] flex flex-col z-40 transition-all ${
          isMinimized ? 'opacity-0 pointer-events-none -z-50 h-0 overflow-hidden' : ''
        }`}>
          {/* Video Preview Container */}
          <div className="w-full h-36 relative bg-black overflow-hidden flex items-center justify-center">
            {/* Mirrored webcam feed */}
            <video
              ref={handleVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover scale-x-[-1] ${streamActive ? 'block' : 'opacity-0'}`}
            />

            {/* Real-time Tracking Pupil Crosshairs Overlay Canvas (1:1 with video) */}
            <canvas
              ref={overlayCanvasRef}
              width="224"
              height="144"
              className="absolute inset-0 pointer-events-none"
            />

            {/* Model Loading / Camera Spinner */}
            {(!streamActive || !modelReady) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-cyan-300 text-xs gap-2 p-3 bg-slate-950">
                <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span className="font-bold">{!modelReady ? 'Loading MediaPipe AI...' : 'Connecting camera...'}</span>
              </div>
            )}

            {/* Face Reticle Overlay & Pill */}
            {streamActive && modelReady && (
              <div className={`absolute inset-2 rounded-xl border-2 transition-all duration-200 pointer-events-none flex flex-col items-center justify-between p-1.5 ${
                !faceDetected
                  ? 'border-cyan-400/40 border-dashed'
                  : !eyesOpen
                  ? 'border-red-500/90 shadow-[inset_0_0_20px_rgba(239,68,68,0.5)] animate-pulse'
                  : isAttentive
                  ? 'border-emerald-400/90 shadow-[inset_0_0_20px_rgba(52,211,153,0.5)]'
                  : 'border-amber-400/90 shadow-[inset_0_0_20px_rgba(245,158,11,0.5)]'
              }`}>
                {/* Corner brackets */}
                <div className="w-full flex justify-between">
                  <div className="w-2.5 h-2.5 border-t-2 border-l-2 border-cyan-300" />
                  <div className="w-2.5 h-2.5 border-t-2 border-r-2 border-cyan-300" />
                </div>

                {/* Status pill on video */}
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider backdrop-blur-md shadow-lg transition-all ${
                  !faceDetected
                    ? 'bg-black/80 text-cyan-200 border border-white/20'
                    : !eyesOpen
                    ? 'bg-red-950/90 text-red-200 border border-red-500/80 animate-bounce'
                    : isAttentive
                    ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-400/70'
                    : 'bg-amber-950/90 text-amber-200 border border-amber-400/70'
                }`}>
                  {!faceDetected ? t('centerFace') : !eyesOpen ? t('eyesClosedWarning') : targetEmotion ? `🎭 ${currentEmotion}` : isAttentive ? `⭐ ${t('ballLocked')}` : gazeDirection}
                </span>

                <div className="w-full flex justify-between">
                  <div className="w-2.5 h-2.5 border-b-2 border-l-2 border-cyan-300" />
                  <div className="w-2.5 h-2.5 border-b-2 border-r-2 border-cyan-300" />
                </div>
              </div>
            )}

            {/* Target Match Celebration Glow */}
            {matchCelebrated && (
              <div className="absolute inset-0 bg-emerald-500/60 backdrop-blur-sm flex items-center justify-center text-white font-black text-xs animate-bounce shadow-xl">
                {t('emotionMatched')}
              </div>
            )}
          </div>

          {/* ── Live Telemetry Strip ── */}
          <div className="p-2.5 space-y-2 text-left text-[11px] bg-slate-900/95 border-t border-cyan-400/30">
            {/* Eye Contact Status */}
            <div className="flex items-center justify-between text-white/90">
              <span className="flex items-center gap-1 text-cyan-300 font-semibold">
                {eyesOpen && isAttentive ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5 text-amber-400" />}
                {t('gazeStatusLabel')}
              </span>
              <span className={`font-black text-[10px] px-2 py-0.5 rounded ${
                !faceDetected
                  ? 'bg-slate-800 text-slate-300'
                  : isAttentive
                  ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-500/40'
                  : !eyesOpen
                  ? 'bg-red-500/25 text-red-300 border border-red-500/40'
                  : 'bg-amber-500/25 text-amber-300 border border-amber-500/40'
              }`}>
                {eyeContactStatus}
              </span>
            </div>

            {/* Attention Progress Bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-white/10">
              <div
                className={`h-full rounded-full transition-all duration-200 ${
                  isAttentive
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400'
                    : eyesOpen
                    ? 'bg-amber-400'
                    : 'bg-red-500'
                }`}
                style={{ width: `${eyeContactScore}%` }}
              />
            </div>

            {/* Live Facial Expression */}
            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-white/90">
              <span className="flex items-center gap-1 text-purple-300 font-semibold">
                <Smile className="w-3.5 h-3.5 text-purple-400" /> {t('expressionLabel')}:
              </span>
              <span className="font-extrabold text-[10px] text-amber-200 truncate max-w-[120px]">
                {currentEmotion}
              </span>
            </div>

            {/* Target Guidance Prompt if game active */}
            {targetEmotion && (
              <div className="px-1.5 py-1 rounded-lg bg-cyan-950/90 border border-cyan-400/40 text-[9px] text-cyan-200 text-center font-bold">
                🎯 Target: Make <span className="text-amber-300 uppercase underline">{targetEmotion}</span> Face
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
