import React from 'react';
import { MessageCircle, Users, Heart } from 'lucide-react';

export function Community() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Community Support</h1>
          <p className="text-lg text-gray-600">
            A safe space to share your thoughts and connect with others on their mental wellness journey.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <textarea
            placeholder="Share your thoughts..."
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={3}
          />
          <div className="mt-4 flex justify-end">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Share Anonymously
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <PostCard
            author="Anonymous"
            content="Today was tough, but I'm proud of myself for practicing the breathing exercises. They really help when anxiety kicks in."
            time="2 hours ago"
            likes={12}
            replies={3}
          />
          <PostCard
            author="Anonymous"
            content="Does anyone else feel overwhelmed sometimes? I'm learning to take things one day at a time, but it's not always easy."
            time="4 hours ago"
            likes={24}
            replies={8}
          />
          <PostCard
            author="Anonymous"
            content="Just completed my first meditation session! It's amazing how just 5 minutes of mindfulness can make such a difference."
            time="6 hours ago"
            likes={18}
            replies={5}
          />
        </div>
      </div>
    </div>
  );
}

function PostCard({ author, content, time, likes, replies }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center mb-4">
        <div className="bg-purple-100 p-2 rounded-full">
          <Users className="h-5 w-5 text-purple-600" />
        </div>
        <div className="ml-3">
          <span className="font-medium text-gray-900">{author}</span>
          <span className="text-sm text-gray-500 ml-2">{time}</span>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="flex items-center space-x-6">
        <button className="flex items-center text-gray-500 hover:text-purple-600">
          <Heart className="h-5 w-5 mr-1" />
          <span>{likes}</span>
        </button>
        <button className="flex items-center text-gray-500 hover:text-purple-600">
          <MessageCircle className="h-5 w-5 mr-1" />
          <span>{replies}</span>
        </button>
      </div>
    </div>
  );
}