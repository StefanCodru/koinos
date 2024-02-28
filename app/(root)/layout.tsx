import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google";
import "../globals.css";
import TopBar from "../../components/shared/TopBar"
import Footer from "../../components/shared/Footer"
import RightSidebar from "../../components/shared/RightSidebar"
import LeftSidebar from "../../components/shared/LeftSidebar"

const inter = Inter({ subsets: ["latin"] });

// This sets up the SEO. Next.js takes care of everything we just add these.
export const metadata = {
  title: "Koinos",
  description: "Orthodox social media app."
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>

          <TopBar />

            <main className="flex flex-row">
              <LeftSidebar />
              
              <section className="main-container">
                <div className="w-full max-w-4xl">
                  {children}
                </div>
              </section>

              <RightSidebar />
            </main>

          <Footer />

        </body>
      </html>
    </ClerkProvider>
  );
}
