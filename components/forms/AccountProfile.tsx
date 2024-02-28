"use client"

import { useState } from 'react'
import Image from "next/image"
import { useForm } from 'react-hook-form'
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { UserValidation } from '@/lib/validations/user'
import * as z from "zod"
import { ChangeEvent } from "react"
import { isBase64Image } from "../../lib/utils"
import { useUploadThing } from "../../lib/uploadthing"
import { updateUser } from '@/lib/actions/user.actions'
import { usePathname, useRouter } from 'next/navigation'
 
// Forces the types for the props coming into the AccountProfile component
interface Props {
    user: {
        id: string,
        objectId: string
        username: string
        name: string
        bio: string
        image: string
    }
    btnTitle: string
}

// Component for a form that edits user profile. You can upload picture, change name, username, bio. 
// Is in onboarding and also edit profile
export default function AccountProfile({user, btnTitle}: Props) {
    
    const [files, setFiles] = useState<File[]>([])
    const { startUpload } = useUploadThing("media")
    const router = useRouter()
    const pathname = usePathname()

    // Forces validation for form and also provides default values
    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || ""
        }
    })

    // Function to handle image upload
    const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()

        // Native object used to read files
        const fileReader = new FileReader()

        if(e.target.files && e.target.files.length > 0) {
            // Gets the files from the event
            const file = e.target.files[0]

            // Sets them to the state object
            setFiles(Array.from(e.target.files))

            // Checks if is image
            if(!file.type.includes("image")) return

            // Onload function for file reader, invokes field change cuntion with the new image data url
            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || ""

                fieldChange(imageDataUrl)
            }

            // Starts the file reader which will set off the onload function
            fileReader.readAsDataURL(file)
        }

    }

    // When form is submitted
    async function onSubmit(values: z.infer<typeof UserValidation>) {
        const blob = values.profile_photo
        const hasImageChanged = isBase64Image(blob)

        if(hasImageChanged) {
            const imgRes = await startUpload(files)

            if(imgRes && imgRes[0].url) {
                values.profile_photo = imgRes[0].url
            }
            
        }

        await updateUser({
            userId: user.id,
            bio: values.bio,
            name: values.name,
            path: pathname,
            username: values.username,
            image: values.profile_photo,
        })

        if(pathname === "/profile/edit") {
            // Go to previous page after editing
            router.back()
        } else {
            // Go to homepage after onboarding
            router.push("/")
        }

    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className='flex items-center gap-4'>
                        <FormLabel className='account-form_image-label'>
                            {field.value ? (
                                <Image
                                    src={field.value}
                                    alt="profile photo"
                                    width={96}
                                    height={96}
                                    priority
                                    className="rounded-full object-contain"
                                />
                            ) : (
                                <Image
                                    src="/assets/profile.svg"
                                    alt="profile photo"
                                    width={24}
                                    height={24}
                                    className="object-contain"
                                />
                            )}
                        </FormLabel>
                        <FormControl className="flex-1 text-base-semibold text-gray-200">
                            <Input 
                                type="file" 
                                accept="image/*"
                                placeholder="Upload a photo"
                                className="account-form_image-input"
                                onChange={(e) => handleImage(e, field.onChange)}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className='flex flex-col  items-left gap-3 w-full'>
                        <FormLabel  className='text-base-semibold text-light-2'>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type="text"
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className='flex flex-col  items-left gap-3 w-full'>
                        <FormLabel  className='text-base-semibold text-light-2'>
                            Username
                        </FormLabel>
                        <FormControl>
                            <Input 
                                type="text"
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className='flex flex-col  items-left gap-3 w-full'>
                        <FormLabel  className='text-base-semibold text-light-2'>
                            Bio
                        </FormLabel>
                        <FormControl>
                            <Textarea 
                                rows={10}
                                className="account-form_input no-focus"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />


                <Button type="submit" className="bg-primary-500">Submit</Button>
            </form>
        </Form>
    )
}