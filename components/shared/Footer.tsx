"use client"

import { sidebarLinks } from  "@/constants"
import Link from "next/link";
import Image from "next/image"
import { usePathname, useRouter } from 'next/navigation'

export default function Footer() {
    // Imported from next.js, they let you access the router object and also the current path so you know where the user is at.
    const pathname = usePathname()

    return (
        <section className="bottombar">
            <div className="bottombar_container">
                {/* Map through all nav links that are in a constants file */}
                {sidebarLinks.map((link) => {
                    // If this link is the one in the path, make this bool active
                    const isActive = (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

                    return (
                        <Link href={link.route} key={link.label} className={`bottombar_link ${isActive && 'bg-primary-500'}`}>
                            <Image src={link.imgURL} alt="link" width={24} height={24}/>
                        </Link>
                    )}
                )}
            </div>
        </section>
    )
}