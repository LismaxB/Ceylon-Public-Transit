import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceylon Public Transit",
  description:
    "An open-source initiative to revolutionize public transport in Sri Lanka.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>{children}</body>
    </html>
  );
}
