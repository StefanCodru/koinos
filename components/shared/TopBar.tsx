"use client"

import Link from "next/link";
import Image from "next/image";
import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'
import { dark } from '@clerk/themes'

export default function TopBar() {
    // Imported from next.js, using it to route to sign in when logging out.
    const router = useRouter()

    return (
        <nav className="topbar">
            <Link href="/" className="flex items-center gap-4">
                <Image src="/assets/logo.svg" alt="logo" width={28} height={28}/>
                <p className="text-heading3-bold text-light-1 max-xs:hidden">Koinos</p>
            </Link>

            <div className="flex items-center gap-1">
                {/* Logout button here. If signed in, create clerk signout button with image and size. Not shown in bigger screens because we want it on the left sidebar. But on mobile, it will show.*/}
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton signOutCallback={() => router.push('/sign-in')}>
                            <div className="flex cursor-pointer">
                                <Image
                                    src="/assets/logout.svg"
                                    alt="logout"
                                    width={24}
                                    height={24}
                                />
                            </div>
                        </SignOutButton>
                    </SignedIn>
                </div>

                {/* This is a clerk item that allows someone to switch their organization or create one */}
                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger:"py-2 px-4"
                        }
                    }}
                />



            </div>

        </nav>
    )
}