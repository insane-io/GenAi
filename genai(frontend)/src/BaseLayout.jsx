import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from "./Components/Navbar"

const BaseLayout = () => {
  return (
    <div className=''>
      <Navbar/>
      <Outlet />
    </div>
  )
}

export default BaseLayout
