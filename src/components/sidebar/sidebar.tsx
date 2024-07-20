import React from 'react'
import { SidebarRoutes } from './sidebar-routes'

const Sidebar = () => {
    return (
        <div className='h-full border-r-2 border-zinc-800 flex flex-col overflow-y-auto text-gray-50'>
            <div className='p-10'>
                {/* logo here */}
            </div>

            {/* TODO: Add links to the sidebar */}

            <div className='flex-1'>
                <SidebarRoutes />
            </div>


        </div>
    )
}

export default Sidebar
