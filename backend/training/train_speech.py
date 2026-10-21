"""
LUMI Speech Prosody & Vocal Engagement Training Pipeline
Dataset Support: RAVDESS / Synthetic Acoustic Feature Tensors
Architecture: LumiSpeechNet (Multi-Layer Perceptron with Regularization)
Evaluation: Precision, Recall, Macro F1, Confusion Matrix
"""

import os
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

SPEECH_CLASSES = ["Calm/Gentle", "Joyful/Expressive", "Neutral/Attentive", "Hesitant/Quiet"]
NUM_SPEECH_CLASSES = len(SPEECH_CLASSES)
FEATURE_DIM = 16

class LumiSpeechNet(nn.Module):
    """
    Neural classifier for vocal prosody and vocal engagement patterns.
    Inputs: 16-dimensional acoustic feature vector (pitch, RMS energy, ZCR, pause ratios).
    """
    def __init__(self, in_features=FEATURE_DIM, num_classes=NUM_SPEECH_CLASSES):
        super(LumiSpeechNet, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(in_features, 64),
            nn.BatchNorm1d(64),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.2),

            nn.Linear(64, 32),
            nn.BatchNorm1d(32),
            nn.LeakyReLU(0.1),
            nn.Dropout(0.2),

            nn.Linear(32, num_classes)
        )

    def forward(self, x):
        return self.net(x)


class SyntheticSpeechDataset(Dataset):
    """
    Generates acoustic prosody vectors for training & validation.
    """
    def __init__(self, num_samples=600):
        self.num_samples = num_samples
        np.random.seed(123)
        self.features = []
        self.labels = []
        for _ in range(num_samples):
            cls = np.random.randint(0, NUM_SPEECH_CLASSES)
            # 16 acoustic features
            vec = np.random.normal(0.0, 1.0, FEATURE_DIM).astype(np.float32)
            if cls == 0:  # Calm/Gentle
                vec[0] -= 0.8  # lower pitch
                vec[1] -= 0.5  # moderate energy
            elif cls == 1:  # Joyful/Expressive
                vec[0] += 1.2  # higher pitch
                vec[1] += 1.0  # high energy
                vec[2] += 0.8  # lively ZCR
            elif cls == 3:  # Hesitant/Quiet
                vec[1] -= 1.2  # low energy
                vec[6] += 1.5  # higher pause ratio

            self.features.append(vec)
            self.labels.append(cls)

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        return torch.tensor(self.features[idx]), torch.tensor(self.labels[idx], dtype=torch.long)


def compute_metrics(y_true, y_pred, num_classes):
    cm = np.zeros((num_classes, num_classes), dtype=int)
    for t, p in zip(y_true, y_pred):
        cm[t, p] += 1

    accuracy = np.trace(cm) / np.sum(cm) if np.sum(cm) > 0 else 0.0
    precisions, recalls, f1s = [], [], []

    for i in range(num_classes):
        tp = cm[i, i]
        fp = np.sum(cm[:, i]) - tp
        fn = np.sum(cm[i, :]) - tp

        prec = tp / (tp + fp) if (tp + fp) > 0 else 0.0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0.0
        f1 = (2 * prec * rec) / (prec + rec) if (prec + rec) > 0 else 0.0

        precisions.append(prec)
        recalls.append(rec)
        f1s.append(f1)

    return {
        "accuracy": round(float(accuracy), 4),
        "macro_precision": round(float(np.mean(precisions)), 4),
        "macro_recall": round(float(np.mean(recalls)), 4),
        "macro_f1": round(float(np.mean(f1s)), 4),
        "confusion_matrix": cm.tolist()
    }


def train_speech_model(epochs=10, batch_size=32, lr=0.005, output_dir="../model_artifacts"):
    print("=== Training LumiSpeechNet (Vocal Prosody & Engagement Classifier) ===")
    os.makedirs(output_dir, exist_ok=True)

    dataset = SyntheticSpeechDataset(num_samples=800)
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_set, val_set = torch.utils.data.random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False)

    model = LumiSpeechNet()
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        for x, y in train_loader:
            optimizer.zero_grad()
            out = model(x)
            loss = criterion(out, y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * x.size(0)

        train_loss = total_loss / len(train_set)

        # Validation
        model.eval()
        val_preds, val_targets = [], []
        with torch.no_grad():
            for x, y in val_loader:
                out = model(x)
                preds = torch.argmax(out, dim=1).numpy()
                val_preds.extend(preds)
                val_targets.extend(y.numpy())

        metrics = compute_metrics(val_targets, val_preds, NUM_SPEECH_CLASSES)
        if epoch % 2 == 0 or epoch == epochs:
            print(f"Epoch {epoch}/{epochs} | Loss: {train_loss:.4f} | Val Acc: {metrics['accuracy']:.2%} | F1: {metrics['macro_f1']:.4f}")

    print("\n--- Final Speech Evaluation Metrics ---")
    print(f"Accuracy:        {metrics['accuracy']:.2%}")
    print(f"Macro Precision: {metrics['macro_precision']:.4f}")
    print(f"Macro Recall:    {metrics['macro_recall']:.4f}")
    print(f"Macro F1 Score:  {metrics['macro_f1']:.4f}")
    print("Confusion Matrix:")
    for row in metrics["confusion_matrix"]:
        print(row)

    checkpoint_path = os.path.join(output_dir, "lumi_speech_net.pt")
    torch.save(model.state_dict(), checkpoint_path)
    print(f"\n[OK] Saved speech model checkpoint to {checkpoint_path}")

    # Export TorchScript format
    try:
        example_input = torch.randn(1, FEATURE_DIM)
        traced_model = torch.jit.trace(model, example_input)
        traced_path = os.path.join(output_dir, "lumi_speech_net.torchscript")
        traced_model.save(traced_path)
        print(f"[OK] Exported TorchScript speech model to {traced_path}")
    except Exception as e:
        print(f"TorchScript export skipped: {e}")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=8)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=0.005)
    args = parser.parse_args()

    train_speech_model(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
