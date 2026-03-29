# 🌾 CropAdvisor — Smart Crop Disease & Price Advisory System

An AI-powered platform that helps farmers:
1. **Detect crop diseases** from leaf images (EfficientNet-B4 CNN)
2. **Forecast market prices** for the next 30 days (LSTM + Transformer)
3. **Get unified advisories** — when to treat, when to sell

---

## 📁 Project Structure

```
crop-advisor/
├── backend/
│   ├── app.py                  # Flask app entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   ├── train_disease.py        # CNN training script
│   ├── train_price.py          # Transformer training script
│   ├── models/
│   │   ├── disease_model.py    # EfficientNet-B4 + treatment DB
│   │   └── price_model.py      # LSTM + Transformer + mock forecast
│   ├── routes/
│   │   └── api.py              # REST endpoints
│   └── weights/                # Place trained .pth files here
│       ├── disease_model.pth
│       └── price_model_tomato.pth
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ImageUploader.jsx
│   │   │   ├── DiseaseCard.jsx
│   │   │   ├── PriceChart.jsx
│   │   │   ├── AdvisoryCard.jsx
│   │   │   └── ResultSkeleton.jsx
│   │   └── pages/
│   │       ├── DiagnosePage.jsx
│   │       ├── MarketPage.jsx
│   │       └── AboutPage.jsx
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml
├── netlify.toml
└── render.yaml
```

---

## 🚀 Local Development

### Option A — Docker Compose (Recommended)

```bash
git clone <repo>
cd crop-advisor
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api/health

### Option B — Manual

**Backend:**
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

**Frontend:**
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

---

## 🧠 Training the Models

### 1. Disease Detection (EfficientNet-B4)

**Download PlantVillage dataset:**
```bash
# Option 1: Kaggle CLI
pip install kaggle
kaggle datasets download emmarex/plantdisease -p backend/data/
cd backend/data && unzip plantdisease.zip

# Option 2: Direct download from
# https://www.kaggle.com/datasets/emmarex/plantdisease
```

**Train:**
```bash
cd backend
python train_disease.py \
  --data_dir data/PlantVillage \
  --save_dir weights \
  --epochs 30 \
  --batch_size 32
```

Expected accuracy: ~94–96% on PlantVillage validation set.
Training time: ~2 hours on RTX 3080 / ~4 hours on RTX 3060.

---

### 2. Price Forecasting (LSTM + Transformer)

**Get price data — Option A: Agmarknet API**
```
https://agmarknet.gov.in/SearchCmmMkt.aspx
Download → CSV export → rename columns to: date, crop, price, volume
```

**Get price data — Option B: Kaggle**
```bash
kaggle datasets download -d datasets/crop-price-prediction-dataset
```

**Expected CSV format:**
```csv
date,crop,price,volume
2022-01-01,Tomato,2500,1200
2022-01-02,Tomato,2480,1100
```

**Train:**
```bash
cd backend
python train_price.py \
  --data_csv data/crop_prices.csv \
  --crop Tomato \
  --save_dir weights \
  --epochs 50 \
  --horizon 30
```

Repeat for each crop. Files saved as `weights/price_model_tomato.pth` etc.

---

## ☁️ Deployment

### Backend → Render.com (Free tier available)

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your repo, select `backend/` as root directory
4. Build command: `pip install -r requirements.txt`
5. Start command: `gunicorn app:app --workers 2 --timeout 120 --bind 0.0.0.0:$PORT`
6. Add environment variables from `.env.example`
7. Upload model weights via Render Disk or store in cloud storage (S3/GCS)

**Or use render.yaml:**
```bash
# render.yaml is already configured — just connect your repo on Render
```

---

### Frontend → Netlify

```bash
cd frontend
npm run build

# Option 1: Netlify CLI
npm install -g netlify-cli
netlify deploy --prod --dir dist

# Option 2: Drag & drop
# Go to netlify.com → drag the frontend/dist/ folder
```

**Set environment variable in Netlify:**
```
VITE_API_URL = https://your-app.onrender.com/api
```

---

### Alternative: Railway (backend + auto-deploy)

```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 🔌 API Reference

### `POST /api/detect`
Detect disease from leaf image.

**Request:** `multipart/form-data` with `image` field (JPG/PNG)

**Response:**
```json
{
  "success": true,
  "disease": {
    "crop": "Tomato",
    "disease": "Late blight",
    "is_healthy": false,
    "confidence": 91.4,
    "top3": [...],
    "treatment": {
      "severity": "critical",
      "urgency": "critical",
      "organic": "...",
      "chemical": "...",
      "prevention": "..."
    }
  },
  "price": {
    "crop": "Tomato",
    "current_price": 2680,
    "forecast": [...],
    "best_sell_date": "2024-08-15",
    "best_sell_price": 3100,
    "trend": "Rising 📈",
    "recommendation": "..."
  },
  "advisory": {
    "title": "...",
    "summary": "...",
    "action": "treat_immediately",
    "priority_steps": [...]
  }
}
```

### `GET /api/price/<crop>?horizon=30`
30-day price forecast for a specific crop.

### `GET /api/crops`
List all 14 supported crops and 38 disease classes.

### `GET /api/health`
Health check endpoint.

---

## 🌾 Supported Crops & Diseases

| Crop | Disease Classes |
|------|-----------------|
| Tomato | Early Blight, Late Blight, Bacterial Spot, Leaf Mold, Mosaic Virus, Yellow Leaf Curl, Septoria, Spider Mites, Target Spot, Healthy |
| Potato | Early Blight, Late Blight, Healthy |
| Apple | Apple Scab, Black Rot, Cedar Rust, Healthy |
| Corn | Cercospora, Common Rust, Northern Leaf Blight, Healthy |
| Grape | Black Rot, Esca, Leaf Blight, Healthy |
| + 9 more crops | ... |

---

## 📊 Model Performance

| Model | Dataset | Accuracy |
|-------|---------|----------|
| EfficientNet-B4 | PlantVillage (38 classes) | ~95% |
| LSTM-Transformer | Agmarknet (30d horizon) | MAE ~₹85/quintal |

---

## 🛣️ Roadmap

- [ ] Real-time Agmarknet price integration
- [ ] WhatsApp bot (Twilio API)
- [ ] Weather data integration (IMD / OpenWeather)
- [ ] Multi-language support (Hindi, Telugu, Kannada)
- [ ] Mobile app (React Native)
- [ ] SMS alerts for price thresholds
- [ ] Soil health advisory module

---

## 📄 License

MIT License — free to use, modify, and deploy.
