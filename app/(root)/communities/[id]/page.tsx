import { fetchUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import ProfileHeader from "@/components/shared/ProfileHeader"
import { Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import { communityTabs } from "@/constants"
import Image from "next/image"
import ThreadsTab from "@/components/shared/ThreadsTab"
import { fetchCommunityDetails } from "@/lib/actions/community.actions"
import UserCard from "@/components/cards/UserCard"
 
export default async function Page({ params }: { params: { id: string } }) {
  if(!params.id) return null

  const loggedOnUser = await currentUser()
  if(!loggedOnUser) return null

  const community = await fetchCommunityDetails(params.id)
  if(!community) return null

  return (
    <>
      <ProfileHeader 
        accountId={community.id}
        authUserId={loggedOnUser.id}
        name={community.name}
        username={community.username}
        imageUrl={community.image}
        bio={community.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map((tab) => (
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
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{community?.threads?.length}</p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          
          
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={loggedOnUser.id}
              accountId={params.id}
              accountType="Community"
            />
          </TabsContent>

          <TabsContent value="members" className="w-full text-light-1">
            <section className="mt-9 flex flex-col gap-10">
                {community?.members.map((member: any) => (
                  <UserCard 
                    key={member.id}
                    userId={member.id}
                    name={member.name}
                    username={member.username}
                    imageUrl={member.image}
                  />
                ))}
            </section>
          </TabsContent>

          <TabsContent value="requests" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={loggedOnUser.id}
              accountId={community.id}
              accountType="Community"
            />
          </TabsContent>
          

        </Tabs>
      </div>
    </>
  )
}