import React, { useEffect, useState } from 'react'
import {Link,useNavigate,useParams} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate,isAuth } from './helpers';
import 'react-toastify/dist/ReactToastify.css';
import jwt_decode from 'jwt-decode'


const Reset = () => {
    const navigate = useNavigate()
    const[values,setValues] = useState({
        name:'',
        resetPasswordLink:'',
        newPassword:'',
        buttonText:'Submit'
    })
    let {resetPasswordLink} = useParams()
    console.log(resetPasswordLink)
    useEffect(() => {
        if(resetPasswordLink){
            let {name} = jwt_decode(resetPasswordLink)
            setValues({
                ...values,
                name,
                resetPasswordLink
            })
        }
    },[])
    const {newPassword,buttonText} = values
    //console.log(resetPasswordLink)
    const handleChange = name => e => {
        setValues({...values, [name]:e.target.value})
    }

    const clickSubmit = async (e) => {
        e.preventDefault()
        try {
            setValues({...values, buttonText:'Submitting'})
            const response = await axios({
               method:'POST',
               url: `${process.env.REACT_APP_ENV}/reset-password`,
               data: {newPassword,resetPasswordLink}
            })
           
                setValues({...values,newPassword:''})
                toast.success('Password Updated Successfully');
            
        } catch (error) {
            setValues({...values,newPassword:''})
             toast.error(error.response.data.error);
        }
       
    }

    const resetForm = () => (
        <form>
            <div className="form-group">
                <lable className="text-muted">Password</lable>
                <input onChange={handleChange('newPassword')} value={newPassword}  type="password" className="form-control" />
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
        <h1 className='p-5 text-center'>Update New Password Here</h1>
        {resetForm()}
        </div>
    </Layout>
  )
}

export default Reset
