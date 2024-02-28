import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import UserCard from "@/components/cards/UserCard"
import { fetchCommunities } from "@/lib/actions/community.actions"
import CommunityCard from "@/components/cards/CommunityCard"
 
export default async function Page() {
  const loggedOnUser = await currentUser()
  if(!loggedOnUser) return null

  const loggedOnUserInfo = await fetchUser(loggedOnUser.id)
  if(!loggedOnUserInfo?.onboarded) redirect("/onboarding")

  const result = await fetchCommunities({
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
    sortBy: "desc"
  })

  return (
    <>
      <h1 className="head-text text-name">Community</h1>

      <section className="mt-14 flex flex-col gap-9">
        {result.communities.length === 0 ? (
          <p>No Users Found</p>
        ) : (
          <>
            {result.communities.map((community: any) => (
              <CommunityCard
               key={community.id}
               id={community.id}
               name={community.name}
               username={community.username}
               imgUrl={community.image}
               bio={community.bio}
               members={community.members}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
