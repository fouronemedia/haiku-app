import Link from "next/link"
import { getUserFromCookie } from "../lib/getUser"
import { logout } from "../actions/userController"

export default async function Header() {
  const user = await getUserFromCookie()

  return (
    <header className="bg-gray-100 shadow-md">
      <div className="container mx-auto">
        <div className="navbar">
          <div className="flex-1">
            <Link href="/" className="btn btn-ghost text-xl">
              OurHaikuApp
            </Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              {user && (
                <>
                  <li className="mr-3">
                    <Link href="/create-haiku" className="btn btn-primary">
                      Create Haiku
                    </Link>
                  </li>
                  <li>
                    <form action={logout} className="btn btn-neutral">
                      <button className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                          <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
                        </svg>
                        <span className="hidden md:block ml-1">Logout</span>
                      </button>
                    </form>
                  </li>
                </>
              )}
              {!user && (
                <li>
                  <Link href="/login">Log In</Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}
