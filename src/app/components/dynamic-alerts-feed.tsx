import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { AlertTriangle, MapPin, Clock, CheckCircle, XCircle, Eye, MessageCircle, X, User, Phone } from 'lucide-react';

type AlertStatus = 'pending' | 'verified' | 'rejected' | 'assigned';

interface Alert {
  id: string;
  title: string;
  location: string;
  time: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  status: AlertStatus;
  reportedBy: string;
  phone: string;
  assignedTeam?: string;
}

const initialAlerts: Alert[] = [
  {
    id: 'INC-001',
    title: 'Major Traffic Jam - Bistupur Circle',
    location: 'Bistupur Circle, Main Road',
    time: '2 mins ago',
    severity: 'critical',
    type: 'Traffic',
    status: 'pending',
    reportedBy: 'Raj Kumar',
    phone: '+91 98765 43210',
  },
  {
    id: 'INC-002',
    title: 'Power Outage - Residential Area',
    location: 'Kadma, Sector 5',
    time: '8 mins ago',
    severity: 'high',
    type: 'Power',
    status: 'verified',
    reportedBy: 'Priya Sharma',
    phone: '+91 98765 43211',
  },
  {
    id: 'INC-003',
    title: 'Water Pipe Burst',
    location: 'Sonari, Near Railway Station',
    time: '12 mins ago',
    severity: 'high',
    type: 'Water',
    status: 'assigned',
    reportedBy: 'Amit Singh',
    phone: '+91 98765 43212',
    assignedTeam: 'Team Alpha',
  },
  {
    id: 'INC-004',
    title: 'Road Blockage - Construction Debris',
    location: 'Sakchi, Station Road',
    time: '18 mins ago',
    severity: 'medium',
    type: 'Roadblock',
    status: 'rejected',
    reportedBy: 'Anonymous',
    phone: 'N/A',
  },
];

export function DynamicAlertsFeed() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const updateAlertStatus = (id: string, newStatus: AlertStatus, assignedTeam?: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: newStatus, assignedTeam } : alert
    ));
  };

  const handleVerify = (id: string) => {
    updateAlertStatus(id, 'verified');
  };

  const handleReject = (id: string) => {
    updateAlertStatus(id, 'rejected');
  };

  const handleAssign = (id: string) => {
    updateAlertStatus(id, 'assigned', 'Team Beta');
  };

  const getCardBackground = (status: AlertStatus) => {
    switch (status) {
      case 'verified':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-300';
      case 'rejected':
        return 'bg-gradient-to-br from-red-50 to-pink-50 border-red-300';
      case 'assigned':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <>
      <Card className="border-gray-200 shadow-lg dark:bg-slate-900 dark:border-slate-700">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50 dark:border-slate-700 dark:bg-gradient-to-r dark:from-slate-800 dark:to-red-950/30">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900 flex items-center gap-2 dark:text-white">
              <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
              New & High-Priority Alerts
            </CardTitle>
            <Badge className="bg-red-600 text-white">{alerts.length}</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4 max-h-[600px] overflow-y-auto scrollbar-hide">
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${getCardBackground(alert.status)} hover:shadow-lg dark:border-slate-600 ${
                  alert.status === 'verified' 
                    ? 'dark:bg-gradient-to-br dark:from-green-950/40 dark:to-emerald-950/40 dark:border-green-800' 
                    : alert.status === 'rejected'
                    ? 'dark:bg-gradient-to-br dark:from-red-950/40 dark:to-pink-950/40 dark:border-red-800'
                    : alert.status === 'assigned'
                    ? 'dark:bg-gradient-to-br dark:from-blue-950/40 dark:to-cyan-950/40 dark:border-blue-800'
                    : 'dark:bg-slate-800 dark:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        className={
                          alert.severity === 'critical'
                            ? 'bg-red-600 text-white'
                            : alert.severity === 'high'
                            ? 'bg-orange-500 text-white'
                            : alert.severity === 'medium'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-blue-500 text-white'
                        }
                      >
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800">
                        {alert.type}
                      </Badge>
                    </div>
                    <h4 className="font-semibold text-gray-900 text-sm mb-1 dark:text-white">
                      {alert.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-2 dark:text-gray-300">
                      <MapPin className="w-3 h-3 dark:text-blue-400" />
                      {alert.location}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 dark:text-blue-400" />
                      {alert.time}
                    </div>
                  </div>
                </div>

                {/* State 1: Pending - Verify/Reject Buttons */}
                {alert.status === 'pending' && (
                  <div className="flex items-center gap-2 mt-3">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
                      onClick={() => handleVerify(alert.id)}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-red-300 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                      onClick={() => handleReject(alert.id)}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}

                {/* State 2: Verified - Assign Team Button */}
                {alert.status === 'verified' && (
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={() => handleAssign(alert.id)}
                  >
                    Assign Team
                  </Button>
                )}

                {/* State 3: Rejected - Dismissed */}
                {alert.status === 'rejected' && (
                  <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-lg dark:bg-red-950/30 dark:border-red-800">
                    <p className="text-sm font-semibold text-red-800 flex items-center gap-2 dark:text-red-300">
                      <XCircle className="w-4 h-4" />
                      Incident Dismissed
                    </p>
                  </div>
                )}

                {/* State 4: Assigned - Team Assigned + View Details */}
                {alert.status === 'assigned' && (
                  <div className="mt-3 space-y-2">
                    <div className="p-3 bg-green-100 border border-green-300 rounded-lg dark:bg-green-950/30 dark:border-green-800">
                      <p className="text-sm font-semibold text-green-800 flex items-center gap-2 dark:text-green-300">
                        <CheckCircle className="w-4 h-4" />
                        Team Assigned: {alert.assignedTeam}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
                      onClick={() => setSelectedAlert(alert)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* View Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-1">
                    {selectedAlert.title}
                  </h2>
                  <p className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedAlert.location}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {/* User Name */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Reported By</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedAlert.reportedBy}</p>
                </div>

                {/* Phone */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Phone Number</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedAlert.phone}</p>
                </div>

                {/* Status */}
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Status</span>
                  </div>
                  <Badge className="bg-blue-600 text-white text-sm">
                    {selectedAlert.status.toUpperCase()}
                  </Badge>
                </div>

                {/* Timing */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-orange-600" />
                    <span className="text-sm font-medium text-gray-700">Reported</span>
                  </div>
                  <p className="text-lg font-bold text-gray-900">{selectedAlert.time}</p>
                </div>
              </div>

              {selectedAlert.assignedTeam && (
                <div className="p-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg border-2 border-blue-300 mb-6">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Assigned Team</p>
                  <p className="text-xl font-bold text-blue-900">{selectedAlert.assignedTeam}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setSelectedAlert(null)}
              >
                Close
              </Button>
              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat with Team
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}