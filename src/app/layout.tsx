// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'InterviewBD — Your Interview Preparation Platform',
  description:
    'Real interview questions, verified professionals, and a community that helps you land your next job in Bangladesh.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        <AuthProvider>
          <Navbar />
          <main className="pt-16 flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
