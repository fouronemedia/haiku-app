import { getUserFromCookie } from "../../lib/getUser.js"
import { redirect } from "next/navigation"
import HaikuForm from "../../components/HaikuForm.jsx"

export default async function Page() {
  const user = await getUserFromCookie()
  if (!user) {
    return redirect("/")
  }

  return (
    <div>
      <h2 className="text-center text-2xl text-gray-600 mb-5">Create Haiku</h2>
      <HaikuForm action="create" />
    </div>
  )
}
