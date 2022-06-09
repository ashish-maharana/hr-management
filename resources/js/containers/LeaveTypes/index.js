import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import 'react-toastify/dist/ReactToastify.css';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddLeaveTypesIcon
} from '@mui/icons-material';

import {Breadcrumbs, Link, Typography} from '@material-ui/core'

export default function LeaveTypes() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [leaveTypesData, setLeaveTypesData] = useState([]);
    const userData = localStorage.getItem('users');
    
    const logOut = () => {
        if(confirm('Do you want to log out?')) {
            localStorage.removeItem('users')
            localStorage.removeItem('token')            
            return history.push("/login")
        }
    }

    const deleteLeaveType = (id) => {
        if (confirm('Are you sure you want to delete this leave-type?')) {
            ApiClient.post('/api/leave-types/delete-leave-type/' + id)
            .then(response => {
                if(response.data){
                    toast.success('Record deleted successfully')
                    return history.push("/leave-types")
                }
            });
        }else{
            return toast.error('Something went wrong try again')
        }
    }

    useMemo(()=>{
        ApiClient.get('/api/leave-types/')
        .then(response => {
            let postsArray = [];
            JSON.parse(JSON.stringify(response.data)).map((item, index) => {
                item.ids = (
                    <div className='text-center'>
                        {index+1}
                    </div>
                );
                item.leave_type = (
                    <div className='d-flex align-items-center'>
                        {item.name}
                    </div>
                );
                item.actions = (
                    <div className='text-center d-flex'>
                        <div className='mx-1 rounded custom-actions'>
                            <EditRecord className='action-icon-style' onClick={() => {history.push(`/leave-types/edit-leave-types/${item.id}`)}}/>
                        </div>
                        <div className='mx-1 rounded custom-actions'>
                            <DeleteRecord className='action-icon-style' onClick={()=>{deleteLeaveType(item.id)}} /> 
                        </div>
                    </div>  
                );
                postsArray.push(item);
            });
            setLeaveTypesData(postsArray)
        });
    },[userData]);
    
    const data = {
        columns: [
            {
                label: 'ID',
                field: 'ids',
                sort: 'asc',
                width: 150,
                attributes: {className: 'text-center'}
                },
            {
                label: 'Leave Type',
                field: 'leave_type',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Days Allowed',
                field: 'no_of_days_allowed',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Description',
                field: 'description',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Actions',
                field: 'actions',
                width: 100,
                attributes: {className: 'text-center'}
            }
        ],
        rows: leaveTypesData
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
                                <Typography className='text-black'>Leave Types</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Leave Type Details</strong>
                            <AddLeaveTypesIcon className='text-align-right add-icon-style' onClick={()=>{history.push('/leave-types/add-leave-types')}}/> 
                        </div>
                        <div className="card-body">
                            <MDBDataTable
                                striped 
                                bordered 
                                small
                                entries={5}
                                data = {data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
