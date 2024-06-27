import React from 'react'
import LayoutGeneral from './LayoutGeneral'
import SideNav from '../components/SideNav'
import NavBarTop from '../components/NavBarTop'



const Dashboard = ({children}) => {
  return (
    <LayoutGeneral>
        <div className='bg-gray-50 flex-row h-screen overflow-clip flex p-2 md:p-12 gap-4 dark:bg-gray-900'>
            <div className=" rounded hidden md:block shadow-md shadow-gray-200 md:w-1/5 dark:text-gray-50 dark:shadow-gray-700">
                <SideNav className=''/>
            </div>
            <div className="flex flex-col w-full md:w-4/5 gap-4">
                <div className='shadow  shadow-gray-400 dark:shadow-gray-700'>
                  <NavBarTop />
                </div>
              <section className='h-full  overflow-y-scroll md:overflow-clip rounded shadow-md shadow-gray-200 dark:text-gray-50 dark:shadow-gray-700'>
                  {children}
              </section>
            </div>
        </div>
     
        
    </LayoutGeneral>
  )
}

export default Dashboard