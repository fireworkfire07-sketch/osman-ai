import "./globals.css";

export const metadata = {
  title: "OSMAN AI",
  description: "Osman'ın kişisel dijital çalışma asistanı",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
