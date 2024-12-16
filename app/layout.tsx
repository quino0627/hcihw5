import { GeistSans } from "geist/font/sans";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "AI 차량 예약 서비스",
  description: "AI를 활용한 차량 예약 모바일 어플리케이션",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={GeistSans.className}>
      <body className="bg-background text-foreground">{children}</body>
    </html>
  );
}
