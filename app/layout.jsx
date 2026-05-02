import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata = {
  title: "REPOLIB UNDIRA",
  description: "Repository Perpustakaan Universitas Dian Nusantara",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}