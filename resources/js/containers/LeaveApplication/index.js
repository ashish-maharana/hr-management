import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddLeaveTypesIcon
} from '@mui/icons-material';
import moment from 'moment';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'
import 'flatpickr/dist/flatpickr.css'
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

export default function LeaveApplication() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [leaveApplicationsData, setleaveApplicationsData] = useState([]);
    const userData = localStorage.getItem('users');
    const logOut = () => {
        if(confirm('Do you want to log out?')) {
            localStorage.removeItem('users')
            localStorage.removeItem('token')            
            return history.push("/login")
        }
    }

    const statusOfLeave = (status) => {
        let statusArray = {leaveStatus: 'Rejected', statusClass: 'custom-badge-danger'};
        if(status === 0){
            statusArray.leaveStatus = 'Pending'
            statusArray.statusClass = 'custom-actions'
        }else if(status === 1){
            statusArray.leaveStatus = 'Approved'
            statusArray.statusClass = 'custom-badge-success'
        }
        return statusArray
    }

    useMemo(()=>{
        ApiClient.get('/api/leave-applications/get-all-leave-applications')
        .then(response => {
            console.log("Response=>", response)
            let postsArray = [];
            JSON.parse(JSON.stringify(response.data)).map((item, index) => {
                item.ids = (
                    <div className='text-center'>
                        {index+1}
                    </div>
                );
                item.leave_type = (
                    <div className='text-center d-flex align-items-center'>
                        {item.leave_types.name}
                    </div>
                );
                item.from_to_date = (
                    <div className='text-center d-flex align-items-center'>
                        {item.from_date + " | " + item.to_date}
                    </div>
                );
                item.no_of_days = (
                    <div className='text-center'>
                        {moment(item.to_date).diff(item.from_date, 'days')}
                    </div>
                );
                item.status = (
                    <div className='text-center'>
                        <div className={`mx-1 rounded ${statusOfLeave(item.leave_status).statusClass}`}>{statusOfLeave(item.leave_status).leaveStatus}</div>
                    </div>
                );
                item.action = (
                    <div className='text-center d-flex'>
                        <div className='mx-1 rounded custom-actions'>
                            <ViewRecord className='action-icon-style' onClick={() => {history.push(`/leave-types/edit-leave-types/${item.id}`)}}/>
                        </div>
                    </div>  
                );
                postsArray.push(item);
            });
            setleaveApplicationsData(postsArray)
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
                label: 'From-To Date',
                field: 'from_to_date',
                sort: 'asc',
                width: 150
            },
            {
                label: 'No. Of Days',
                field: 'no_of_days',
                sort: 'asc',
                width: 150,
                attributes: {className: 'text-center'}
            },
            {
                label: 'Reason',
                field: 'reason',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Status',
                field: 'status',
                width: 100,
                attributes: {className: 'text-center'}
            },
            {
                label: 'Action',
                field: 'action',
                width: 100,
                attributes: {className: 'text-center'}
            }
        ],
        rows: leaveApplicationsData
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
                                <Typography className='text-black'>Leave Applications</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Leave Requests</strong>
                            <AddLeaveTypesIcon className='text-align-right add-icon-style' onClick={()=>{history.push('/leave-types/add-leave-types')}}/> 
                        </div>
                        <div className="card-body">
                            <MDBDataTable
                                striped 
                                bordered 
                                small
                                entries={5}
                                data={data}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
