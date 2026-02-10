import type { Metadata } from "next";
import "./globals.css";

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
        <meta name="theme-color" content="#f6efe3" />
        <meta name="color-scheme" content="light" />
        <link rel="icon" type="image/png" href="/iloveeventfest_files/Logo-32x32-CtMOuIU1.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Shrikhand&family=Xanh+Mono&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bad+Script&family=Marck+Script&family=Playpen+Sans:wght@100..800&family=Shantell+Sans:ital,wght@0,300..800;1,300..800&display=swap"
        />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://avatars.mds.yandex.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://static.tildacdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
