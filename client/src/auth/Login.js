import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate,isAuth } from './helpers';
import 'react-toastify/dist/ReactToastify.css';
import Google from './Google';



const Login = () => {
    const navigate = useNavigate()
    const[values,setValues] = useState({
        email:'',
        password:'',
        buttonText:'Submit'
    })

    const {email,password,buttonText} = values

    const handleChange = name => e => {
        setValues({...values, [name]:e.target.value})
    }

    const redirectToDashboard = (response) => {
        authenticate(response, () => {
            {isAuth() && isAuth().role === 'admin' ? navigate('/admin') : navigate('/') }
        })
    }

    const clickSubmit = async (e) => {
        e.preventDefault()
        try {
            setValues({...values, buttonText:'Submitting'})
            const response = await axios({
               method:'POST',
               url: `${process.env.REACT_APP_ENV}/login`,
               data: {email,password}
            })
            console.log(response)
            if(response){
                authenticate(response, () => {
                    setValues({...values,email:'',password:''})
                    {isAuth() && isAuth().role === 'admin' ? navigate('/admin') : navigate('/') }
                })
            }  
        } catch (error) {
            setValues({...values,email:'',password:''})
             toast.error(error.response.data.error);
        }
       
    }

    const signinForm = () => (
        <form>
            <div className="form-group">
                <lable className="text-muted">Email</lable>
                <input onChange={handleChange('email')} value={email} type="email" className="form-control" />
            </div>

            <div className="form-group">
                <lable className="text-muted">Password</lable>
                <input onChange={handleChange('password')} value={password} type="password" className="form-control" />
            </div>

            <div>
                <button className="btn btn-primary" onClick={clickSubmit}>
                    {buttonText}
                </button>
            </div>
        </form>
    );
  return (
    <Layout>
        <div className='col-md-6 offset-md-3'>
        <ToastContainer />
        <h1 className='p-5 text-center'>Log In</h1>
        <Google redirectToDashboard={redirectToDashboard}/>
        {signinForm()}
        </div>
    </Layout>
  )
}

export default Login
