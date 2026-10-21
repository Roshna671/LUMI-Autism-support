"""
LUMI Facial Expression & Engagement Training Pipeline
Dataset Support: FER-2013 / Synthetic Face Landmark Tensors
Architecture: LumiExpressionNet (Deep Convolutional & Dense Architecture)
Evaluation: Precision, Recall, Macro F1, Confusion Matrix
"""

import os
import argparse
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

CLASSES = ["Neutral", "Happy/Engaged", "Calm/Attentive", "Curious/Surprised", "Tired/Fatigued"]
NUM_CLASSES = len(CLASSES)

class LumiExpressionNet(nn.Module):
    """
    Compact lightweight CNN for facial emotion and visual engagement classification.
    Processes 48x48 single-channel normalized face crops.
    """
    def __init__(self, num_classes=NUM_CLASSES):
        super(LumiExpressionNet, self).__init__()
        self.features = nn.Sequential(
            nn.Conv2d(1, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 24x24

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 12x12

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),  # 6x6
        )
        self.classifier = nn.Sequential(
            nn.Dropout(0.3),
            nn.Linear(128 * 6 * 6, 256),
            nn.ReLU(),
            nn.Dropout(0.2),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        feat = self.features(x)
        flattened = feat.view(feat.size(0), -1)
        out = self.classifier(flattened)
        return out


class SyntheticFaceDataset(Dataset):
    """
    Generates structured facial feature patterns for pipeline validation and offline training.
    """
    def __init__(self, num_samples=600):
        self.num_samples = num_samples
        np.random.seed(42)
        self.data = []
        self.labels = []
        for _ in range(num_samples):
            cls = np.random.randint(0, NUM_CLASSES)
            # Create synthetic 48x48 image with distinctive class patterns
            img = np.random.normal(0.4, 0.1, (1, 48, 48)).astype(np.float32)
            # Add synthetic smiling or attentive eye/mouth patterns
            if cls == 1:  # Happy/Engaged
                img[:, 32:38, 16:32] += 0.4  # mouth curve
            elif cls == 2:  # Calm/Attentive
                img[:, 16:24, 14:22] += 0.3  # focused gaze
                img[:, 16:24, 26:34] += 0.3
            self.data.append(img)
            self.labels.append(cls)

    def __len__(self):
        return self.num_samples

    def __getitem__(self, idx):
        return torch.tensor(self.data[idx]), torch.tensor(self.labels[idx], dtype=torch.long)


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

    macro_f1 = float(np.mean(f1s))
    macro_prec = float(np.mean(precisions))
    macro_rec = float(np.mean(recalls))

    return {
        "accuracy": round(float(accuracy), 4),
        "macro_precision": round(macro_prec, 4),
        "macro_recall": round(macro_rec, 4),
        "macro_f1": round(macro_f1, 4),
        "confusion_matrix": cm.tolist()
    }


def train_fer_model(epochs=5, batch_size=32, lr=0.001, output_dir="../model_artifacts"):
    print("=== Training LumiExpressionNet (FER Emotion & Engagement Classifier) ===")
    os.makedirs(output_dir, exist_ok=True)

    dataset = SyntheticFaceDataset(num_samples=800)
    train_size = int(0.8 * len(dataset))
    val_size = len(dataset) - train_size
    train_set, val_set = torch.utils.data.random_split(dataset, [train_size, val_size])

    train_loader = DataLoader(train_set, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_set, batch_size=batch_size, shuffle=False)

    device = torch.device("cpu")
    model = LumiExpressionNet(num_classes=NUM_CLASSES).to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=lr, weight_decay=1e-4)

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        for images, labels in train_loader:
            images, labels = images.to(device), labels.to(device)
            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * images.size(0)

        train_loss = total_loss / len(train_set)

        # Validation
        model.eval()
        val_preds, val_targets = [], []
        with torch.no_grad():
            for images, labels in val_loader:
                images = images.to(device)
                outputs = model(images)
                preds = torch.argmax(outputs, dim=1).cpu().numpy()
                val_preds.extend(preds)
                val_targets.extend(labels.numpy())

        metrics = compute_metrics(val_targets, val_preds, NUM_CLASSES)
        print(f"Epoch {epoch}/{epochs} | Loss: {train_loss:.4f} | Val Acc: {metrics['accuracy']:.2%} | F1: {metrics['macro_f1']:.4f}")

    # Final evaluation
    print("\n--- Final Model Evaluation ---")
    print(f"Accuracy:        {metrics['accuracy']:.2%}")
    print(f"Macro Precision: {metrics['macro_precision']:.4f}")
    print(f"Macro Recall:    {metrics['macro_recall']:.4f}")
    print(f"Macro F1 Score:  {metrics['macro_f1']:.4f}")
    print("Confusion Matrix:")
    for row in metrics["confusion_matrix"]:
        print(row)

    # Save model weights & TorchScript
    checkpoint_path = os.path.join(output_dir, "lumi_expression_net.pt")
    torch.save(model.state_dict(), checkpoint_path)
    print(f"\n[OK] Saved model checkpoint to {checkpoint_path}")

    # Export TorchScript format for high-speed inference
    try:
        example_input = torch.randn(1, 1, 48, 48)
        traced_model = torch.jit.trace(model, example_input)
        traced_path = os.path.join(output_dir, "lumi_expression_net.torchscript")
        traced_model.save(traced_path)
        print(f"[OK] Exported TorchScript model to {traced_path}")
    except Exception as e:
        print(f"TorchScript export skipped: {e}")

    return metrics


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--epochs", type=int, default=3)
    parser.add_argument("--batch_size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=0.001)
    args = parser.parse_args()

    train_fer_model(epochs=args.epochs, batch_size=args.batch_size, lr=args.lr)
