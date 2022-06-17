import {React, useState, useEffect, useMemo} from 'react';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../config";
import { ArrowRight as PunchIn, ArrowLeft as PunchOut, EventNote as LeaveRequests, EventAvailable as LeaveApproved, EventBusy as LeaveDeclined, TouchApp as PresentToday, AccountBox as EditProfile, PowerSettingsNewTwoTone as PowerOff, GroupRounded as TotalEmployees, CalendarMonth as TotalLeaves, Sick as SickLeave, Event as CasualLeaves, Settings as ManageRoles, AdminPanelSettings as ManagePermissions, Done as ApproveLeave, Close as RejectLeave} from '@mui/icons-material';
import { MDBDataTable } from 'mdbreact';
import { Avatar, Link } from '@mui/material';
import moment from 'moment';
import { StyledBadge } from '../../components/custom-components';

export default function Dashboard() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const isAdmin = userDataFetched.roleName[0] === 'Admin' ? true : false;
    const [leaveApplicationsData, setleaveApplicationsData] = useState([]);
    const userIsActive = localStorage.getItem('users');
    const [userData, setUserData] = useState({
        first_name: "",
        last_name: "",
        image_path: "",
    });
    const {first_name, last_name, image_path} = userData;
    const logOut = () => {
        if(confirm('Do you want to log out?')) {
            localStorage.removeItem('users')
            localStorage.removeItem('token')
            return history.push("/login")
        }
    }
    
    useEffect(() => {
        if(userDataFetched.id){
            ApiClient.get('/api/employees/get-employee/' + userDataFetched.id)
            .then(response => {
                if(response.data){ 
                    setUserData({first_name:response.data.first_name, last_name:response.data.last_name, image_path: response.data.profiles ? response.data.profiles.image_path : null})    
                }else{
                    toast.error('Something went wrong try again')
                }
            });
        }
    }, [userDataFetched.id]);
    
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
                item.actions = (
                    <div className='text-center d-flex'>
                        <div className='mx-1 rounded custom-actions'>
                            <ApproveLeave className='action-icon-style' onClick={() => {history.push(`/leave-types/edit-leave-types/${item.id}`)}}/>
                        </div>
                        <div className='mx-1 rounded custom-actions'>
                            <RejectLeave className='action-icon-style' onClick={() => {history.push(`/leave-types/edit-leave-types/${item.id}`)}}/>
                        </div>
                    </div>  
                );
                postsArray.push(item);
            });
            setleaveApplicationsData(postsArray)
        });
    },[userIsActive]);
    
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
                label: 'Actions',
                field: 'actions',
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
                    <div className="card">
                        <div className="card-header">
                            <strong>Dashboard</strong>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})</strong></span> 
                            <span className='text-align-right text-muted'><small><b>Last Punch Out :</b> 31 May 2022 11:12AM</small>&nbsp;&nbsp;|&nbsp;&nbsp;</span>
                        </div>
                        <div className="card-body">
                            <div className='row align-items-center'>
                                <div className='col-md-3'>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                                                        <Avatar 
                                                            alt={first_name + last_name} 
                                                            src={`images/${image_path ? image_path : 'default-avatar.png'}`} 
                                                            sx={{ width: 60, height: 60 , border: '4px double #dfdfdf'}} 
                                                        />
                                                    </StyledBadge>
                                                </td>
                                                <td>
                                                    <div className='px-3'><strong>Welcome, {first_name}</strong></div> 
                                                    <div className='px-3'>
                                                        <Link href="/profile" underline="hover">
                                                            Manage Profile <EditProfile style={{fontSize: 'initial', color: 'cornflowerblue'}}/>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {
                                    isAdmin ? 
                                    <div className='col-md-9'>
                                        <span className='mx-2 rounded custom-auths text-align-right' onClick={()=>{history.push('/leave-types')}}>Manage Leaves<TotalLeaves className='svg-icon-lighblue'/></span>
                                        <span className='rounded custom-auths text-align-right' onClick={()=>{history.push('/permissions')}}>Manage Permissions<ManagePermissions className='svg-icon-lighblue'/></span>
                                        <span className='mx-2 rounded custom-auths text-align-right' onClick={()=>{history.push('/roles')}}>Manage Roles<ManageRoles className='svg-icon-lighblue'/></span> 
                                    </div> : 
                                    <div className='col-md-9'>
                                        <span className='rounded custom-badge-punch-in text-align-right' onClick={()=>{history.push('/')}}>Punch In<PunchIn className='svg-icon-punch-in'/></span> 
                                        <span className='mx-2 rounded custom-auths text-align-right' onClick={()=>{history.push('/leave-applications')}}>Leave Applications<TotalLeaves className='svg-icon-lighblue'/></span>
                                        <span className='mx-2 rounded custom-auths text-align-right' onClick={()=>{history.push('/apply-leave')}}>Apply Leave<TotalLeaves className='svg-icon-lighblue'/></span>
                                        
                                    </div> 
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row row-cols-1 row-cols-md-4 mt-3">
                        <div className="col mb-3" onClick={()=>{isAdmin ? history.push("/employees") : ''}} style={{cursor: "pointer"}}>
                            <div className="card violet">
                            <div className="card-body">
                                <h6 className="card-title"><strong>{isAdmin ? 'Total Employees' : 'Total Leaves for the year'}</strong></h6>
                                {isAdmin ? <TotalEmployees className='card-icon-style svg-icon-violet' /> : <TotalLeaves className='card-icon-style svg-icon-violet' />}
                                <span className='text-align-right card-text-style circle-span-violet'>20</span>
                            </div>
                            </div>
                        </div>
                        <div className="col mb-3" style={{cursor: "pointer"}}>
                            <div className="card red">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Casual Leaves Taken</strong></h6>
                                <CasualLeaves className='card-icon-style svg-icon-red' /> 
                                <span className='text-align-right card-text-style circle-span-red'>10</span>
                            </div>
                            </div>
                        </div>
                        <div className="col mb-3" style={{cursor: "pointer"}}>
                            <div className="card teal">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Sick Leaves Taken</strong></h6>
                                <SickLeave className='card-icon-style svg-icon-teal' /> 
                                <span className='text-align-right card-text-style circle-span-teal'>3</span>
                            </div>
                            </div>
                        </div>
                        <div className="col mb-3" style={{cursor: "pointer"}}>
                            <div className="card blue">
                            <div className="card-body">
                                <h6 className="card-title"><strong>{isAdmin ? 'Total Other Leaves' : 'Other Leaves Taken'}</strong></h6>
                                <TotalLeaves className='card-icon-style svg-icon-blue' /> 
                                <span className='text-align-right card-text-style circle-span-blue'>28</span>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3" style={{cursor: "pointer"}}>
                            <div className="card">
                            <div className="card-body">
                                <h6 className="card-title"><strong>{isAdmin ? 'Total Present Today' : 'Total for year'}</strong></h6>
                                {isAdmin ? <PresentToday className='card-icon-style svg-icon-blue' />  : <LeaveRequests className='card-icon-style svg-icon-blue' /> }
                                <span className='text-align-right card-text-style circle-span-blue'>7</span>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3" style={{cursor: "pointer"}}>
                            <div className="card">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Approved Leaves</strong></h6>
                                <LeaveApproved className='card-icon-style svg-icon-teal' />
                                <span className='text-align-right card-text-style circle-span-teal'>3</span>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3" style={{cursor: "pointer"}}>
                            <div className="card">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Declined Leaves</strong></h6>
                                <LeaveDeclined className='card-icon-style svg-icon-red' /> 
                                <span className='text-align-right card-text-style circle-span-red'>2</span>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-3 mb-3" style={{cursor: "pointer"}}>
                            <div className="card">
                            <div className="card-body">
                                <h6 className="card-title"><strong>{isAdmin ? 'Leave Requests' : 'Leaves taken / requested'}</strong></h6>
                                {isAdmin ? <LeaveRequests className='card-icon-style svg-icon-violet' /> : <LeaveRequests className='card-icon-style svg-icon-violet' /> }
                                <span className='text-align-right card-text-style circle-span-violet'>5</span>
                            </div>
                            </div>
                        </div>
                    </div>
                    {isAdmin ?
                    <div className="card">
                        <div className="card-header">
                            <strong>Leave Requests</strong>
                        </div>
                        <div className="card-body">
                            <MDBDataTable 
                                striped 
                                bordered 
                                small
                                entries={5}
                                data = {data?data:null}
                            />
                        </div>
                    </div> : ''}
                </div>
            </div>
        </div>
    );
}
