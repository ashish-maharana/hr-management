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

export default function EditRoles({match}) {
    const {params:{id}} = match
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [role, setRole] = useState({
        id:"",
        name: ""
    });
    const {name} = role;
    
    const onInputChange = (e) => {
        setRole({ ...role, [e.target.name]: e.target.value });
    };
    
    const sendRoleData = () =>
    {
        if(role.name === ''){
            return toast.error('Role Name Field is empty')
        }

        ApiClient.post('/api/roles/edit-role/',role)
        .then(response => {
            if(response.status === 200){
                toast.success("Role Edited Successfully")
                history.push('/roles')
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
            ApiClient.get('/api/roles/get-role/' + id)
            .then(response => {
                if(response.data){
                    // Data set to useState - (role)
                    setRole({name:response.data.name,id: response.data.id}) 
                }else{
                    toast.error('Something went wrong try again')
                }
            });
        }
    }, [id]);
    
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
                                <Link underline="hover" color="inherit" href="/roles">
                                    Roles
                                </Link>
                                <Typography className='text-black'>Edit Roles</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Edit Role</strong>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <input type="text" className="form-control" label="Role Name" name="name" value={name} onChange={e => onInputChange(e)} placeholder="Enter Role Name" required/>
                            </div>
                            <hr/>
                            <button type="submit" className="btn btn-primary" onClick={sendRoleData}>Submit</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
