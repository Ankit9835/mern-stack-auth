import React, { useEffect, useState } from 'react'
import {Link,useNavigate} from 'react-router-dom'
import Layout from '../core/Layout'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import { authenticate,isAuth,getCookie,signout,updateUser } from '../auth/helpers';
import 'react-toastify/dist/ReactToastify.css';


const Login = () => {
    const navigate = useNavigate()
    const token = getCookie('token')
    const [values, setValues] = useState({
      role: '',
      name: '',
      email: '',
      password: '',
      buttonText: 'Submit'
  });

    const {name,email,role,password,buttonText} = values

    useEffect(() => {
      getSingleUser()
  }, []);

    const getSingleUser = async () => {
      //console.log(isAuth()._id)
        try{
         
          const response = await axios({
            method:"GET",
            url:`${process.env.REACT_APP_ENV}/user/${isAuth()._id}`,
            headers: {
              Authorization: `Bearer ${token}`
           }
          })
          console.log(response)
          if(response){
            const {role,name,email} = response.data.user
            setValues({...values,name,email,role})
          }
        } catch(error){
          console.log(error.message)
        //   if (error.response.status === 401) {
        //     signout(() => {
        //       navigate('/');
        //     });
        // }
        }
    }

    

    const handleChange = name => e => {
        setValues({...values, [name]:e.target.value})
    }

    const clickSubmit = async (e) => {
        e.preventDefault()
        try {
            setValues({...values, buttonText:'Submitting'})
            const response = await axios({
               method:'PUT',
               url: `${process.env.REACT_APP_ENV}/user/update`,
               headers: {
                Authorization: `Bearer ${token}`
               },
               data: {name,password}
            })
           // console.log(response)
            if(response){
              setValues({...values})
              updateUser(response, () => {
                setValues({ ...values, buttonText: 'Submitted' });
                toast.success('Profile updated successfully');
            });
            }  
        } catch (error) {
            setValues({...values,email:'',password:''})
             toast.error(error.response.data.error);
        }
       
    }

    const updateForm = () => (
        <form>
            <div className="form-group">
                <lable className="text-muted">Name</lable>
                <input onChange={handleChange('name')} value={name} type="text" className="form-control" />
            </div>

            <div className="form-group">
                <lable className="text-muted">Password</lable>
                <input onChange={handleChange('password')} type="password" className="form-control" />
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
        {updateForm()}
        </div>
    </Layout>
  )
}

export default Login
