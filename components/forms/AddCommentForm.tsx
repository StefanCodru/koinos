"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import * as z from "zod"
import { usePathname } from 'next/navigation'
import { CommentValidation } from '@/lib/validations/thread'
import { addCommentToThread, createThread } from '@/lib/actions/thread.actions'
import Image from 'next/image'

interface Props {
   threadId: string,
   currentUserImage: string,
   currentUserId: string
}

export default function AddCommentForm({ threadId, currentUserImage, currentUserId }: Props) {
   const pathname = usePathname()

   // Forces validation for form and also provides default values
   const form = useForm({
      resolver: zodResolver(CommentValidation),
      defaultValues: {
         thread: ""
      }
   })

   // When form is submitted
   async function onSubmit(values: z.infer<typeof CommentValidation>) {
      await addCommentToThread(
         threadId,
         values.thread,
         currentUserId,
         pathname
      )

      form.reset()
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="comment-form">

            <FormField
               control={form.control}
               name="thread"
               render={({ field }) => (
                  <FormItem className='flex items-center gap-3 w-full'>
                  <FormLabel>
                     <Image
                        src={String(currentUserImage)}
                        alt="Profile Image"
                        width={48}
                        height={48}
                        className="object-cover rounded-full"
                     />
                  </FormLabel>
                  <FormControl className="border-none bg-transparent">
                     <Input 
                        type="text"
                        placeholder="Comment..."
                        className='no-focus text-light-1 outline-none'
                        {...field}
                     />
                  </FormControl>
                  </FormItem>
               )}
            />

            <Button type="submit" className="comment-form_btn">Reply</Button>

         </form>
      </Form>
   )
}