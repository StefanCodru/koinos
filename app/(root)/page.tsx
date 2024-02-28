import { fetchThreads } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import ThreadCard from "@/components/cards/ThreadCard";
import { currentUser } from "@clerk/nextjs";
 
export default async function Home() {
  const user = await currentUser()
  const result = await fetchThreads(1, 20)

  return (
    <>
      <h1 className="head-text text-name">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p>No Threads Found</p>
        ) : (
          <>
            {result.threads.map((thread) => (
              <ThreadCard 
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id || ""}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  )
}