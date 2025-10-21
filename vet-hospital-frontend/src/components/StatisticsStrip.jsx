/**
 * Displays a trio of headline statistics beneath the services section.
 *
 * @param {object} props
 * @param {import('../types').Statistic[]} props.statistics
 */
export function StatisticsStrip({ statistics = [] }) {
  const items =
    statistics.length > 0
      ? statistics
      : [
          { id: 'patients', label: 'Patients Treated', value: '10K+' },
          { id: 'success', label: 'Successful Surgeries', value: '98%' },
          { id: 'years', label: 'Years of Excellence', value: '25+' },
        ];

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 text-center">
        {items.map((stat) => (
          <div key={stat.id ?? stat.label} className="bg-white rounded-xl shadow-md p-8">
            <p className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</p>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default StatisticsStrip;
