import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import { AuthProvider } from "../utils/AuthContext";
import { NotificationProvider } from "../components/NotificationSystem";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BrightBuddy - Daily Learning & Wellness Journal",
  description: "A personalized learning companion that helps students track their daily learning experiences, mood, and personal growth.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen text-gray-900">
        <AuthProvider>
          <NotificationProvider>
            <Navigation />
            <main className="max-w-7xl mx-auto p-4">
              {children}
            </main>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
