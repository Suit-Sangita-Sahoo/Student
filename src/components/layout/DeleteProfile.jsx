import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import axios from 'axios';

const DeleteProfile = () => {
   const [formData, setFormData] = useState({
      teachername: "",
      email: "",
      password: "",
      age: "",
      sub:""
    })
    useEffect(() => {
      
      const user = JSON.parse(localStorage.getItem("current_user"));
      if (user) {
        setFormData({
       name: user.name || "",
          email: user.email || "",
          teachername: user.teachername || "",
          age: user.age || "",
          sub: user.sub || "",
          password: user.password || "",
        });
      }
    }, []);
    const navigate = useNavigate()
  
    const handleChange = (e) => {   
      const { name, value } = e.target
      setFormData({ ...formData, [name]: value })
    }
   const handleSubmit = async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("current_user"));
  console.log("Deleted"+user)
  const id = user?.id;

  if (!id) {
    toast.error("User ID not found");
    return;
  }

  try {
    const result = await axios.delete(`http://localhost:3000/teachers/${id}`);
    console.log("Deleted user:", result.data);

    
    localStorage.removeItem("current_user");

    toast.success("Profile deleted successfully ✅");

    
    navigate("/login");
  } catch (error) {
    console.log(error.message);
    toast.error("Server problem");
  }
};

  
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex text-center justify-center pt-[50px]">
          <div className="w-[300px] h-[600px] bg-blue-400 border-5 rounded-3xl">
            <p className="text-[20px] font-bold pt-[20px] flex justify-center">Create Account</p>
  
           
            <label className="flex flex-col justify-start pr-[160px]">
              <p>Teacher Name</p>
              <input type="text" name="teachername" placeholder="Enter Teacher Name" value={formData.teachername} onChange={handleChange} className="w-[250px] h-[35px] mx-[25px] rounded-md" />
            </label>
  
           
            <label className="flex flex-col justify-start pr-[190px] pt-[20px]">
              <p>Email</p>
              <input type="text" name="email" placeholder="Enter email" value={formData.email} onChange={handleChange} className="w-[250px] h-[35px] mx-[25px] rounded-md" />
            </label>
  
            
            <label className="flex flex-col justify-start pr-[160px] pt-[20px]">
              <p>Password</p>
              <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleChange} className="w-[250px] h-[35px] mx-[25px] rounded-md" />
            </label>
  
            
            <label className="flex flex-col justify-start pr-[200px] pt-[20px]">
              <p>Age</p>
              <input type="text" name="age" placeholder="Enter age" value={formData.age} onChange={handleChange} className="w-[250px] h-[35px] mx-[25px] rounded-md" />
            </label>
            <label className="flex flex-col justify-start pr-[200px] pt-[20px]">
              <p>Subject</p>
              <input type="text" name="sub" placeholder="Enter Subject" value={formData.sub} onChange={handleChange} className="w-[250px] h-[35px] mx-[25px] rounded-md" />
            </label>
            
            <button type="submit"  className="w-[250px] h-[40px] bg-blue-900 mt-[40px] rounded-md text-white cursor-pointer ">
              Register
            </button>
             <div className="flex mx-[20px] mt-[30px] ">
              <div >
                  <p>Already have an Account</p>
              </div>
              <div>
                  {/* <Link to="homelogin" onClick={handleInput}>Login</Link> */}
                  <p  className='text-blue-800 cursor-pointer'>Login</p>
  
                  
              </div>
            </div>
            
  
            
          </div>
        </form>
      </div>
    )
  }
  


export default DeleteProfile
