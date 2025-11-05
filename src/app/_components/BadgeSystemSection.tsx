// app/_components/BadgeSystemSection.tsx

export default function BadgeSystemSection() {
  const badges = [
    { icon: '🐣', name: 'Newbie', range: '1-4 questions' },
    { icon: '🌱', name: 'Curious', range: '5-9 questions' },
    { icon: '🔍', name: 'Seeker', range: '10-19 questions' },
    { icon: '💡', name: 'Inquirer', range: '20-49 questions' },
    { icon: '🔥', name: 'Pro Questioner', range: '50-99 questions' },
    { icon: '🧠', name: 'Expert Inquirer', range: '100-199 questions' },
    { icon: '🌟', name: 'Legendary Asker', range: '200+ questions' }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Achievement Badge System
          </h2>
          <p className="text-lg text-gray-600">
            Earn badges as you contribute more questions to the community
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {badges.map((badge, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 text-center border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-2">{badge.icon}</div>
              <div className="font-bold text-gray-900 text-sm mb-1">{badge.name}</div>
              <div className="text-xs text-gray-600">{badge.range}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}