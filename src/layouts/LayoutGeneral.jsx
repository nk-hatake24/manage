import React from 'react'
import { Outlet } from 'react-router-dom'

const LayoutGeneral= ({ children }) => {
    return (
      <div className='bg-gray-50 h-screen overflow-clip  dark:bg-gray-900 '>
        
        <main>
          {children}
        </main>
      </div>
    )
  }

export default LayoutGeneral
