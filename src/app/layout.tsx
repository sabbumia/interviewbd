// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Interview BD - Your Interview Preparation Platform',
  description: 'A comprehensive interview question and answer platform for Bangladesh',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
      <AuthProvider>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <Footer/>
      </AuthProvider>
      </body>
    </html>
  );
}
