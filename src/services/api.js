/**
 * LUMI API Client
 * Seamlessly connects React frontend to FastAPI backend.
 * Provides resilient fallback handling for local offline modes.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class LumiApiClient {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  getToken() {
    return localStorage.getItem('lumi_token') || null;
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('lumi_token', token);
    } else {
      localStorage.removeItem('lumi_token');
    }
  }

  getHeaders(isFormData = false) {
    const headers = {};
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const isFormData = options.body instanceof FormData;
    const config = {
      ...options,
      headers: {
        ...this.getHeaders(isFormData),
        ...(options.headers || {})
      }
    };

    try {
      const res = await fetch(url, config);
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(errorData.detail || `Request failed with status ${res.status}`);
      }
      return await res.json();
    } catch (err) {
      console.warn(`[LUMI API] ${endpoint} fetch issue:`, err.message);
      throw err;
    }
  }

  // --- Health ---
  async checkHealth() {
    return this.request('/api/health');
  }

  // --- Auth ---
  async register(data) {
    const res = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  async login(email, password) {
    const res = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.access_token) {
      this.setToken(res.access_token);
    }
    return res;
  }

  async getMe() {
    return this.request('/api/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- Children ---
  async createChild(childData) {
    return this.request('/api/children', {
      method: 'POST',
      body: JSON.stringify(childData)
    });
  }

  async listChildren() {
    return this.request('/api/children');
  }

  async getChild(childId) {
    return this.request(`/api/children/${childId}`);
  }

  async updateChild(childId, updateData) {
    return this.request(`/api/children/${childId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData)
    });
  }

  // --- Documents ---
  async uploadDocument(childId, file) {
    const formData = new FormData();
    formData.append('child_id', childId);
    formData.append('file', file);
    return this.request('/api/documents/upload', {
      method: 'POST',
      body: formData
    });
  }

  async getChildDocuments(childId) {
    return this.request(`/api/documents/child/${childId}`);
  }

  async confirmDocumentFindings(documentId, confirmedFindings, caregiverNotes) {
    return this.request(`/api/documents/${documentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        confirmed_findings: confirmedFindings,
        caregiver_notes: caregiverNotes
      })
    });
  }

  // --- Assessments & Screening ---
  async getScreeningQuestions(instrument) {
    return this.request(`/api/assessments/questions/${instrument}`);
  }

  async submitScreening(childId, instrumentName, answers) {
    return this.request(`/api/assessments/child/${childId}/evaluate`, {
      method: 'POST',
      body: JSON.stringify({
        instrument_name: instrumentName,
        answers: answers
      })
    });
  }

  // --- Activities & Adaptive Recommendations ---
  async listActivities() {
    return this.request('/api/activities');
  }

  async getActivity(activityKey) {
    return this.request(`/api/activities/${activityKey}`);
  }

  async generatePlan(childId, options = {}) {
    return this.request(`/api/recommendations/child/${childId}/generate-plan`, {
      method: 'POST',
      body: JSON.stringify(options)
    });
  }

  async getCurrentPlan(childId) {
    return this.request(`/api/recommendations/child/${childId}/current-plan`);
  }

  // --- Sessions ---
  async startSession(childId, activityId, difficulty = 'standard', planId = null) {
    return this.request(`/api/sessions/child/${childId}/start`, {
      method: 'POST',
      body: JSON.stringify({ activity_id: activityId, difficulty, plan_id: planId })
    });
  }

  async recordSessionEvent(sessionId, eventType, payload = {}) {
    return this.request(`/api/sessions/${sessionId}/event`, {
      method: 'POST',
      body: JSON.stringify({
        event_id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        event_type: eventType,
        timestamp: new Date().toISOString(),
        payload: payload
      })
    });
  }

  async completeSession(sessionId, completionData) {
    return this.request(`/api/sessions/${sessionId}/complete`, {
      method: 'POST',
      body: JSON.stringify(completionData)
    });
  }

  async getChildSessions(childId) {
    return this.request(`/api/sessions/child/${childId}`);
  }

  // --- Reports ---
  async getDailyReport(childId, date = null) {
    const q = date ? `?date=${encodeURIComponent(date)}` : '';
    return this.request(`/api/reports/child/${childId}/daily${q}`);
  }

  async getWeeklyReport(childId) {
    return this.request(`/api/reports/child/${childId}/weekly`);
  }

  getPdfDownloadUrl(childId, date) {
    const token = this.getToken();
    return `${this.baseUrl}/api/reports/child/${childId}/daily/${date}/pdf`;
  }

  // --- Computer Vision & Visual Attention ---
  async evaluateFrame(landmarks, childId = null) {
    return this.request('/api/vision/evaluate-frame', {
      method: 'POST',
      body: JSON.stringify({ landmarks, child_id: childId })
    });
  }

  async evaluateCameraFreeAttention(events) {
    return this.request('/api/vision/camera-free-attention', {
      method: 'POST',
      body: JSON.stringify(events)
    });
  }

  // --- Speech Analysis ---
  async analyzeSpeech(audioBase64, language = 'en', childId = null) {
    return this.request('/api/speech/analyze', {
      method: 'POST',
      body: JSON.stringify({ audio_base64: audioBase64, language, child_id: childId })
    });
  }

  // --- AI Companion ---
  async companionTurn(childId, message, language = 'en', currentActivity = null) {
    return this.request('/api/conversations/companion/turn', {
      method: 'POST',
      body: JSON.stringify({
        child_id: childId,
        message: message,
        language: language,
        current_activity: currentActivity
      })
    });
  }

  // --- Professional Referrals ---
  async getReferralGuidance(screeningScore = null, concerns = []) {
    const params = new URLSearchParams();
    if (screeningScore !== null) params.append('screening_score', screeningScore);
    concerns.forEach(c => params.append('concerns', c));
    return this.request(`/api/referrals/guidance?${params.toString()}`);
  }
}

export const api = new LumiApiClient();
export default api;
