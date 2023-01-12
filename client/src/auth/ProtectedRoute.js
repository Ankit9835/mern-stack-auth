import React from 'react'
import { Navigate } from "react-router-dom"
import { isAuth } from './helpers'

const ProtectedRoute = ({children}) => {
 
 const user = isAuth()
 if(!user){
    return <Navigate to='/login' />   
 }

  
    return children
   
}

export default ProtectedRoute
