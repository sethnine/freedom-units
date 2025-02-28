import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Freedom Unit Calculator",
  description: "Convert from communist units to freedom units",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, content=minimum-scale=1, user-scalable=no"
        />
      </head>
      <body
        className={`antialiased dark:bg-[#0a0a0a] dark:text-[#ededed] bg-white text-[#171717] flex flex-col h-full overscroll-y-contain`}
      >
        <NavBar />
        <div className="flex-1 flex flex-col justify-center items-center p-20">
          {children}
        </div>
      </body>
    </html>
  );
}
