import Navbar from "./Components/layout/Navbar";
import "./globals.css";
import { Inter } from "next/font/google";
import Footer from "./Components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

// Metadata specific to the Simulations Project
let title = "Pricing European Options";
let description =
  "Estimate the fair value of European options using the Black Scholes Model and Heston model.";
let url = "https://options-price.vercel.app/";
let ogimage = "/images/ogimage.png";
let sitename = "Price European Options";

export const metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Set metadata in the head */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={ogimage} />
        <meta property="og:site_name" content={sitename} />
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogimage} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
