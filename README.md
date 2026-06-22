# Urban-Air-Quality-Intelligence
🌍 AeroGuard AI

AI-Powered Urban Air Quality Intelligence for Smart City Intervention

The Problem: India has over 900+ Continuous Ambient Air Quality Monitoring Stations (CAAQMS), yet a 2024 CAG audit found that only 31% of cities have actionable multi-agency response protocols. City administrations have data dashboards, but lack the intelligence to enforce source-level interventions.

AeroGuard AI bridges the gap between raw environmental data and municipal action. It fuses IoT sensor data, satellite thermal imagery, and mobility feeds to predict AQI spikes, attribute them to specific local sources, and automatically generate dispatch recommendations for enforcement officers.

✨ Core Features

🎯 Geospatial Source Attribution: Multi-modal AI analyzes AQI patterns against land use, traffic density, and satellite thermal anomalies to attribute pollution by source (Industrial, Vehicular, Dust) at a ward level.

📈 Hyperlocal Predictive Forecasting: Integrates meteorological forecasts and atmospheric dispersion modeling to provide highly accurate 24-72 hour AQI forecasts.

🚨 Enforcement Intelligence Agent: Automatically correlates predicted pollution hotspots with registered emission sources and generates prioritized, evidence-backed deployment sheets for inspectors.

📱 Citizen Health Risk Advisory: Pushes targeted, LLM-generated personalized advisories to vulnerable populations in regional languages before hazardous air masses arrive.

📂 Project Structure

For this hackathon, we have structured the repository into a full-stack monorepo containing the React frontend prototype, the Python backend AI agents, and our project documentation.

aeroguard-ai/
│
├── frontend/                  # Interactive React/Vite Dashboard
│   ├── src/
│   │   ├── App.jsx            # Main Dashboard Component (AI Simulation Logic)
│   │   ├── main.jsx           # React Entry Point
│   │   └── index.css          # Tailwind Directives
│   ├── package.json           
│   ├── tailwind.config.js     
│   └── vite.config.js         
│
├── backend/                   # Python AI & Data Processing APIs
│   ├── data/                  # Mock CAAQMS and Satellite Datasets
│   ├── models/                # Trained ML models (XGBoost/RandomForest)
│   ├── src/
│   │   ├── data_engine.py     # Ingests CAAQMS and Sentinel-5P telemetry
│   │   ├── forecasting.py     # Predictive AQI modeling logic
│   │   ├── enforcement.py     # Rule-based logic engine for interventions
│   │   └── main.py            # FastAPI Application Routing
│   └── requirements.txt       # Python dependencies
│
├── docs/                      # Presentation & Reports
│   ├── aeroguard_ai_pitch.html # Interactive HTML Slide Deck
│   └── aeroguard_ai_report.pdf # Comprehensive LaTeX Project Report
│
└── README.md                  # Project Documentation (You are here)


🚀 Getting Started

1. Running the Frontend Dashboard (Prototype)

The frontend is a standalone React application built with Vite and Tailwind CSS. It currently contains the simulated logic for the forecasting and enforcement agents for demonstration purposes.

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Install UI libraries used in the prototype
npm install recharts lucide-react tailwindcss @tailwindcss/vite

# Start the development server
npm run dev


Navigate to http://localhost:5173 in your browser to view the interactive dashboard.

2. Running the Backend AI Agents (Python)

The backend contains the modular Python logic for data ingestion, the machine learning forecasting models, and the enforcement recommendation engine.

# Navigate to the backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install required Python packages
pip install pandas numpy scikit-learn fastapi uvicorn

# Run the backend testing script
python src/main.py


(Note: To serve this as a live API for the frontend, you would run uvicorn src.main:app --reload once the FastAPI endpoints are fully wired up).

🛠️ Technology Stack

Frontend: React.js, Vite, Tailwind CSS, Recharts (Data Visualization), Lucide React (Icons).

Backend / AI: Python, Scikit-Learn (Random Forests/XGBoost), FastAPI, Pandas, NumPy.

Proposed Data Sources: CPCB CAAQMS APIs, Sentinel-5P (TROPOMI) Satellite Data, Google Maps/TomTom Mobility APIs.

👥 Team

Prateek Gaurav - Project Lead & Developer

Built for the 2026 Smart City Urban Intelligence Hackathon.
