import { ObjectId } from "mongodb"
import { getCollection } from "../lib/db"
import Haiku from "./Haiku"
import Link from "next/link"

async function getHaikus(id) {
  const collection = await getCollection("haikus")
  const results = await collection
    .find({ author: ObjectId.createFromHexString(id) })
    .sort({ _id: -1 })
    .toArray()
  return results
}

export default async function Dashboard(props) {
  const haikus = await getHaikus(props.user.userId)

  return (
    <div>
      <h2 className="text-2xl text-center text-gray-600 mb-5">Your Haikus</h2>
      <h3 className="text-xl text-center mb-5">
        Welcome Back, <strong>{props.user.profileName}</strong>! You have {haikus.length} haikus.
        {haikus.length === 0 && (
          <Link href="/create-haiku" className="ml-2 font-bold link">
            Create One
          </Link>
        )}
      </h3>
      {haikus.map((haiku, index) => {
        haiku._id = haiku._id.toString()
        haiku.author = haiku.author.toString()
        return <Haiku haiku={haiku} key={index} />
      })}
    </div>
  )
}
