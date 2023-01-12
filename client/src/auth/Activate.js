import React, { useEffect, useState } from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode'



const Activate = () => {
    const[values,setValues] = useState({
        name:'',
        token:'',
        show:true
    })
    let { token } = useParams();
    useEffect(()=> {
        if(token){
            let {name} = jwt_decode(token)
            setValues({
                ...values,
                name,
                token
            })
        }
        

        console.log(token,name)
    },[])

    const {name,setToken} = values

   
    const clickSubmit = async (e) => {
        e.preventDefault()
        try {
           
            const response = await axios({
               method:'POST',
               url: `${process.env.REACT_APP_ENV}/account-activation`,
               data: {name,token}
            })
            console.log(response)
            if(response){
                toast.success(response.data.message);
            }  
        } catch (error) {
             toast.error(error.response.data.error);
        }
       
    }

    const activateUser = () => {
       
            
        
    }
    
  return (
    <Layout>
        <div className='col-md-6 offset-md-3'>
        <ToastContainer />
        <div className="text-center">
            <h1 className="p-5">Hey {name}, Ready to activate your account?</h1>
            <button className="btn btn-outline-primary" onClick={clickSubmit}>
                Activate Account
            </button>
        </div>
        </div>
    </Layout>
  )
}

export default Activate
