import React from 'react'
import {Link,useNavigate} from 'react-router-dom'
import { isAuth,signout } from '../auth/helpers';

const Layout = ({children}) => {
    const navigate = useNavigate()
    const nav = () => (
        <ul className="nav nav-tabs bg-primary">
            <li className="nav-item">
                <Link to="/" className="nav-link text-white">
                    Home
                </Link>
            </li>
            {!isAuth() && 
            <>
                 <li className="nav-item">
                 <Link to="/signup" className="nav-link text-white">
                     Signup
                 </Link>
                </li>
                <li className="nav-item">
                    <Link to="/login" className="nav-link text-white">
                        Signin
                    </Link>
                </li>
            </>     
            }

            {isAuth() && (
                <li className="nav-item">
                    <span className="nav-link">{isAuth().name}</span>
                </li>
            )}

            {isAuth() && (
                <li className="nav-item">
                    <span
                        className="nav-link"
                        style={{ cursor: 'pointer', color: '#fff' }}
                        onClick={() => {
                            signout(() => {
                                navigate('/');
                            });
                        }}
                    >
                        Signout
                    </span>
                </li>
            )}
          
        </ul>
    );
  return (
    <div>
       {nav()}
        <div className="container">{children}</div>
    </div>
  )
}

export default Layout
