import type { Metadata } from 'next';
import LoginForm from '@/components/Auth/LoginForm';

export const metadata: Metadata = {
  title: 'Login to Art Wise AI - Your Personal Art Guide',
  description:
    'Join Art Wise AI to explore artworks through AI-powered conversations. Get instant insights about art history, techniques, and cultural significance.',
  keywords:
    'art analysis app, AI art guide, artwork exploration, art education technology, art appreciation tool',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-gray-50 sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 lg:mt-16 lg:px-8">
              <LoginForm />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
