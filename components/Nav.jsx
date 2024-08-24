"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'

const Nav = () => {
  const { data: session, status } = useSession()
  const [toggleDropdown, setToggleDropdown] = useState(false)

  return (
    <nav className='w-full bg-white fixed top-0 border-b-2 drop-shadow-sm z-50 pt-2'>
      <div className='flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16'>
        <Link href="/" className='flex items-center gap-2'>
          <Image
            src="/assets/images/logo.svg"
            alt="Echo Logo"
            width={30}
            height={30}
            className='object-contain'
          />
          <p className='font-bold text-xl'>Echo</p>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden sm:flex items-center gap-4'>
          {status === 'authenticated' ? (
            <>
              <Link href="/create-prompt" className="black_btn">
                Create Post
              </Link>
              <button 
                onClick={() => signOut()}
                className='outline_btn'
              >
                Sign Out
              </button>
              <Link href="/profile" className="flex items-center">
                <Image 
                  src={session.user.image}
                  width={40}
                  height={40}
                  className='rounded-full'
                  alt="profile"
                />
              </Link>
            </>
          ) : (
            <button
              onClick={() => signIn('google')}
              className='black_btn'
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="sm:hidden relative">
          {status === 'authenticated' ? (
            <div>
              <Image 
                src={session.user.image}
                width={40}
                height={40}
                className='rounded-full cursor-pointer'
                alt="profile"
                onClick={() => setToggleDropdown((prev) => !prev)}
              />

              {toggleDropdown && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1'>
                  <Link
                    href="/profile"
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setToggleDropdown(false)}
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/create-prompt"
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setToggleDropdown(false)}
                  >
                    Create Prompt
                  </Link>
                  <button
                    onClick={() => {
                      setToggleDropdown(false)
                      signOut()
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => signIn('google')}
              className='px-4 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition-colors'
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Nav