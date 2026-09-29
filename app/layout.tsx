import "./globals.css";

export const metadata = {
  title: "MYRÉA TECH",
  description: "Transformer les idées collectives en actifs autonomes.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
