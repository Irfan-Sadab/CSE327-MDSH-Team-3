import { Calendar } from 'lucide-react';

/**
 * Renders the "Meet our Doctors" grid.
 *
 * @param {object} props
 * @param {import('../types').Doctor[]} props.doctors
 * @param {boolean} props.loading
 * @param {Error|null} props.error
 * @param {(doctorId: string) => void} props.onBook
 */
export function DoctorsSection({ doctors = [], loading, error, onBook }) {
  const fallbackDoctors =
    doctors.length > 0
      ? doctors
      : [
          {
            id: 'doctor-henry',
            name: 'Dr. Robert Henry',
            specialty: 'Cardiologist',
            rating: 4.9,
            reviewCount: 102,
          },
          {
            id: 'doctor-littleton',
            name: 'Dr. Harry Littleton',
            specialty: 'Neurologist',
            rating: 4.8,
            reviewCount: 97,
          },
          {
            id: 'doctor-sharina',
            name: 'Dr. Sharina Khan',
            specialty: 'Gynecologist',
            rating: 4.7,
            reviewCount: 115,
          },
          {
            id: 'doctor-sanjeev',
            name: 'Dr. Sanjeev Kapoor',
            specialty: 'Child Specialist',
            rating: 4.9,
            reviewCount: 72,
          },
        ];

  const list = doctors.length > 0 ? doctors : fallbackDoctors;

  return (
    <section id="doctors-section" className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900">Meet our Doctors</h2>
          <p className="text-gray-600">
            {loading
              ? 'Loading our specialists…'
              : 'Well-qualified doctors are ready to serve you.'}
            {error ? ` (${error.message})` : ''}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          {list.map((doctor) => (
            <div key={doctor.id ?? doctor.name} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-40 bg-gradient-to-br from-blue-600 to-indigo-500 rounded-xl mb-6 flex items-center justify-center text-white text-2xl font-bold">
                {doctor.name
                  ?.split(' ')
                  .map((word) => word[0])
                  .join('') ?? 'DR'}
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{doctor.name}</h3>
              <p className="text-blue-600 font-medium mt-2">{doctor.specialty}</p>
              <div className="flex items-center space-x-2 mt-4 text-sm text-gray-500">
                <span>⭐ {doctor.rating ?? '5.0'}</span>
                <span>({doctor.reviewCount ?? 120})</span>
              </div>
              <button
                onClick={() => onBook(doctor.id)}
                className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                <span>Book an Appointment</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default DoctorsSection;
