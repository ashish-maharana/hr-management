import {React, useState, useEffect, useMemo} from 'react';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../../config";
import EmailRegex from "../../../components/regex-patterns";
import {
    PowerSettingsNewTwoTone as PowerOff
} from '@mui/icons-material';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'

export default function EditEmployees({match}) {
    const {params:{id}} = match
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [allroles, setAllRoles] = useState([])
    const [user, setUser] = useState({
        id:"",
        first_name: "",
        last_name: "",
        email: "",
        default_role: "",
    });
    const {first_name, last_name, email, default_role} = user;
    
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
        }else if(user.default_role === ''){
            return toast.error('Role Field is empty')
        }

        ApiClient.post('/api/employees/edit-employee/',user)
        .then(response => {
            if(response.status === 200){
                toast.success("Employee Edited Successfully")
                history.push('/employees')
            }else{
                toast.error('Something went wrong try again')
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
        if(id){
            ApiClient.get('/api/employees/get-employee/' + id)
            .then(response => {
                if(response.data){
                    // for fetching all roles 
                    console.log("Data = >\n", response.data)
                    ApiClient.get('/api/roles/get-all-roles/')
                    .then(roleResponse => {
                        if(roleResponse.data){
                            setAllRoles(roleResponse.data)
                        }else{
                            toast.error('Error in fetching Roles')
                        }
                    });
                    // Data set to useState - (user)
                    setUser({first_name:response.data.first_name, last_name:response.data.last_name, email:response.data.email, id: response.data.id, default_role: response.data.roleName.toString()}) 
                }else{
                    toast.error('Something went wrong try again')
                }
            });
        }
    }, [id]);
    
    const getAllRoles = () => {
        let fetchRolesArray = Object.entries(allroles).map(([key, val]) => {
            return <option key={key} value={val.name} selected={val.name === default_role ? 'selected' : false}>{val.name}</option>
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
                                <Typography className='text-black'>Edit Employees</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Edit Employee</strong>
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
