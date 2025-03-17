import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Art Wise AI - Making Art Understanding Accessible',
  description:
    'Art Wise AI makes art appreciation accessible through AI-powered conversations. Discover the stories, techniques, and cultural significance behind any artwork.',
  keywords:
    'art analysis, AI art guide, art history, art appreciation, artwork analysis, art education, art technology',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {/* Mission Statement */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
            Making Art Understanding Accessible
          </h1>
          <p className="mt-4 text-xl text-gray-500">
            Discover the stories and meanings behind every artwork through AI-powered conversations
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-16">
          {/* What We Do Section */}
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600 leading-relaxed">
              Art is more than what meets the eye - each piece carries rich stories, historical
              significance, and cultural meaning. Born from our passion for art and technology, Art
              Wise AI bridges the gap between viewing art and truly understanding it. We believe
              everyone should have the opportunity to uncover the fascinating details, techniques,
              and context behind any artwork they encounter, making art appreciation more accessible
              and engaging for all.
            </p>
          </section>

          {/* Technology Section */}
          <section className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Art Analysis</h3>
              <p className="text-gray-600">
                Simply capture or upload any artwork to instantly uncover its unique story, artistic
                elements, and historical context.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Experience</h3>
              <p className="text-gray-600">
                Engage in natural conversations through text or voice chat to explore artworks in
                depth, just like discussing with an art expert.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comprehensive Insights</h3>
              <p className="text-gray-600">
                Discover artistic techniques, historical influences, and cultural significance that
                make each artwork unique and meaningful.
              </p>
            </div>
          </section>

          {/* Learning & Open Source Section */}
          <section className="bg-white rounded-2xl shadow-sm p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Learn AI Development</h2>
            <div className="prose prose-blue">
              <p className="text-gray-600 leading-relaxed">
                This project serves as an educational resource for developers interested in:
              </p>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Building AI-powered applications with Next.js and Google Cloud</li>
                <li>Implementing real-time voice interactions using WebRTC</li>
                <li>Working with modern authentication and database systems</li>
                <li>Creating accessible and responsive user interfaces</li>
              </ul>
              <div className="mt-6">
                <a
                  href="https://github.com/mostafa-drz/art-wise-ai"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Explore the Code on GitHub
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-sm p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">Be Part of Art&apos;s Future</h2>
            <p className="text-blue-100 mb-6">
              Share your thoughts and help us enhance the way people connect with art worldwide.
            </p>
            <p className="text-blue-100 mb-6">
              <a href="mailto:hi@mostafa.xyz">hi@mostafa.xyz</a>
            </p>
            <a
              href="mailto:hi@mostafa.xyz"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 transition-colors"
            >
              Get in Touch
              <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </section>
        </div>
      </div>
    </div>
  );
}
