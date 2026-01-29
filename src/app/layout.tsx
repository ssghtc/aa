import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HostingRenewalPopup from "@/components/HostingRenewalPopup";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduDash - Admin Dashboard",
  description: "Advanced education management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <HostingRenewalPopup />
        {children}
      </body>
    </html>
  );
}
