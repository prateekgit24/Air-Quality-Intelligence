import React, { useState, useEffect, useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { 
  AlertTriangle, MapPin, Wind, Thermometer, Car, Factory, ShieldAlert, 
  Activity, CheckCircle2, Siren, Cloud, FileText, Download 
} from 'lucide-react';

// --- MOCK DATA & AI LOGIC SIMULATION ---

const WARDS = [
  { id: 'W-012', name: 'Peenya (Industrial Zone)', baseAqi: 280, traffic: 0.6, thermal: 4, dust: 0.3 },
  { id: 'W-055', name: 'Indiranagar (Traffic Corridor)', baseAqi: 190, traffic: 0.9, thermal: 0, dust: 0.2 },
  { id: 'W-074', name: 'Koramangala (Mixed Use)', baseAqi: 140, traffic: 0.5, thermal: 0, dust: 0.4 },
  { id: 'W-089', name: 'Bellandur (Construction)', baseAqi: 220, traffic: 0.7, thermal: 1, dust: 0.8 },
];

const COLORS = ['#f87171', '#fb923c', '#fbbf24', '#94a3b8']; // Red, Orange, Yellow, Slate

// Simulate a 72-hour forecast curve
const generateForecast = (baseAqi, traffic, thermal, dust) => {
  const data = [];
  let currentAqi = baseAqi;
  for (let i = 0; i <= 72; i += 3) {
    // Add realistic diurnal cycles (worse in early morning/evening)
    const timeOfDay = i % 24;
    const diurnalSpike = (timeOfDay >= 18 || timeOfDay <= 8) ? 30 : -20;
    
    // Introduce an artificial event peak around 24-36 hours based on ward characteristics
    const eventSpike = (i >= 24 && i <= 36) ? (thermal * 20 + traffic * 30 + dust * 15) : 0;
    
    // Add some noise
    const noise = Math.floor(Math.random() * 15) - 7;
    
    let aqi = Math.max(50, currentAqi + diurnalSpike + eventSpike + noise);
    
    data.push({
      hour: `+${i}h`,
      aqi: Math.floor(aqi)
    });
  }
  return data;
};

// Simulate source attribution percentages
const generateAttribution = (ward) => {
  const total = ward.traffic + ward.thermal + ward.dust + 0.5; // 0.5 is background
  return [
    { name: 'Industrial', value: Math.round((ward.thermal / total) * 100) },
    { name: 'Vehicular', value: Math.round((ward.traffic / total) * 100) },
    { name: 'Construction/Dust', value: Math.round((ward.dust / total) * 100) },
    { name: 'Background', value: Math.round((0.5 / total) * 100) },
  ];
};

// The Enforcement Agent Logic
const analyzeEnforcement = (ward, peakAqi) => {
  if (peakAqi < 150) {
    return {
      level: 'MONITOR',
      source: 'Background Levels',
      action: 'Routine surveillance. Air quality is within acceptable limits for this zone.',
      color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50',
      icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />
    };
  }

  if (ward.thermal > 2) {
    return {
      level: 'CRITICAL',
      source: 'Industrial Emissions (Thermal Anomalies Detected)',
      action: `Immediate dispatch of inspection drone squad to registered industrial sectors in ${ward.name}. Unauthorised stack emissions highly probable.`,
      color: 'bg-red-500/10 text-red-400 border-red-500/50',
      icon: <Factory className="w-8 h-8 text-red-400" />
    };
  }

  if (ward.traffic > 0.7) {
    return {
      level: 'HIGH',
      source: 'Vehicular Exhaust Gridlock',
      action: `Coordinate with Traffic Police Control Room. Reroute heavy commercial diesel vehicles bypassing the ${ward.name} junction for the next 12 hours.`,
      color: 'bg-orange-500/10 text-orange-400 border-orange-500/50',
      icon: <Car className="w-8 h-8 text-orange-400" />
    };
  }

  return {
    level: 'ELEVATED',
    source: 'Localized Dust / Suspended PM10',
    action: `Alert municipal beat officers to scan for illegal open waste burning or un-tarped construction sites in ${ward.name}. Issue compliance notices.`,
    color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/50',
    icon: <Cloud className="w-8 h-8 text-yellow-400" />
  };
};

// --- REACT COMPONENT ---

export default function App() {
  const [selectedWard, setSelectedWard] = useState(WARDS[0]);
  const [forecastData, setForecastData] = useState([]);
  const [attributionData, setAttributionData] = useState([]);
  const [enforcementPanel, setEnforcementPanel] = useState(null);
  const [currentAqi, setCurrentAqi] = useState(0);

  useEffect(() => {
    // Run AI Agents (Simulated)
    const newForecast = generateForecast(selectedWard.baseAqi, selectedWard.traffic, selectedWard.thermal, selectedWard.dust);
    const newAttribution = generateAttribution(selectedWard);
    
    // Find peak AQI in the next 72 hours
    const peakAqi = Math.max(...newForecast.map(d => d.aqi));
    const newEnforcement = analyzeEnforcement(selectedWard, peakAqi);

    setForecastData(newForecast);
    setAttributionData(newAttribution);
    setEnforcementPanel(newEnforcement);
    setCurrentAqi(newForecast[0].aqi);
  }, [selectedWard]);

  const getAqiColor = (aqi) => {
    if (aqi <= 100) return 'text-emerald-400';
    if (aqi <= 200) return 'text-yellow-400';
    if (aqi <= 300) return 'text-orange-400';
    return 'text-red-500';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans p-4 md:p-8">
      {/* HEADER */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <ShieldAlert className="w-8 h-8 text-emerald-500" />
            AeroGuard <span className="text-emerald-500 font-light">AI</span>
          </h1>
          <p className="text-slate-400 mt-1">Urban Air Quality Intelligence & Enforcement Platform</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 transition px-4 py-2 rounded-lg text-sm border border-slate-700">
            <FileText className="w-4 h-4" /> Export Briefing
          </button>
          <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 transition px-4 py-2 rounded-lg text-sm text-white font-medium">
            <Activity className="w-4 h-4" /> Live CAAQMS Sync
          </button>
        </div>
      </header>

      {/* TOP CONTROLS */}
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="w-full md:w-1/3 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h2 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Select City Zone
          </h2>
          <div className="flex flex-col gap-2">
            {WARDS.map(ward => (
              <button
                key={ward.id}
                onClick={() => setSelectedWard(ward)}
                className={`text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedWard.id === ward.id 
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' 
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="font-medium">{ward.name}</div>
                <div className="text-xs opacity-70 mt-1">ID: {ward.id}</div>
              </button>
            ))}
          </div>
        </div>

        {/* KPI CARDS */}
        <div className="w-full md:w-2/3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <Wind className="w-4 h-4" /> Current AQI
            </div>
            <div className={`text-4xl font-bold mt-2 ${getAqiColor(currentAqi)}`}>
              {currentAqi}
            </div>
            <div className="text-xs text-slate-500 mt-2">PM2.5 / PM10 Avg</div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <Thermometer className="w-4 h-4" /> Thermal Anomalies
            </div>
            <div className="text-4xl font-bold text-white mt-2">
              {selectedWard.thermal}
            </div>
            <div className="text-xs text-slate-500 mt-2">Sentinel-5P Satellite</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <Car className="w-4 h-4" /> Traffic Density
            </div>
            <div className="text-4xl font-bold text-white mt-2">
              {(selectedWard.traffic * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-slate-500 mt-2">Mobility API Feed</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
            <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Forecast Peak
            </div>
            <div className={`text-4xl font-bold mt-2 ${getAqiColor(Math.max(...forecastData.map(d => d.aqi)))}`}>
              {Math.max(...forecastData.map(d => d.aqi))}
            </div>
            <div className="text-xs text-slate-500 mt-2">Next 72 Hours</div>
          </div>
        </div>
      </div>

      {/* MIDDLE ROW: CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* FORECAST CHART */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">72-Hour Predictive AQI Forecast</h2>
            <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700">Model: XGBoost / Dispersion</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAqi" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorAqi)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* SOURCE ATTRIBUTION PIE */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-2">Pollution Source Attribution</h2>
          <p className="text-sm text-slate-500 mb-4">AI multi-modal estimation</p>
          <div className="flex-grow flex items-center justify-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value) => [`${value}%`, 'Contribution']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {attributionData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2 text-xs text-slate-300">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                {entry.name} ({entry.value}%)
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: ENFORCEMENT AGENT */}
      {enforcementPanel && (
        <div className={`rounded-xl border p-6 shadow-lg backdrop-blur-sm ${enforcementPanel.color}`}>
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="p-4 bg-slate-950/50 rounded-full border border-inherit">
              {enforcementPanel.icon}
            </div>
            <div className="flex-grow">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-bold uppercase tracking-wide">
                  Enforcement Agent: {enforcementPanel.level}
                </h2>
              </div>
              <div className="mb-4">
                <span className="font-semibold opacity-90">Primary Target:</span> {enforcementPanel.source}
              </div>
              <div className="bg-slate-950/50 p-4 rounded-lg border border-inherit shadow-inner">
                <p className="text-lg leading-relaxed font-medium">
                  "{enforcementPanel.action}"
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[200px]">
              <button className="w-full bg-slate-950/80 hover:bg-slate-900 border border-inherit transition py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2">
                <Siren className="w-5 h-5" /> Dispatch Team
              </button>
              <button className="w-full bg-transparent hover:bg-slate-950/30 border border-inherit transition py-2 px-4 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                <FileText className="w-4 h-4" /> Generate Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
