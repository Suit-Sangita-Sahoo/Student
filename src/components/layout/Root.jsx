import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './HomePage'
import { ToastContainer } from 'react-toastify'
import About from '../pages/About'
//import Project from './Project'
import Contact from './Contact'
import HomePage from './HomePage'
//import Profile from './Profile'
//import Navbar1 from '../MainPages/Navbar'

const Root = () => {
  return (
    <div>
        
        <About/>  
        <Contact/>
      
      <ToastContainer/>
    </div>
  )
}

export default Root
