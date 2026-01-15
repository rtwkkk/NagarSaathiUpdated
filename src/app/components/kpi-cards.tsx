import { TrendingUp, CheckCircle, Clock, XCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useState } from 'react';
import { IncidentCategoryDetails } from './incident-category-details';
import { useNavigate } from 'react-router-dom';

const kpiData = [
  {
    title: 'Total Incidents',
    value: '1,247',
    change: '+5.2%',
    trend: 'up',
    subtitle: 'increase from yesterday',
    detail: 'Reported in last 24 hours across all wards',
    icon: TrendingUp,
    bgGradient: 'from-blue-500 to-blue-700',
    bgLight: 'from-blue-50 to-blue-100',
    darkBgLight: 'dark:from-blue-950/40 dark:to-slate-900/60',
    iconColor: 'text-blue-600',
    chartData: [20, 35, 30, 45, 40, 55, 50],
  },
  {
    title: 'Total Verified',
    value: '1,089',
    change: '+87.3%',
    trend: 'up',
    subtitle: 'verification rate',
    detail: '87.3% of all reports have been verified by officials',
    icon: CheckCircle,
    bgGradient: 'from-green-500 to-green-700',
    bgLight: 'from-green-50 to-green-100',
    darkBgLight: 'dark:from-green-950/40 dark:to-slate-900/60',
    iconColor: 'text-green-600',
    chartData: [30, 40, 35, 50, 45, 60, 55],
  },
  {
    title: 'Pending',
    value: '158',
    change: '-12.4%',
    trend: 'down',
    subtitle: 'awaiting verification',
    detail: 'Average verification time: 8.5 minutes',
    icon: Clock,
    bgGradient: 'from-orange-500 to-orange-700',
    bgLight: 'from-orange-50 to-orange-100',
    darkBgLight: 'dark:from-orange-950/40 dark:to-slate-900/60',
    iconColor: 'text-orange-600',
    chartData: [50, 45, 40, 35, 30, 25, 20],
  },
  {
    title: 'Rejected',
    value: '34',
    change: '-3.1%',
    trend: 'down',
    subtitle: 'false reports dismissed',
    detail: 'Only 2.7% rejection rate - High data quality',
    icon: XCircle,
    bgGradient: 'from-red-500 to-red-700',
    bgLight: 'from-red-50 to-red-100',
    darkBgLight: 'dark:from-red-950/40 dark:to-slate-900/60',
    iconColor: 'text-red-600',
    chartData: [15, 18, 14, 12, 10, 8, 6],
  },
];

export function KpiCards() {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const navigate = useNavigate();

  const handleCardClick = (index: number) => {
    // Toggle card details
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleViewDetails = (index: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    
    // Total Incidents card - show category breakdown modal
    if (index === 0) {
      setShowCategoryModal(true);
    }
    // Verified card - navigate to incidents details with verified filter
    else if (index === 1) {
      navigate('/incidents/all', { state: { statusFilter: 'verified' } });
    }
    // Pending card - navigate to incidents details with pending filter
    else if (index === 2) {
      navigate('/incidents/all', { state: { statusFilter: 'pending' } });
    }
    // Rejected card - navigate to incidents details with rejected filter
    else if (index === 3) {
      navigate('/incidents/all', { state: { statusFilter: 'rejected' } });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => {
          const Icon = kpi.icon;
          const isExpanded = expandedCard === index;
          return (
            <div key={index} className="relative" onClick={() => handleCardClick(index)}>
              <Card className="border border-gray-200 dark:border-blue-900/50 shadow-md cursor-pointer overflow-hidden">
                <CardContent className="p-0">
                  {/* Default State */}
                  <div className={`p-6 bg-gradient-to-br ${kpi.bgLight} ${kpi.darkBgLight} transition-all duration-300`}>
                    {/* Icon & Trend */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${kpi.bgGradient} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${
                        kpi.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                      }`}>
                        <TrendingUp className={`w-4 h-4 ${
                          kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400 rotate-180'
                        }`} />
                        <span className={`text-sm font-bold ${
                          kpi.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {kpi.change}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <p className="text-sm font-semibold text-gray-700 dark:text-slate-300 mb-2 uppercase tracking-wide">{kpi.title}</p>
                    
                    {/* Value */}
                    <p className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{kpi.value}</p>

                    {/* Mini Trend Line */}
                    <div className="h-12 flex items-end gap-1 mb-2">
                      {kpi.chartData.map((height, idx) => (
                        <div
                          key={idx}
                          className={`flex-1 bg-gradient-to-t ${kpi.bgGradient} rounded-t opacity-40`}
                          style={{ height: `${height}%` }}
                        ></div>
                      ))}
                    </div>

                    {/* Details - Revealed on Click */}
                    <div className={`transition-all duration-300 overflow-hidden ${
                      isExpanded ? 'h-auto opacity-100' : 'h-0 opacity-0'
                    }`}>
                      <div className="mt-3 pt-3 border-t-2 border-gray-300 dark:border-slate-700">
                        <p className="text-xs text-gray-700 dark:text-slate-300 font-semibold mb-1">{kpi.change} {kpi.subtitle}</p>
                        <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">{kpi.detail}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 dark:text-slate-500">Updated: 2m ago</span>
                          <button 
                            onClick={(e) => handleViewDetails(index, e)}
                            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline"
                          >
                            {index === 0 ? 'View All Details →' : 'View Filtered →'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Category Details Modal */}
      {showCategoryModal && (
        <IncidentCategoryDetails 
          category="all" 
          onClose={() => setShowCategoryModal(false)} 
        />
      )}
    </>
  );
}