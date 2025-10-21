import { format, parseISO } from 'date-fns';
import { Loader2, X } from 'lucide-react';

/**
 * Appointment confirmation modal.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {import('../types').AppointmentSlot|null} props.slot
 * @param {import('../types').Doctor|null} props.doctor
 * @param {{ patientName: string, patientEmail: string, notes: string }} props.form
 * @param {(field: 'patientName' | 'patientEmail' | 'notes', value: string) => void} props.onChange
 * @param {(event: import('react').FormEvent<HTMLFormElement>) => void} props.onSubmit
 * @param {() => void} props.onClose
 * @param {boolean} props.loading
 * @param {string} props.errorMessage
 * @param {string} props.successMessage
 */
export function AppointmentModal({
  open,
  slot,
  doctor,
  form,
  onChange,
  onSubmit,
  onClose,
  loading,
  errorMessage,
  successMessage,
}) {
  if (!open || !slot) return null;

  const start = format(parseISO(slot.startTime), 'EEEE, MMMM d, yyyy, hh:mm a');
  const end = format(parseISO(slot.endTime), 'hh:mm a');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl relative">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close appointment modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">Confirm Appointment</h2>
        <p className="text-gray-600 mb-6">
          You are booking with <span className="font-semibold">{doctor?.name}</span> ({doctor?.specialty}) on{' '}
          <span className="font-semibold">{start}</span> &ndash; {end}.
        </p>

        {errorMessage && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {successMessage}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="appointment-name" className="block text-sm font-medium text-gray-700 mb-1">
              Patient Name
            </label>
            <input
              id="appointment-name"
              type="text"
              required
              value={form.patientName}
              onChange={(event) => onChange('patientName', event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="appointment-email" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              id="appointment-email"
              type="email"
              required
              value={form.patientEmail}
              onChange={(event) => onChange('patientEmail', event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label htmlFor="appointment-notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes (optional)
            </label>
            <textarea
              id="appointment-notes"
              rows={3}
              value={form.notes}
              onChange={(event) => onChange('notes', event.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
              placeholder="Share symptoms or special requests…"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            <span>Confirm Appointment</span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default AppointmentModal;
