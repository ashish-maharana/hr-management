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

export default function AddLeaveTypes() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [leaveType, setLeaveType] = useState({
        name: "",
        description: ""
    });
    const {name, description} = leaveType;
    
    const onInputChange = (e) => {
        setLeaveType({ ...leaveType, [e.target.name]: e.target.value });
    };
    
    const sendLeaveTypeData = () =>
    {
        if(leaveType.name === ''){
            return toast.error('Leave Type Field is empty')
        }else if(leaveType.description === ''){
            return toast.error('Description Field is empty')
        }

        ApiClient.post('/api/leave-types/add-leave-type/',leaveType)
        .then(response => {
            if(response.status === 201){
                toast.error("Leave Type Already Exist")
            }else if(response.status === 200){
                toast.success("Leave Type Added Successfully")
                setLeaveType({name:"",description:""})
            }else{
                toast.error('Something went wrong try again')
                setLeaveType({name:"",description:""})
            }
        });
        history.push("/leave-types")
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
                                <Link underline="hover" color="inherit" href="/leave-types">
                                    Leave Types
                                </Link>
                                <Typography className='text-black'>Add Leave Types</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Add Leave Types</strong>
                        </div>
                        <div className="card-body">
                            <div className="form-group">
                                <input type="text" className="form-control" label="Leave Type" name="name" value={name} onChange={e => onInputChange(e)} placeholder="Enter Leave Type" required/>
                            </div>
                            <div className="form-group mt-2">
                                <textarea defaultValue={description} className='form-control' name='description' rows="3" placeholder="Write Description if any.." onChange={e => onInputChange(e)}></textarea>
                            </div>
                            <hr/>
                            <button type="submit" className="btn btn-primary" onClick={sendLeaveTypeData}>Submit</button>  
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
