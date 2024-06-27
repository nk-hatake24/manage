import React from 'react'
import { Link } from 'react-router-dom'

export const NoPages = () => {
  return (
    <div className='h-screen flex flex-col justify-center gap-5 p-10 items-end'>
        <h1 className="text-4xl">Page not found</h1>
        <p className='hover:underline'><Link to='/'> go back to home  </Link></p>
    </div>
  )
}
