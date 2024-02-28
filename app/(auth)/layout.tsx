/* This is a sort of template page for all the pages in this directory AUTH. 
They are all passed through to RootLayout and rendered as the children. 
This is so we have a common theme for this section. 
*/

import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import '../globals.css'

// This sets up the SEO. Next.js takes care of everything we just add these.
export const metadata = {
    title: "Koinos",
    description: "Orthodox social media app."
}

// Importing fonts from google
const inter = Inter({ subsets: ["latin"] })

// Any children of this component RootLayout will be passed as a prop, it is of type React child
export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">

                {/* We're adding inter as class here to add the same font to all text in this page, and also have everything
                as a dark color */}
                <body className={`${inter.className} bg-dark-1`}>
                    {/* Here, we simply render all the children */}
                    <div className="w-full flex justify-center items-center min-h-screen">
                        {children}
                    </div>
                </body>

            </html>
        </ClerkProvider>
    )
}