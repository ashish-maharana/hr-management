import {React, useState} from 'react';
import axios from 'axios';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../config";
import {EmailRegex} from "../../components/regex-patterns";

export default function Login() {
    let history = createBrowserHistory({forceRefresh:true});
    const [user, setUser] = useState({
        email: "",
        password:""
    });
    const {email, password} = user;
    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    
    const signIn = () =>
    {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(user.email === ''){
          return toast.error('Email Field is empty')
        }else if(!regex.test(String(user.email).toLowerCase())){
            return toast.error('Enter valid email')
        }else if(user.password === ''){
          return toast.error('Password Field is empty')
        }else if(user.password.length < 6){
            return toast.error('Pass must be atleast 6 characters')
        }

        ApiClient.post('/api/login/',user)
        .then(response => {
            var json = JSON.stringify(response.data);
            json = JSON.parse(json)
            console.log("json=>", json)
            if(json){
                localStorage.setItem("users",JSON.stringify(json.data.user))
                localStorage.setItem("token",json.data.token)
                history.push("/")
            }else{
                toast.error('Credentials not match')
            }
        });
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className="main-header-style"><strong>HR Management App</strong></h4>
                    <div className="card">
                        <div className="card-header">Login Page</div>
                        <div className="card-body">
                            <div className="form-group">
                                <input type="email" className="form-control" label="Email" name="email" value={email} onChange={e => onInputChange(e)} placeholder="Enter Email" required/>
                            </div>
                            <div className="form-group mt-2">
                                <input type="password" className="form-control" label="Password" name="password" value={password} onChange={e => onInputChange(e)} placeholder="Enter password" required/>
                            </div>
                            <hr/>
                            <button type="submit" className="btn btn-primary" onClick={signIn}>Sign in</button>  
                            <span className="text-align-right mt-2">Don't have account? <a href={"/sign-up"}>Sign Up</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
