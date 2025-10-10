import React from 'react';
import { Brain, Heart, Users, Sparkles, Target, ArrowRight } from 'lucide-react';

export function LearnMore() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 py-8 sm:py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Mental Health Matters
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Understanding the impact of mental health on our lives and how TogetEase
            is making a difference in people's journey towards wellness.
          </p>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-16">
          <StatCard number="1 in 4" label="Adults experience mental health issues yearly" />
          <StatCard number="60%" label="People don't receive needed mental health support" />
          <StatCard number="50%" label="Mental health issues start by age 14" />
          <StatCard number="200+" label="Million workdays lost due to mental health" />
        </div>

        {/* Impact Stories */}
        <section className="mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Real Impact on Real Lives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <ImpactCard
              icon={<Brain className="h-8 w-8 text-purple-600" />}
              title="Reduced Anxiety"
              description="Our guided exercises and meditation practices have helped users report a 40% reduction in daily anxiety levels."
            />
            <ImpactCard
              icon={<Heart className="h-8 w-8 text-purple-600" />}
              title="Improved Relationships"
              description="Members report better personal and professional relationships through improved emotional regulation."
            />
            <ImpactCard
              icon={<Users className="h-8 w-8 text-purple-600" />}
              title="Community Support"
              description="90% of our users feel less alone in their mental health journey through our supportive community."
            />
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-white rounded-2xl p-4 sm:p-8 mb-8 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            How TogetEase Makes a Difference
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                  <Target className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personalized Approach</h3>
                  <p className="text-gray-600">
                    Our platform adapts to your needs, providing customized exercises and
                    recommendations based on your mental wellness journey.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Safe Community</h3>
                  <p className="text-gray-600">
                    Connect anonymously with others who understand your experiences,
                    share stories, and find support in a judgment-free environment.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="bg-purple-100 p-2 rounded-lg shrink-0">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Expert-Guided Content</h3>
                  <p className="text-gray-600">
                    Access professionally designed exercises and resources that are
                    proven to help improve mental well-being.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative min-h-[300px] md:min-h-0">
              <img
                src="https://images.unsplash.com/photo-1516302752625-fcc3c50ae61f?auto=format&fit=crop&q=80&w=600"
                alt="Peaceful meditation setting"
                className="rounded-lg shadow-lg w-full h-full object-cover absolute inset-0"
              />
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">
            Start Your Journey Today
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join thousands who have already taken the first step towards better
            mental health with TogetEase.
          </p>
          <button className="bg-purple-600 text-white px-6 sm:px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors flex items-center justify-center mx-auto">
            Join Our Community <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </section>
      </div>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm text-center">
      <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  );
}

function ImpactCard({ icon, title, description }) {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}