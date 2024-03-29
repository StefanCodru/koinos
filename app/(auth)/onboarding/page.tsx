import AccountProfile from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export default async function Page() {
    // Current user is imported from clerk, and we await it and get the user object whenever we want
    const user = await currentUser()
    if(!user) return null

    const userInfo = await fetchUser(user.id)

    console.log("YOOOO")
    console.log("userinfo", userInfo)

    if(userInfo?.onboarded) redirect("/")

    const userData = {
        id: user?.id,
        objectId: userInfo?.id,
        username: userInfo ? userInfo?.username : user?.username,
        name: userInfo ? userInfo?.name : user?.firstName || "",
        bio: userInfo ? userInfo.bio : "",
        image: userInfo ? userInfo?.image : user?.imageUrl
    }

    return (
        <main className="mx-auto flex max-2-3xl flex-col justify-start py-20 px-10 lg:w-3/5">
            <h1 className="head-text">Onboarding</h1>
            <p className="mt-3 text-base-regular text-light-2">
                Complete your profile now to use Koinos.
            </p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile 
                    user={userData} 
                    btnTitle="Continue"
                />
            </section>
        </main>
    )
}