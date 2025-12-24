import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Trainer App",
  description: "Your AI-powered workout companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
