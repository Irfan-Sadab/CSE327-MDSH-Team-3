/**
 * Patient testimonials carousel placeholder.
 *
 * @param {object} props
 * @param {import('../types').Testimonial[]} props.testimonials
 */
export function TestimonialsSection({ testimonials = [] }) {
  const items =
    testimonials.length > 0
      ? testimonials
      : [
          {
            id: 'testimonial-1',
            quote:
              'The doctors and staff were incredibly kind and attentive. My pet recovered quickly thanks to their care.',
            author: 'Sara Ali Khan',
            role: 'Pet Owner',
            rating: 5,
          },
          {
            id: 'testimonial-2',
            quote: 'Booking appointments online is so convenient. Highly recommend PawCare!',
            author: 'Simon Target',
            role: 'Pet Parent',
            rating: 5,
          },
        ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Patients Testimonial</h2>
        <p className="text-gray-600 mb-12">Let’s see what our happy patients say.</p>

        <div className="grid md:grid-cols-2 gap-8">
          {items.map((testimonial) => (
            <div
              key={testimonial.id ?? testimonial.author}
              className="bg-white rounded-2xl shadow-lg p-8 text-left border border-gray-100"
            >
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                “{testimonial.quote}”
              </p>
              <div>
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
