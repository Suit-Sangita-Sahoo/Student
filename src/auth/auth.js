 export const generateToken=(payload)=>{
  const {teachername,id}=payload
  return "niacifehsdftyu2y8ncd"+teachername.slice(0,3)+"."+id+"."+Math.random(Math.random()*10000)
} 
