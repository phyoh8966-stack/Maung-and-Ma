import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://thein-and-nan.vercel.app"),
  title: " Maung & Ma - Wedding Invitation",
  description: "ဖိတ်ကြားလွှာ - Thein Aye Maung & Nan Su Myat Htwe တို့၏ မင်္ဂလာဧည့်ခံပွဲ",
  openGraph: {
    title: "Thein Aye Maung & Nan Su Myat Htwe - Wedding Invitation",
    description: "၂၀၂၆ ခုနှစ်၊ ဒီဇင်ဘာလ ၅ ရက် (စနေနေ့)၊ နံနက် ၆:၀၀ - ၇:၀၀၊ မိုးနဲမြို့။",
    url: "https://thein-and-nan.vercel.app",
    siteName: "Thein Aye Maung & Nan Su Myat Htwe Wedding",
    images: [
      {
        url: "/wedding-share.jpg",
        width: 1200,
        height: 630,
        alt: "Thein Aye Maung & Nan Su Myat Htwe Wedding Invitation",
      },
    ],
    locale: "my_MM",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thein Aye Maung & Nan Su Myat Htwe - Wedding Invitation",
    description: "ဖိတ်ကြားလွှာ - Thein Aye Maung & Nan Su Myat Htwe တို့၏ မင်္ဂလာဧည့်ခံပွဲ",
    images: ["/wedding-share.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-amber-100">{children}</body>
    </html>
  );
}