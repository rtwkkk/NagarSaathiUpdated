import { useState } from 'react';
import { useAuth } from '../contexts/auth-context';
import { useDarkMode } from '../contexts/dark-mode-context';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertCircle, MapPin, Mail, Lock, User, Shield } from 'lucide-react';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export function AuthPage({ onAuthSuccess }: AuthPageProps) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [region, setRegion] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const { darkMode } = useDarkMode();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let success = false;
      
      if (isSignIn) {
        success = await signIn(email, password);
        if (!success) {
          setError('Invalid email or password');
        }
      } else {
        if (!name || !region) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }
        success = await signUp(name, email, password, region);
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }

      if (success) {
        onAuthSuccess();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const regions = [
    'Jamshedpur',
    'Bistupur',
    'Sakchi',
    'Sonari',
    'Kadma',
    'Mango',
    'Jugsalai',
    'Dhatkidih',
  ];

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900/20 to-cyan-900/20' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/20'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}></div>
      </div>

      <Card className={`relative w-full max-w-md shadow-2xl ${
        darkMode 
          ? 'bg-[#2a2a3e] border-[#f3f3f5]' 
          : 'border-gray-300'
      }`}>
        {/* Header */}
        <CardHeader className={`border-b-2 ${darkMode ? 'border-[#f3f3f5]/20' : 'border-gray-200'} bg-gradient-to-r from-blue-700 to-blue-900 rounded-t-lg`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Shield className="w-8 h-8 text-blue-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-white mb-1">NAGAR ALERT HUB</CardTitle>
            <p className="text-blue-200 text-sm">Municipal Administration Portal</p>
            <Badge className="bg-white/20 text-white mt-2">Government of India</Badge>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* Toggle Tabs */}
          <div className={`flex rounded-lg p-1 mb-6 ${
            darkMode ? 'bg-[#1a1a2e]' : 'bg-gray-100'
          }`}>
            <button
              onClick={() => {
                setIsSignIn(true);
                setError('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-200 ${
                isSignIn
                  ? 'bg-blue-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setIsSignIn(false);
                setError('');
              }}
              className={`flex-1 py-2.5 px-4 rounded-md font-semibold text-sm transition-all duration-200 ${
                !isSignIn
                  ? 'bg-blue-600 text-white shadow-md'
                  : darkMode
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-500 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name - Sign Up Only */}
            {!isSignIn && (
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <div className="relative">
                  <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                  }`} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-all ${
                      darkMode
                        ? 'bg-[#2a2a3e] border-2 border-[#f3f3f5] text-white placeholder-[#f3f3f5]/60'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required={!isSignIn}
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                }`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nagaralert.gov.in"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-all ${
                    darkMode
                      ? 'bg-[#2a2a3e] border-2 border-[#f3f3f5] text-white placeholder-[#f3f3f5]/60'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                  darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                }`} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-all ${
                    darkMode
                      ? 'bg-[#2a2a3e] border-2 border-[#f3f3f5] text-white placeholder-[#f3f3f5]/60'
                      : 'bg-gray-100 border-2 border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  required
                />
              </div>
            </div>

            {/* Region - Sign Up Only */}
            {!isSignIn && (
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Assigned Region
                </label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                    darkMode ? 'text-[#f3f3f5]' : 'text-gray-500'
                  }`} />
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 rounded-lg text-sm transition-all appearance-none ${
                      darkMode
                        ? 'bg-[#2a2a3e] border-2 border-[#f3f3f5] text-white placeholder-[#f3f3f5]/60'
                        : 'bg-gray-100 border-2 border-gray-300 text-gray-900'
                    } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    required={!isSignIn}
                  >
                    <option value="">Select your region...</option>
                    {regions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Please wait...' : isSignIn ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          {/* Footer Info */}
          {isSignIn && (
            <div className="mt-6 text-center">
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                For demo: Use any email and password
              </p>
            </div>
          )}
        </CardContent>

        {/* Footer */}
        <div className={`px-8 py-4 border-t-2 ${
          darkMode ? 'border-[#f3f3f5]/20 bg-[#1a1a2e]' : 'border-gray-200 bg-gray-50'
        } rounded-b-lg`}>
          <div className="text-center">
            <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Smart Cities Mission • Government of India
            </p>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              © 2026 Nagar Alert Hub • Version 2.1
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
