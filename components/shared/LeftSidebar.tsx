"use client"

import { sidebarLinks } from  "@/constants"
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation'
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";

export default function LeftSidebar() {
    // Imported from next.js, they let you access the router object and also the current path so you know where the user is at.
    const router = useRouter()
    const pathname = usePathname()
    const { userId } = useAuth()

    return (
        <section className="custom-scrollbar leftsidebar">
            <div className="flex w-full flex-1 flex-col gap-6 px-6">
                {/* Map through all nav links that are in a constants file */}
                {sidebarLinks.map((link) => {
                    // If this link is the one in the path, make this bool active
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

                    if(link.route === '/profile') link.route = `${link.route}/${userId}`

                    return (
                        <Link href={link.route} key={link.label} className={`leftsidebar_link ${isActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt="link" width={24} height={24}/>
                            <p className="text-light-1 max-lg:hidden">{link.label}</p>
                        </Link>
                    )}
                )}
            </div>

            {/* Display the logout button in the left sidebar at the bottom */}
            <div className="mt-10 px-6">
                <SignedIn>
                    <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                        <div className="flex cursor-pointer gap-4 p-4">
                            <Image
                                src="/assets/logout.svg"
                                alt="logout"
                                width={24}
                                height={24}
                            />

                            <p className="text-light-2 max-lg:hidden">Logout</p>
                        </div>
                    </SignOutButton>
                </SignedIn>
            </div>
        </section>
    )
}