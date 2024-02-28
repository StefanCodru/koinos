import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreadById } from "@/lib/actions/thread.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import AddCommentForm from "@/components/forms/AddCommentForm"

export default async function Page({ params }: { params: { id: string } }) {
   if(!params.id) return null

   const user = await currentUser()
   if(!user) return null

   const userInfo = await fetchUser(user.id)
   if(!userInfo?.onboarded) redirect("/onboarding")

   const thread = await fetchThreadById(params.id)
   if(!thread) return null

   console.log(thread)

   return (
      <section className="relative">
         <div>
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
         </div>

         <div className="mt-7 ">
            <AddCommentForm 
               threadId={params.id}
               currentUserImage={user.imageUrl}
               currentUserId={userInfo._id}
            />

            <div className="mt-10 flex flex-col gap-10">
               {thread.children.map((thread: any) => (
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
                     isComment={true}
                  />
               ))}
            </div>

         </div>
      </section>
   )
}