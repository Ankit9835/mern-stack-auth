import React, { useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Signup = () => {
    const[values,setValues] = useState({
        name:'',
        email:'',
        password:'',
        buttonText:'Submit'
    })

    const {name,email,password,buttonText} = values

    const handleChange = name => e => {
        setValues({...values, [name]:e.target.value})
    }

    const clickSubmit = async (e) => {
        e.preventDefault()
        try {
            setValues({...values, buttonText:'Submitting'})
            const response = await axios({
               method:'POST',
               url: `${process.env.REACT_APP_ENV}/signup`,
               data: {name,email,password}
            })
            console.log(response)
            if(response){
                setValues({...values,name:'',email:'',password:''})
                toast.success(response.data.message);
            }  
        } catch (error) {
            setValues({...values,name:'',email:'',password:''})
             toast.error(error.response.data.error);
        }
       
    }

    const signupForm = () => (
        <form>
            <div className="form-group">
                <lable className="text-muted">Name</lable>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>

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
        <h1 className='p-5 text-center'>Sign Up</h1>
        {signupForm()}
        </div>
        
    </Layout>
  )
}

export default Signup
