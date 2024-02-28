"use server"

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

export async function createThread(
   text: string,
   author: string,
   communityId: string | null,
   path: string
): Promise<void> {
   
   connectToDB()

   try {
      // Create Thread
      const createdThread = await Thread.create({
         text,
         author
      })

      // Update User Model
      await User.findByIdAndUpdate(author, {
         $push: { threads:createdThread._id }
      })

      revalidatePath(path)
      
   } catch (error: any) {
      throw new Error(`Failed to create thread ${error.message}`)
   }
}

export async function fetchThreadById(
   threadId: string
) {

   try {
      connectToDB()

      const thread = await Thread.findById(threadId)
         .populate({ 
            path: 'author', 
            model: User,
            select: "_id id name image"
         })
         .populate({ 
            path: 'children', 
            populate: [
               {
                  path: 'author', 
                  model: User,
                  select: "_id id name parentId image"
               },
               {
                  path: "children",
                  model: Thread,
                  populate: {
                     path: 'author', 
                     model: User,
                     select: "_id id name parentId image"
                  }
               }
            ]
         }).exec()

      return thread

   } catch (error: any) {
      throw new Error(`Failed to find user ${error.message}`)
   }
}

export async function fetchThreads(
   pageNumber = 1,
   pageSize = 20
) {
   
   connectToDB()

   try {

      const skipAmount = (pageNumber - 1) * pageSize
      
      const threadsQuery = Thread.find({ parentId: { $in: [null, undefined ]} })
      .sort({ createdAt: 'desc' })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: 'author', model: User})
      .populate({
         path: 'children',
         populate: {
            path: 'author',
            model: User,
            select: "_id name parentId image"
         }
      })

      const totalThreadsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined ]} })

      const threads = await threadsQuery.exec()

      const isNext = totalThreadsCount > skipAmount + threads.length

      return { threads, isNext }
      
   } catch (error: any) {
      throw new Error(`Failed to create thread ${error.message}`)
   }
}


export async function addCommentToThread(
   threadId: string,
   commentText: string,
   userId: string,
   path: string
) {
   connectToDB()

   try {

      // Find original thread, make sure it exists
      const originalThread = await Thread.findById(threadId)
      if(!originalThread) throw new Error(`Failed to find thread`)

      // Create Comment Thread
      const commentThread = await Thread.create({
         text: commentText,
         author: userId,
         parentId: threadId
      })

      // Update User Model
      originalThread.children.push(commentThread._id)
      await originalThread.save()

      revalidatePath(path)

   } catch (error: any) {
      throw new Error(`Failed to create thread ${error.message}`)
   }
}