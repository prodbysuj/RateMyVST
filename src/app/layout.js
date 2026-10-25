import "./globals.css";

export const metadata = {
  title: "RateMyVST",
  description: "Rate and review VST plugins.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
