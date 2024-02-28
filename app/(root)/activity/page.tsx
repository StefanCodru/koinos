import { fetchUser, fetchUserActivity, fetchUsers } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"
import { currentUser } from "@clerk/nextjs"
import Link from "next/link"
import Image from "next/image"
 
export default async function Page() {
  const loggedOnUser = await currentUser()
  if(!loggedOnUser) return null

  const loggedOnUserInfo = await fetchUser(loggedOnUser.id)
  if(!loggedOnUserInfo?.onboarded) redirect("/onboarding")

  // Get User Activites
  const activity = await fetchUserActivity(loggedOnUserInfo._id)


  return (
    <>
      <h1 className="head-text text-name">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map((activity) => (
              <Link
                key={activity._id}
                href={`thread/${activity.parentId}`}
              >
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="profile picture"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="!text-base-regular text-light-3">No Activity Yet</p>
        )}
      </section>
    </>
  )
}