import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ChatWidget from "@/components/ChatWidget";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ChatWidgetProvider } from "@/contexts/ChatWidgetContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Chatbot",
  description: "Personalized chatbot for your knowledge base",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark:bg-black`}
      >
        <ErrorBoundary>
          <ChatWidgetProvider>
            {children}
            <ChatWidget />
          </ChatWidgetProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
