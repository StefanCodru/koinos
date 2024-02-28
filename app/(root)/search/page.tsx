import { fetchUser, fetchUsers } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import UserCard from "@/components/cards/UserCard"
 
export default async function Page() {
  const loggedOnUser = await currentUser()
  if(!loggedOnUser) return null

  const loggedOnUserInfo = await fetchUser(loggedOnUser.id)
  if(!loggedOnUserInfo?.onboarded) redirect("/onboarding")

  const result = await fetchUsers({
    userId: loggedOnUserInfo.id,
    searchString: '',
    pageNumber: 1,
    pageSize: 20,
    sortBy: "desc"
  })

  return (
    <>
      <h1 className="head-text text-name">Search</h1>

      <section className="mt-14 flex flex-col gap-9">
        {result.users.length === 0 ? (
          <p>No Users Found</p>
        ) : (
          <>
            {result.users.map((user: any) => (
              <UserCard 
                key={user.id}
                userId={user.id}
                name={user.name}
                username={user.username}
                imageUrl={user.image}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}
