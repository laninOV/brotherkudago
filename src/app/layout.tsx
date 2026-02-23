import type { Metadata } from "next";
import { Nunito, Press_Start_2P, Yeseva_One } from "next/font/google";
import "./globals.css";

const uiFont = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--site-ui-font",
  display: "swap",
});

const displayFont = Yeseva_One({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--site-display-font",
  display: "swap",
});

const pixelFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--site-pixel-font",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ОКОЛО — подборка мероприятий",
  description:
    "ОКОЛО — бесконечная лента городских идей и событий. Сохраняй избранное, общайся и собирай свой досуг.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#f4ea2a" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" type="image/png" href="/iloveeventfest_files/Logo-32x32-CtMOuIU1.png" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://avatars.mds.yandex.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.tildacdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
      </head>
      <body className={`${uiFont.variable} ${displayFont.variable} ${pixelFont.variable}`}>{children}</body>
    </html>
  );
}
