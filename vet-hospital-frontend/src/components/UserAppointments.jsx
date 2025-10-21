import { format, parseISO } from 'date-fns';

/**
 * Displays the authenticated user's upcoming appointments.
 *
 * @param {object} props
 * @param {import('../types').AppointmentSummary[]} props.appointments
 * @param {boolean} props.loading
 * @param {Error|null} props.error
 */
export function UserAppointments({ appointments = [], loading, error }) {
  if (!appointments.length && !loading && !error) {
    return null;
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Upcoming Visits</h2>

        {loading ? (
          <p className="text-gray-600">Loading your appointments…</p>
        ) : error ? (
          <p className="text-red-600">Could not load appointments: {error.message}</p>
        ) : appointments.length === 0 ? (
          <p className="text-gray-600">You have no scheduled appointments yet.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="border border-gray-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {appointment.doctorName ?? 'Doctor'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(parseISO(appointment.slotStart), 'EEEE, MMM d, yyyy · hh:mm a')} –{' '}
                    {format(parseISO(appointment.slotEnd), 'hh:mm a')}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 capitalize">
                  {appointment.status ?? 'pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default UserAppointments;
