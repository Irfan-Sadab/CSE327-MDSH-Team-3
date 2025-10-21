import { Loader2, X } from 'lucide-react';

/**
 * Registration modal UI.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {{ fullName: string, email: string, password: string, confirmPassword: string }} props.form
 * @param {(field: 'fullName' | 'email' | 'password' | 'confirmPassword', value: string) => void} props.onChange
 * @param {(event: import('react').FormEvent<HTMLFormElement>) => void} props.onSubmit
 * @param {() => void} props.onClose
 * @param {() => void} props.onLoginLink
 * @param {boolean} props.loading
 * @param {string} props.error
 */
export function RegisterModal({
  open,
  form,
  onChange,
  onSubmit,
  onClose,
  onLoginLink,
  loading,
  error,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close register modal"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
        <p className="text-gray-600 mb-6">
          Join PawCare to book appointments and stay in touch with your care team.
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="register-full-name" className="sr-only">
              Full Name
            </label>
            <input
              id="register-full-name"
              type="text"
              required
              value={form.fullName}
              onChange={(event) => onChange('fullName', event.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="register-email" className="sr-only">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              required
              value={form.email}
              onChange={(event) => onChange('email', event.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="register-password" className="sr-only">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              required
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="register-confirm-password" className="sr-only">
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              required
              value={form.confirmPassword}
              onChange={(event) => onChange('confirmPassword', event.target.value)}
              placeholder="Confirm Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>Create account</span>
          </button>
        </form>

        <button
          type="button"
          onClick={onClose}
          className="w-full mt-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Cancel
        </button>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Already have an account?{' '}
            <button
              type="button"
              onClick={onLoginLink}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
