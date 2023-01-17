import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate,isAuth } from './helpers';
import 'react-toastify/dist/ReactToastify.css';


const Forgot = () => {
    const navigate = useNavigate()
    const[values,setValues] = useState({
        email:'',
        buttonText:'Submit'
    })

    const {email,buttonText} = values

    const handleChange = name => e => {
        setValues({...values, [name]:e.target.value})
    }

    const clickSubmit = async (e) => {
        e.preventDefault()
        try {
            setValues({...values, buttonText:'Submitting'})
            const response = await axios({
               method:'POST',
               url: `${process.env.REACT_APP_ENV}/forgot-password`,
               data: {email}
            })
            console.log(response)
            if(response){
                setValues({...values,email:''})
                toast.success(`Email has been sent to ${email}, kindly update your password`)
            }  
        } catch (error) {
            setValues({...values,email:''})
             toast.error(error.response.data.error);
        }
       
    }

    const forgotForm = () => (
        <form>
            <div className="form-group">
                <lable className="text-muted">Email</lable>
                <input onChange={handleChange('email')} value={email}  type="email" className="form-control" />
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
        <h1 className='p-5 text-center'>Reset Password Here</h1>
        {forgotForm()}
        </div>
    </Layout>
  )
}

export default Forgot
