import Toast from "src/components/Toast";
import "./globals.css";
import { Inter } from "next/font/google";
// import '../assets/index.less';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Portkey openlogin",
  icons: {
    icon: "/_favicon.ico",
  },
  description: "Log in to portkey using three parties",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toast />
      </body>
    </html>
  );
}
