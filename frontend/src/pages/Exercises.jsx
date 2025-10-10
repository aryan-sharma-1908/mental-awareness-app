import React from 'react';
import { Brain, Wind, Heart, Moon } from 'lucide-react';

export function Exercises() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Wellness Exercises</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our collection of expert-curated exercises designed to help you find peace,
            reduce anxiety, and improve your mental well-being.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ExerciseCard
            title="Mindful Breathing"
            description="A simple but powerful exercise to anchor yourself in the present moment through breath awareness."
            duration="5 mins"
            icon={<Wind className="h-6 w-6" />}
            difficulty="Beginner"
          />
          <ExerciseCard
            title="Body Scan Meditation"
            description="Progressively focus your attention on different parts of your body, promoting relaxation and awareness."
            duration="15 mins"
            icon={<Brain className="h-6 w-6" />}
            difficulty="Intermediate"
          />
          <ExerciseCard
            title="Loving-Kindness"
            description="Develop compassion for yourself and others through guided meditation."
            duration="10 mins"
            icon={<Heart className="h-6 w-6" />}
            difficulty="Beginner"
          />
          <ExerciseCard
            title="Sleep Meditation"
            description="Gentle guidance into restful sleep through calming visualization and breathing."
            duration="20 mins"
            icon={<Moon className="h-6 w-6" />}
            difficulty="Beginner"
          />
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ title, description, duration, icon, difficulty }) {
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-purple-100 rounded-lg">
          {React.cloneElement(icon, {
            className: 'text-purple-600',
          })}
        </div>
        <span className="text-sm font-medium text-purple-600">{duration}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{difficulty}</span>
        <button className="text-purple-600 hover:text-purple-700 font-medium text-sm">
          Start Exercise →
        </button>
      </div>
    </div>
  );
}