import { Inter } from "next/font/google";
import "./globals.css";
import Layout from "./components/layout";
import { StateProvider } from "./context/stateContext";
import { ApiProvider } from "./context/apiContext";
import { Providers } from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Tech Film",
  description: "Next Js Film",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans+SC:ital,wght@1,900&family=Oswald:wght@500&display=swap" rel="stylesheet" />
        <title>Tech Film</title>
        <meta name="description" content="Tech Film - Here, you can easily book tickets for movies of all genres, from action to drama. With a simple and convenient booking process, get ready for an amazing entertainment experience with friends and family!" />
      </head>
      <body className={inter.className}>
        <StateProvider>
          <ApiProvider>
            <Providers><Layout props={{ children }} /></Providers>
          </ApiProvider>
        </StateProvider>
      </body>
    </html>
  );
}
