import { Calendar, Phone } from 'lucide-react';

/**
 * Hero banner with dynamic content from the backend.
 *
 * @param {object} props
 * @param {import('../types').HeroContent} props.content
 * @param {boolean} props.loading
 * @param {() => void} props.onPrimaryAction
 * @param {() => void} props.onSecondaryAction
 */
export function HeroSection({ content, loading, onPrimaryAction, onSecondaryAction }) {
  const title =
    content?.title ?? 'Compassionate Care for Your Beloved Pets';
  const subtitle =
    content?.subtitle ??
    'Providing exceptional veterinary services with state-of-the-art facilities and a team of experienced professionals who treat your pets like family.';
  const primaryLabel = content?.primaryCta?.label ?? 'Book Appointment';
  const secondaryLabel = content?.secondaryCta?.label ?? 'Emergency Call';

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            {loading ? 'Loading hospital data…' : title}
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            {loading ? 'Please wait while we prepare your personalized experience.' : subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onPrimaryAction}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              <Calendar className="w-5 h-5" />
              <span>{primaryLabel}</span>
            </button>
            <button
              onClick={onSecondaryAction}
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>{secondaryLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
