// app/_components/BadgeSystemSection.tsx

export default function BadgeSystemSection() {
  const badges = [
    { icon: '🐣', name: 'Newbie', range: '1-4', color: 'from-gray-100 to-gray-200' },
    { icon: '🌱', name: 'Curious', range: '5-9', color: 'from-green-100 to-emerald-200' },
    { icon: '🔍', name: 'Seeker', range: '10-19', color: 'from-blue-100 to-cyan-200' },
    { icon: '💡', name: 'Inquirer', range: '20-49', color: 'from-yellow-100 to-amber-200' },
    { icon: '🔥', name: 'Pro', range: '50-99', color: 'from-orange-100 to-red-200' },
    { icon: '🧠', name: 'Expert', range: '100-199', color: 'from-purple-100 to-violet-200' },
    { icon: '🌟', name: 'Legendary', range: '200+', color: 'from-pink-100 to-rose-200' }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Achievement Badge System
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Earn badges as you contribute questions and grow your reputation in the community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
          {badges.map((badge, i) => (
            <div
              key={i}
              className={`bg-gradient-to-br ${badge.color} rounded-2xl p-6 text-center border-2 border-white shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer`}
            >
              <div className="text-5xl mb-3">{badge.icon}</div>
              <div className="font-bold text-gray-900 text-base mb-2">{badge.name}</div>
              <div className="text-sm font-semibold text-gray-700 bg-white/60 rounded-full px-3 py-1">
                {badge.range} Q
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};