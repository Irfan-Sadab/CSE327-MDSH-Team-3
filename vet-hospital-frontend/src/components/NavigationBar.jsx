import { Heart, LogOut, UserCircle2 } from 'lucide-react';

/**
 * Top navigation bar with branding and auth controls.
 *
 * @param {object} props
 * @param {object|null} props.user
 * @param {boolean} props.initializing
 * @param {() => void} props.onLogin
 * @param {() => void} props.onRegister
 * @param {() => void} props.onLogout
 */
export function NavigationBar({ user, initializing, onLogin, onRegister, onLogout }) {
  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Heart className="text-blue-600 w-8 h-8" />
            <span className="text-2xl font-bold text-gray-800">PawCare Veterinary</span>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden sm:flex items-center space-x-2 text-gray-700">
                  <UserCircle2 className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">{user.displayName ?? user.email}</span>
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  disabled={initializing}
                  className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Login
                </button>
                <button
                  onClick={onRegister}
                  disabled={initializing}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;
