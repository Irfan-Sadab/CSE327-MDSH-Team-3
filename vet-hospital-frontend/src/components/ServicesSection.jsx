import { Award, Shield, Stethoscope } from 'lucide-react';

const defaultIconCycle = [Stethoscope, Shield, Award];

/**
 * Displays a grid of services offered by the hospital.
 *
 * @param {object} props
 * @param {import('../types').Service[]} props.services
 * @param {boolean} props.loading
 * @param {Error|null} props.error
 */
export function ServicesSection({ services = [], loading, error }) {
  if (error) {
    return (
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Medical Services</h2>
          <p className="text-gray-600">
            We ran into a problem loading services: {error.message}. Please try again later.
          </p>
        </div>
      </section>
    );
  }

  const items =
    services.length > 0
      ? services
      : [
          {
            id: 'lab',
            name: 'Well Equipped Lab',
            description: 'Modern diagnostics and rapid reporting.',
          },
          {
            id: 'ambulance',
            name: 'Emergency Ambulance',
            description: '24/7 on-call ambulance service.',
          },
          {
            id: 'appointment',
            name: 'Online Appointment',
            description: 'Book visits without leaving home.',
          },
          {
            id: 'call-center',
            name: 'Call Center',
            description: 'Dedicated patient support team.',
          },
        ];

  return (
    <section className="py-20 px-4 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-4">Our Medical Services</h2>
        <p className="text-center text-gray-600 mb-16">
          {loading
            ? 'Loading the latest services our hospital provides…'
            : 'We are dedicated to serving you with our best medical services.'}
        </p>

        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {items.map((service, index) => {
            const Icon = defaultIconCycle[index % defaultIconCycle.length];
            return (
              <div
                key={service.id ?? service.name}
                className={`p-8 rounded-xl shadow-lg transition-shadow bg-white hover:shadow-xl ${
                  index === 1 ? 'bg-gradient-to-br from-blue-600 to-indigo-500 text-white' : ''
                }`}
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-3">{service.name}</h3>
                <p className="text-sm opacity-80">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
