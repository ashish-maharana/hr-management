import {React, useState} from 'react';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../config";
import EmailRegex from "../../components/regex-patterns";

export default function SignUp() {
    let history = createBrowserHistory({forceRefresh:true});
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password:"",
        default_role:"Employee"
    });
    const {first_name, last_name, email, password, default_role} = user;

    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    
    const signUp = () =>
    {
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(user.first_name === ''){
            return toast.error('First Name Field is empty')
        }else if(user.last_name === ''){
            return toast.error('Last Name Field is empty')
        }else if(user.email === ''){
            return toast.error('Email Field is empty')
        }else if(!regex.test(String(user.email).toLowerCase())){
            return toast.error('Enter valid email')
        }else if(user.password === ''){
            return toast.error('Pass Field is empty')
        }else if(user.password.length < 6){
            return toast.error('Pass must be atleast 6 characters')
        }

        ApiClient.post('/api/register/',user)
        .then(response =>{
            var json = JSON.stringify(response.data);
            json = JSON.parse(json)
            if(json && json.data){
                setUser({first_name:"",last_name:"",email:"",password:""})
                return toast.success('Register Successfully, Login now')
            }else if(json.email){
                setUser({first_name:"",last_name:"",email:"",password:""})
                return toast.error('Email already exist')
            }else{
                console.log("else json =>\n", json);
                setUser({first_name:"",last_name:"",email:"",password:""})
                return toast.error('Request failed try again')
            }
        });
    }
    
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className="main-header-style"><strong>HR Management App</strong></h4>
                    <div className="card">
                        <div className="card-header">Sign Up Page</div>
                        <div className="card-body">
                            <div className="form-group">
                                <input type="text" className="form-control" label="First Name" name="first_name" value={first_name} onChange={e => onInputChange(e)} placeholder="Enter First Name" required/>
                            </div>
                            <div className="form-group mt-2">
                                <input type="text" className="form-control" label="Last Name" name="last_name" value={last_name} onChange={e => onInputChange(e)} placeholder="Enter Last Name" required/>
                            </div>
                            <div className="form-group mt-2">
                                <input type="email" className="form-control" label="Email" name="email" value={email} onChange={e => onInputChange(e)} placeholder="Enter Email" required/>
                            </div>
                            <div className="form-group mt-2">
                                <input type="password" className="form-control" label="Password" name="password" value={password} onChange={e => onInputChange(e)} placeholder="Enter Password" required/>
                            </div>
                            
                            <hr/>
                            <button type="submit" className="btn btn-primary" onClick={signUp}>Sign Up</button>  
                            <span className="text-align-right mt-2">Have an account? <a href={"/login"}>Sign In</a></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
