import { KpiCards } from './kpi-cards';
import { DisruptionMap } from './disruption-map';
import { DynamicAlertsFeed } from './dynamic-alerts-feed';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin, AlertTriangle, Users, Clock } from 'lucide-react';

const activeHotspots = [
  { location: 'Bistupur Market Area', incidents: 12, severity: 'high', cluster: 'DBSCAN-A' },
  { location: 'Sakchi Main Road', incidents: 8, severity: 'medium', cluster: 'DBSCAN-B' },
  { location: 'Sonari Industrial Zone', incidents: 6, severity: 'medium', cluster: 'DBSCAN-C' },
  { location: 'Kadma Junction', incidents: 5, severity: 'low', cluster: 'DBSCAN-D' },
];

const additionalMetrics = [
  {
    title: 'New Incidents',
    value: '23',
    subtitle: 'Last Hour',
    icon: AlertTriangle,
    bgGradient: 'from-blue-50 to-cyan-50',
    darkBgGradient: 'dark:from-blue-900/30 dark:to-cyan-900/30',
    iconColor: 'text-blue-600',
    darkIconColor: 'dark:text-blue-400',
    detail: 'Reported in last 60 minutes',
  },
  {
    title: 'Field Teams Active',
    value: '18',
    subtitle: 'Active Now',
    icon: Users,
    bgGradient: 'from-green-50 to-emerald-50',
    darkBgGradient: 'dark:from-green-900/30 dark:to-emerald-900/30',
    iconColor: 'text-green-600',
    darkIconColor: 'dark:text-green-400',
    detail: 'Currently deployed across Jamshedpur',
  },
  {
    title: 'Avg Response Time',
    value: '3.9m',
    subtitle: 'Today',
    icon: Clock,
    bgGradient: 'from-purple-50 to-pink-50',
    darkBgGradient: 'dark:from-purple-900/30 dark:to-pink-900/30',
    iconColor: 'text-purple-600',
    darkIconColor: 'dark:text-purple-400',
    detail: 'Target: < 5 minutes',
  },
];

export function DashboardView() {
  return (
    <div className="space-y-6">
      {/* Top Metrics Row - 4 Main KPI Cards */}
      <KpiCards />

      {/* Additional 3 Metrics Cards - Total 7 Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {additionalMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card
              key={index}
              className="border border-gray-200 dark:border-blue-900/50 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:border-blue-400 dark:hover:border-blue-500 cursor-pointer overflow-hidden group"
            >
              <CardContent className={`p-6 bg-gradient-to-br ${metric.bgGradient} ${metric.darkBgGradient}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-12 h-12 bg-white dark:bg-slate-800 rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-6 h-6 ${metric.iconColor} ${metric.darkIconColor}`} />
                  </div>
                  <Badge className="bg-blue-500 dark:bg-blue-600 text-white text-xs">{metric.subtitle}</Badge>
                </div>
                <p className="text-xs font-semibold text-gray-700 dark:text-slate-300 mb-1 uppercase tracking-wide">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{metric.value}</p>
                <p className="text-xs text-gray-600 dark:text-slate-400">{metric.detail}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Grid - Map + High Priority Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Live Disruption Map with Action Card Below */}
        <div className="lg:col-span-2">
          <DisruptionMap />
        </div>

        {/* Dynamic High Priority Alerts Feed */}
        <div>
          <DynamicAlertsFeed />
        </div>
      </div>

      {/* Active Hotspots - DBSCAN Clustering */}
      <Card className="border-gray-200 dark:border-gray-700 shadow-lg">
        <CardHeader className="border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-blue-900 dark:text-blue-300 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Active Hotspots (DBSCAN Clustering)
              </CardTitle>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Real-time incident clustering analysis</p>
            </div>
            <Badge className="bg-purple-600 dark:bg-purple-700 text-white">Live</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 dark:bg-gray-900/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeHotspots.map((hotspot, index) => (
              <div
                key={index}
                className="relative p-5 rounded-xl border-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer group"
                style={{
                  borderColor:
                    hotspot.severity === 'high'
                      ? '#ef4444'
                      : hotspot.severity === 'medium'
                      ? '#f59e0b'
                      : '#10b981',
                }}
              >
                <div className="absolute top-2 right-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      hotspot.severity === 'high'
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-700'
                        : hotspot.severity === 'medium'
                        ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-700'
                        : 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700'
                    }`}
                  >
                    {hotspot.cluster}
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <MapPin
                    className={`w-8 h-8 mb-2 ${
                      hotspot.severity === 'high'
                        ? 'text-red-600 dark:text-red-500'
                        : hotspot.severity === 'medium'
                        ? 'text-orange-600 dark:text-orange-500'
                        : 'text-green-600 dark:text-green-500'
                    }`}
                  />
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                    {hotspot.location}
                  </h4>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Incidents</span>
                  </div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{hotspot.incidents}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}