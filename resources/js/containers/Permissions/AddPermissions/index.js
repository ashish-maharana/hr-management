import {React, useState} from 'react';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../../config";
import EmailRegex from "../../../components/regex-patterns";
import {
    PowerSettingsNewTwoTone as PowerOff
} from '@mui/icons-material';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'

export default function AddPermissions() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [permission, setPermission] = useState({
        name: ""
    });
    const {name} = permission;
    
    const onInputChange = (e) => {
        setPermission({ ...permission, [e.target.name]: e.target.value });
    };
    
    const sendPermissionData = () =>
    {
        if(permission.name === ''){
            return toast.error('Permission Name Field is empty')
        }

        ApiClient.post('/api/permissions/add-permission/',permission)
        .then(response => {
            if(response.status === 201){
                toast.error("Permission Already Exist")
            }else if(response.status === 200){
                toast.success("Permission Added Successfully")
                setPermission({name:""})
            }else{
                toast.error('Something went wrong try again')
                setPermission({name:""})
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
                                <Link underline="hover" color="inherit" href="/permissions">
                                    Permissions
                                </Link>
                                <Typography className='text-black'>Add Permissions</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Add Permission</strong>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <input type="text" className="form-control" label="Permission Name" name="name" value={name} onChange={e => onInputChange(e)} placeholder="Enter Permission Name" required/>
                            </div>
                            <hr/>
                            <button type="submit" className="btn btn-primary" onClick={sendPermissionData}>Submit</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
