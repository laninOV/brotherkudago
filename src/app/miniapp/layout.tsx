import "./miniapp.css";
import "leaflet/dist/leaflet.css";

export default function MiniAppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
