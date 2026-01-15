import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Layers, CheckCircle, Users } from 'lucide-react';

const mapLayers = [
  { id: 'traffic', label: 'Traffic', enabled: true, color: 'bg-blue-500' },
  { id: 'utility', label: 'Utility', enabled: true, color: 'bg-purple-500' },
  { id: 'disasters', label: 'Disasters', enabled: false, color: 'bg-red-500' },
  { id: 'protest', label: 'Protest', enabled: false, color: 'bg-orange-500' },
  { id: 'crime', label: 'Crime', enabled: false, color: 'bg-gray-700' },
  { id: 'infrastructure', label: 'Infrastructure', enabled: true, color: 'bg-yellow-500' },
  { id: 'health', label: 'Health', enabled: false, color: 'bg-pink-500' },
  { id: 'others', label: 'Others', enabled: true, color: 'bg-cyan-500' },
];

export function DisruptionMap() {
  const [layers, setLayers] = useState(mapLayers);
  const [showLiveDisruptions, setShowLiveDisruptions] = useState(true);

  const toggleLayer = (id: string) => {
    setLayers(layers.map(layer => 
      layer.id === id ? { ...layer, enabled: !layer.enabled } : layer
    ));
  };

  return (
    <>
      <Card className="border-gray-200 shadow-lg relative dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-800 dark:to-blue-950">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900 flex items-center gap-2 dark:text-white">
              <MapPin className="w-5 h-5 dark:text-blue-400" />
              Live Disruption Map - Jamshedpur
            </CardTitle>
            {/* Live Disruption Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Live Disruptions</span>
              <button
                onClick={() => setShowLiveDisruptions(!showLiveDisruptions)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  showLiveDisruptions ? 'bg-green-600' : 'bg-gray-300 dark:bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform shadow-md ${
                    showLiveDisruptions ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></div>
              </button>
              <Badge className={showLiveDisruptions ? 'bg-green-600 text-white' : 'bg-gray-400 text-white dark:bg-slate-600'}>
                {showLiveDisruptions ? 'ON' : 'OFF'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 relative">
          {/* Map Container */}
          <div className="relative w-full h-[600px] bg-gradient-to-br from-blue-100 to-cyan-100 rounded-b-lg overflow-hidden dark:bg-gradient-to-br dark:from-slate-800 dark:to-blue-950">
            {/* Simulated Map Background */}
            <div className="absolute inset-0 opacity-20 dark:opacity-30">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e40af" strokeWidth="0.5" className="dark:stroke-blue-400"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Map Markers - Conditionally Shown */}
            {showLiveDisruptions && (
              <>
                <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg animate-pulse dark:border-slate-800"></div>
                <div className="absolute top-1/2 left-1/2 w-5 h-5 bg-orange-500 rounded-full border-4 border-white shadow-lg animate-pulse dark:border-slate-800"></div>
                <div className="absolute top-2/3 left-1/4 w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-lg dark:border-slate-800"></div>
                <div className="absolute top-1/3 right-1/3 w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg animate-pulse dark:border-slate-800"></div>
                <div className="absolute bottom-1/4 right-1/4 w-5 h-5 bg-orange-500 rounded-full border-4 border-white shadow-lg dark:border-slate-800"></div>
              </>
            )}

            {/* Severity Levels Legend - Floating */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-2xl p-4 border-2 border-gray-200 dark:bg-slate-800 dark:border-slate-600">
              <h4 className="text-xs font-bold text-gray-700 mb-3 flex items-center gap-2 dark:text-white">
                <MapPin className="w-4 h-4 dark:text-blue-400" />
                Severity Levels
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full shadow-md"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">High - Critical</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Medium - Moderate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-md"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Low - Minor</span>
                </div>
              </div>
            </div>

            {/* Map Layers Panel - Right Side */}
            <div className="absolute top-6 right-6 bg-white rounded-xl shadow-2xl border-2 border-gray-200 w-56 dark:bg-slate-800 dark:border-slate-600">
              <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-700 dark:to-blue-950">
                <h4 className="text-xs font-bold text-gray-900 flex items-center gap-2 dark:text-white">
                  <Layers className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Map Layers
                </h4>
              </div>
              
              <div className="p-2 space-y-1.5">
                {layers.map((layer) => (
                  <div
                    key={layer.id}
                    className="flex items-center justify-between p-2 rounded-md border border-gray-200 bg-gray-50 hover:bg-blue-50 transition-all cursor-pointer dark:border-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600"
                    onClick={() => toggleLayer(layer.id)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 ${layer.color} rounded-full shadow-sm`}></div>
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{layer.label}</span>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button
                      className={`relative w-9 h-5 rounded-full transition-colors ${
                        layer.enabled ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-600'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-md ${
                          layer.enabled ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

    </>
  );
}