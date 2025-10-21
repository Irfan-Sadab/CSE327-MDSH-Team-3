import { format, parseISO } from 'date-fns';

/**
 * Displays available appointment slots grouped by doctor.
 *
 * @param {object} props
 * @param {import('../types').Doctor[]} props.doctors
 * @param {import('../types').AppointmentSlot[]} props.slots
 * @param {(slot: import('../types').AppointmentSlot) => void} props.onSelectSlot
 * @param {boolean} props.loading
 * @param {Error|null} props.error
 */
export function AppointmentSection({ doctors = [], slots = [], onSelectSlot, loading, error }) {
  const doctorById = Object.fromEntries(doctors.map((doctor) => [doctor.id, doctor]));

  const grouped = slots
    .filter((slot) => slot.available !== false)
    .reduce((acc, slot) => {
      const doctorSlots = acc.get(slot.doctorId) ?? [];
      doctorSlots.push(slot);
      acc.set(slot.doctorId, doctorSlots);
      return acc;
    }, new Map());

  const doctorIds = doctors.map((doctor) => doctor.id);

  const hasData = grouped.size > 0;

  return (
    <section id="appointments" className="py-20 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Available Appointments</h2>
          <p className="text-gray-600">
            {loading
              ? 'Checking real-time availability…'
              : 'Choose a doctor and reserve a convenient time slot.'}
            {error ? ` (${error.message})` : ''}
          </p>
        </div>

        {!hasData && !loading ? (
          <div className="text-center text-gray-600">
            No appointment slots are currently published. Please check back later or contact support.
          </div>
        ) : (
          <div className="space-y-12">
            {(hasData ? doctorIds : doctors.map((doctor) => doctor.id)).map((doctorId) => {
              const doctor = doctorById[doctorId];
              const doctorSlots = grouped.get(doctorId) ?? [
                {
                  id: `${doctorId}-placeholder-1`,
                  doctorId,
                  startTime: new Date().toISOString(),
                  endTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                  available: true,
                },
              ];

              return (
                <div key={doctorId} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                    <div>
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {doctor?.name ?? 'Doctor'}
                      </h3>
                      <p className="text-blue-600">
                        {doctor?.specialty ?? 'Specialist'} · {doctorSlots.length} slots
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
                    {doctorSlots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => onSelectSlot(slot)}
                        className="border border-blue-100 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-lg transition-all bg-white"
                      >
                        <p className="text-sm text-gray-500">
                          {format(parseISO(slot.startTime), 'EEE, MMM d')}
                        </p>
                        <p className="mt-2 text-lg font-semibold text-gray-900">
                          {format(parseISO(slot.startTime), 'hh:mm a')} &ndash;{' '}
                          {format(parseISO(slot.endTime), 'hh:mm a')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default AppointmentSection;
