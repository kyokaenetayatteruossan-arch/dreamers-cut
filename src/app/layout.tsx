import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { JobProvider } from "@/context/JobContext";
import { NotificationProvider } from "@/context/NotificationContext";
import Header from "@/components/Header";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Dreamer's Cut | 夢追い人の応援プロジェクト",
  description: "特別な思い出を、もっと特別に。誰かの夢を、みんなで支える動画編集あっせんサービス。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthProvider>
          <NotificationProvider>
            <JobProvider>
              <Header />
              {children}
            </JobProvider>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
