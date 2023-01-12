import React from 'react'
import { Navigate } from 'react-router-dom'
import { isAuth } from './helpers'
const AdminRoute = ({children}) => {
    const user= isAuth()
    if(user){
        if(user.role === 'admin'){
           return children
        }
    }

    return <Navigate to='/'></Navigate>
  
}

export default AdminRoute
