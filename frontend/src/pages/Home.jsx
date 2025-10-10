import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Brain, Users, Shield, Star, ArrowRight } from 'lucide-react';
import { Logo } from '../components/Logo';

export function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Find Peace of Mind, Together
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join our supportive community to relieve stress and anxiety through proven
            exercises, anonymous sharing, and meaningful connections.
          </p>
          <button className="bg-purple-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-purple-700 transform hover:scale-105 transition-all">
            Start Your Journey
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Brain className="h-8 w-8 text-purple-600" />}
            title="Guided Exercises"
            description="Access a library of meditation, breathing, and mindfulness exercises designed by experts."
          />
          <FeatureCard
            icon={<MessageCircle className="h-8 w-8 text-purple-600" />}
            title="Anonymous Support"
            description="Share your thoughts and feelings safely with our supportive community."
          />
          <FeatureCard
            icon={<Heart className="h-8 w-8 text-purple-600" />}
            title="Daily Wellness"
            description="Track your mood, set goals, and build healthy mental wellness habits."
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Your Safe Space for Mental Wellness
              </h2>
              <div className="space-y-4">
                <TrustPoint
                  icon={<Shield className="h-6 w-6 text-green-600" />}
                  text="100% Anonymous & Secure"
                />
                <TrustPoint
                  icon={<Users className="h-6 w-6 text-blue-600" />}
                  text="Supportive Community"
                />
                <TrustPoint
                  icon={<Logo className="h-6 w-6" />}
                  text="Expert-Guided Practices"
                />
              </div>
            </div>
            <div className="md:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&q=80&w=500"
                alt="Peaceful meditation"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            What Our Community Says
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Testimonial
              content="TogetEase has been a game-changer for my mental health journey. The community support and guided exercises have helped me find balance in my daily life."
              author="Sarah M."
              role="Community Member"
            />
            <Testimonial
              content="As someone who struggled with anxiety, finding this platform was a blessing. The anonymous sharing feature helped me open up without fear of judgment."
              author="Michael R."
              role="Active Member"
            />
            <Testimonial
              content="The daily exercises and supportive community have become an essential part of my wellness routine. I'm grateful for this safe space."
              author="Emily L."
              role="Community Member"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-purple-600 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-lg text-purple-100 mb-8">
            Join thousands of others who have found peace and support in our community.
            Your journey to better mental wellness starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-purple-600 px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center">
              Join Now <ArrowRight className="ml-2 h-5 w-5" />
            </button>
            <Link
              to="/learn-more"
              className="border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TrustPoint({ icon, text }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="bg-gray-50 p-2 rounded-full">{icon}</div>
      <span className="text-gray-700">{text}</span>
    </div>
  );
}

function Testimonial({ content, author, role }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex mb-4">
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
        <Star className="h-5 w-5 text-yellow-400" />
      </div>
      <p className="text-gray-600 mb-4">{content}</p>
      <div>
        <p className="font-semibold text-gray-800">{author}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
}