import mongoose from 'mongoose'

let isConnected = false // Check mongoose connection status

// Function used to connect to mongo DB
export const connectToDB = async () => {
   mongoose.set('strictQuery', true)

   if(!process.env.MONGODB_URL) return console.log("No Mongo URL")

   if(isConnected) return console.log("Already connected to MongoDB")

   // Connect
   try {
      await mongoose.connect(process.env.MONGODB_URL)
      isConnected = true
      console.log("Connected to MongoDB")
   } catch (error) {
      console.log(error)
   }
}