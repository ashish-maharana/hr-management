import {React, useState, useEffect} from 'react';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../../config";
import EmailRegex from "../../../components/regex-patterns";
import {
    PowerSettingsNewTwoTone as PowerOff
} from '@mui/icons-material';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'

export default function AddEmployees() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [allroles, setAllRoles] = useState([])
    const [user, setUser] = useState({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        default_role: ""
    });
    const {first_name, last_name, email, password} = user;
    
    const onInputChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    
    const sendEmpData = () =>
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
            return toast.error('Password Field is empty')
        }else if(user.password.length < 6){
            return toast.error('Pass must be atleast 6 characters')
        }else if(user.default_role === ''){
            return toast.error('Role Field is empty')
        }

        ApiClient.post('/api/employees/add-employee/',user)
        .then(response => {
            if(response.status === 201){
                toast.error("Employee Already Exist")
            }else if(response.status === 200){
                toast.success("Employee Created Successfully")
                setUser({first_name:"",last_name:"",email:"",password:"",default_role:""}) // To Clear all fields
            }else{
                toast.error('Something went wrong try again')
                setUser({first_name:"",last_name:"",email:"",password:"",default_role:""}) // To Clear all fields
            }
        });
    }

    const logOut = () => {
        if(confirm('Do you want to log out?')) {
            localStorage.removeItem('users')
            localStorage.removeItem('token')            
            return history.push("/login")
        }
    }

    useEffect(() => {
        ApiClient.get('/api/roles/get-all-roles/')
        .then(response => {
            if(response.data){
                setAllRoles(response.data)
            }else{
                toast.error('Error in fetching Roles')
            }
        });
    }, []);

    const getAllRoles = () => {
        let fetchRolesArray = Object.entries(allroles).map(([key, val]) => {
            return <option key={key} value={val.name}>{val.name}</option>
        });
        return (
            <select className="form-control" label="Role" name="default_role" onChange={e => onInputChange(e)}>
                <option hidden> - Assign Role - </option>
                {fetchRolesArray}
            </select>
        )
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <h4 className="main-header-style"><strong>HR Management App</strong></h4>
                    <div className="row">
                        <div className='col-md-6'>
                            <Breadcrumbs aria-label="breadcrumb">
                                <Link underline="hover" color="inherit" href="/">
                                    Dashboard
                                </Link>
                                <Link underline="hover" color="inherit" href="/employees">
                                    Employees
                                </Link>
                                <Typography className='text-black'>Add Employees</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Add Employee</strong>
                        </div>
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
                                <input type="password" className="form-control" label="Password" name="password" value={password} onChange={e => onInputChange(e)} placeholder="Enter password" required/>
                            </div>
                            <div className="form-group mt-2">
                                {getAllRoles()}
                            </div>
                            <hr/>
                            <button type="submit" className="btn btn-primary" onClick={sendEmpData}>Submit</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
