import React from 'react'
import { Link } from 'react-router-dom'

const Contact = () => {
  return (
    <div className=''>
       <div className="flex gap-2 mb-8 text-center justify-center pt-[30px]">
        <p className="text-blue-500 text-3xl font-semibold">Get in</p>
        <p className="text-yellow-400 text-3xl font-semibold">Touch</p>
      </div>

     
      <div className="text-center text-gray-700 text-lg   px-6 w-[90%] md:w-[80%] lg:w-[90%] xl:w-[90%]">
        <p className='pl-[350px]'>
            Have questions or feedback? we'd love to hear from your fill out the form below and our below and our team will get back to you shortly
         </p>
      </div>

      <form>
      <div className='w-[400px] h-[400px] bg-blue-500 mx-auto mt-[100px] text-white rounded-xl p-6'>

        <label className='block mb-4'>
          <p className='pl-[5px] mb-1'>Name</p>
          <input
            type="text"
            name="email"
            placeholder='Enter Your Name'
            className='rounded-md w-full h-[40px] text-black px-2 border-3'
            // value={formdata.email}
          
          />
        </label>

        <label className='block mb-6'>
          <p className='pl-[5px] mb-1'>Email</p>
          <input
            type="password"
            name="password"
            placeholder='Enter Your Email'
            className='rounded-md w-full h-[40px] text-black px-2 border-3'
            // value={formdata.password}
           
          />
        </label>
        <label>
            <p className='pl-[5px] mb-1'>Message</p>
            <textarea className='w-[100%] h-[80px] border-3 rounded-lg'></textarea>
        </label>
        <div className='pl-[120px]'>
        <button 
          type="submit"
          className='w-[46%] h-[40px]  bg-blue-800 rounded-md'
        >
          Login
        </button>
        </div>
      </div>
    </form>
      
    </div>
  )
}

export default Contact
