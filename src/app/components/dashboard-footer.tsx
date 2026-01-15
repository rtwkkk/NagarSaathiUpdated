import { Phone } from 'lucide-react';

export function DashboardFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <p className="text-sm text-gray-600">
            © 2026 Nagar Alert Hub - Powered by Community Coders
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span className="font-medium">Authority Helpline:</span>
          <span className="text-blue-900 font-semibold">1800-XXX-XXXX</span>
        </div>
      </div>
    </footer>
  );
}
