import { Mail, MapPin, Phone } from 'lucide-react';

/**
 * Contact CTA panel with phone, email and address.
 *
 * @param {object} props
 * @param {import('../types').AboutPayload|null} props.info
 */
export function ContactSection({ info }) {
  const phone = info?.phone ?? '+880 1999-123456';
  const email = info?.email ?? 'care@pawcare.vet';
  const address = info?.address ?? '123 Pet Street, Animal City';

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-8">Get In Touch</h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <Phone className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Call Us</h3>
            <p>{phone}</p>
          </div>

          <div className="flex flex-col items-center">
            <Mail className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Us</h3>
            <p>{email}</p>
          </div>

          <div className="flex flex-col items-center">
            <MapPin className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
            <p>{address}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactSection;
