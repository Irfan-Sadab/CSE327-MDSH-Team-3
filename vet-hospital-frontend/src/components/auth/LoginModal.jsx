import { Loader2, MailCheck, X } from 'lucide-react';

/**
 * Login modal UI. Business logic is handled by the parent component.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {{ email: string, password: string }} props.form
 * @param {(field: 'email' | 'password', value: string) => void} props.onChange
 * @param {(event: import('react').FormEvent<HTMLFormElement>) => void} props.onSubmit
 * @param {() => void} props.onClose
 * @param {() => void} props.onRegisterLink
 * @param {() => void} props.onResetPassword
 * @param {boolean} props.loading
 * @param {boolean} props.resetLoading
 * @param {string} props.error
 * @param {string} props.resetMessage
 * @param {string} props.resetError
 */
export function LoginModal({
  open,
  form,
  onChange,
  onSubmit,
  onClose,
  onRegisterLink,
  onResetPassword,
  loading,
  resetLoading,
  error,
  resetMessage,
  resetError,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close login modal"
        >
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Log in to manage your appointments and health records.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {resetMessage && (
          <div className="mb-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <MailCheck className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{resetMessage}</span>
          </div>
        )}

        {resetError && (
          <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {resetError}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="sr-only">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={form.email}
              onChange={(event) => onChange('email', event.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="login-password" className="sr-only">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={form.password}
              onChange={(event) => onChange('password', event.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={onResetPassword}
              disabled={resetLoading}
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 disabled:opacity-60 flex items-center gap-2"
            >
              {resetLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>Forgot password?</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>Login</span>
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
            Need an account?{' '}
            <button
              type="button"
              onClick={onRegisterLink}
              className="font-semibold text-blue-600 hover:text-blue-700"
            >
              Register now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
