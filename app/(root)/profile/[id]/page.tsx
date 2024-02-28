import { fetchUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import Image from "next/image"
import ThreadsTab from "@/components/shared/ThreadsTab"

export default async function Profile({ params }: { params: { id: string } }) {
  if(!params.id) return null

  const loggedOnUser = await currentUser()
  if(!loggedOnUser) return null

  const loggedOnUserInfo = await fetchUser(loggedOnUser.id)
  if(!loggedOnUserInfo?.onboarded) redirect("/onboarding")

  const user = await fetchUser(params.id)
  if(!user) return null

  return (
    <>
      <ProfileHeader 
        accountId={user.id}
        authUserId={loggedOnUser.id}
        name={user.name}
        username={user.username}
        imageUrl={user.image}
        bio={user.bio}
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {profileTabs.map((tab) => (
              <TabsTrigger key={tab.label} value={tab.value} className="tab">
                <Image 
                 src={tab.icon}
                 alt={tab.label}
                 width={24}
                 height={24}
                 className="object-contain"
                />

                <p className="max-sm:hidden">{tab.label}</p>

                {tab.label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{user?.threads?.length}</p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {profileTabs.map((tab) => (
            <TabsContent key={`content-${tab.label}`} value={tab.value} className="w-full text-light-1">
              <ThreadsTab
                currentUserId={loggedOnUser.id}
                accountId={user.id}
                accountType="User"
              />
            </TabsContent>
          ))}

        </Tabs>
      </div>
    </>
  )
}