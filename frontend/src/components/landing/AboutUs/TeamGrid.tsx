import React from 'react';

const TeamGrid: React.FC = () => {
  const team = [
    {
      name: 'ch vishesh Yadav',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    },
    {
      name: 'ch. grahesh kumar',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    },
    {
      name: 'B.koushik',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    },
    {
      name: 's. ventaka theerth',
      role: 'AI/ML Student',
      description: '',
      image: 'https://ui-avatars.com/api/?name=Profile&background=random'
    }
  ];

  return (
    <div>
      <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h3>
      <div className="grid md:grid-cols-4 gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center"
          >
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&background=random`}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
            <h4 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h4>
            <p className="text-blue-600 font-medium mb-3">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamGrid; 