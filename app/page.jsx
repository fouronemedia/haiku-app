import RegisterForm from "../components/RegisterForm"
import { getUserFromCookie } from "../lib/getUser"
import Dashboard from "../components/Dashboard"

export default async function Page() {
  const user = await getUserFromCookie()

  return (
    <div>
      {user && <Dashboard user={user} />}

      {!user && (
        <div>
          <p className="text-center text-2xl text-gray-500 mb-5">
            Don&rsquo;t have an account? <strong>Create One</strong>
          </p>
          <RegisterForm />
        </div>
      )}
    </div>
  )
}
