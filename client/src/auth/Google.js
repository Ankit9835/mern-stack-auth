import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

const Google =  ({redirectToDashboard = f => f}) => {

    const credentialResponse = async (response) => {
        //console.log(response.credential)
        try{
            const data =  await axios({
                method:'POST',
                url:`${process.env.REACT_APP_ENV}/google-login`,
                data:{idToken:response.credential}
            })
            if(data){
                console.log('GOOGLE SIGNIN SUCCESS', response);
                redirectToDashboard(data)
            } else {
                console.log('GOOGLE SIGNIN ERROR');
            }
        } catch(err){
            console.log(err)
        }   
    }
   

    return (
       
        <div className="pb-3">
             <GoogleOAuthProvider clientId="526836753749-6d78bt9o006vl82d9pb923kil3kl6773.apps.googleusercontent.com">
                <GoogleLogin
                onSuccess={credentialResponse}
                onError={() => {
                    console.log('Login Failed');
                }}
                />
            </GoogleOAuthProvider>
           
        </div>
    );
}

export default Google
