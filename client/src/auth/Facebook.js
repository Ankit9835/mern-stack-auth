import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';

const Facebook =  () => {

    const responseFacebook = (response) => {
        console.log(response);
      }
   

    return (
       
        <div className="pb-3">
             <FacebookLogin
            appId="632068222056139"
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook} />,
       
        </div>
    );
}

export default Facebook
