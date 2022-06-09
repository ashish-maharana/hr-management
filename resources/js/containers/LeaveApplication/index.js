import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import 'react-toastify/dist/ReactToastify.css';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddLeaveTypesIcon
} from '@mui/icons-material';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/flatpickr.css'
import {Breadcrumbs, Link, Typography} from '@material-ui/core'

export default function LeaveApplication() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [leaveTypesData, setLeaveTypesData] = useState([]);
    const userData = localStorage.getItem('users');
    const skip_weekends = [1,2,3,4,5];
    const [startdate, setStartDate] = useState('');
    const [enddate, setEndDate] = useState('');
    const onInputChange = (e) => {
        //setUser({ ...user, [e.target.name]: e.target.value });
    };
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

    const enabledaily = (date) => {
        return skip_weekends.includes(date.getDay());
    };

    const startdateTrigger = (date) => {
        const startdate = moment(date).format('YYYY-MM-DD');
        setStartDate(startdate);
    };

    const enddateTrigger = (date) => {
        const enddate = moment(date).format('YYYY-MM-DD');
        setEndDate(enddate);
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
                    <div className='row'>
                        <div className='col-md-7'>
                            <div className="card mt-3">
                                <div className="card-header">
                                    <strong>Leave Application Form</strong>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <select className="form-control" label="leave_type" name="leave_type" onChange={e => onInputChange(e)}>
                                            <option hidden> - Select Leave Type - </option>
                                            <option value="0">Casual Leave</option>
                                            <option value="1">Sick Leave</option>
                                            <option value="2">Others</option>
                                        </select>
                                    </div>
                                    <div className="row">
                                        <div className="form-group mt-2 col-sm-6">
                                            <label htmlFor="from_date">From Date:</label>
                                            <input type="date" className="form-control" label="From Date" name="from_date"
                                            onChange={(e) => {
                                                onInputChange(e);
                                                startdateTrigger(e.target.value);
                                            }} required/>
                                        </div>
                                        <div className="form-group mt-2 col-sm-6">
                                            <label htmlFor="to_date">To Date:</label>
                                            <input type="date" className="form-control" label="To Date" name="to_date" 
                                            onChange={(e) => {
                                                onInputChange(e);
                                                enddateTrigger(e.target.value);
                                            }} required/>
                                        </div>
                                    </div>
                                    <div className='form-group mt-2'>
                                        <label htmlFor="to_date">Attachment If any:</label>
                                        <input type="file" className="form-control" label="Attachment" name="attachment" onChange={e => onInputChange(e)} required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <textarea defaultValue={''} className='form-control' name='description' rows="3" placeholder="Provide a reason for the leave.." onChange={e => onInputChange(e)}></textarea>
                                    </div>
                                    <hr/>
                                    <button type="submit" className="btn btn-primary" onClick={()=>{alert('do nothing')}}>Submit</button>  
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <div className="card mt-3">
                                <div className="card-header">
                                    <strong>Leave Calender - (View Only)</strong>
                                </div>
                                <div className='custom-padding-calender'>
                                    <Flatpickr
                                        options={{ 
                                            inline: true,
                                            mode: "multiple",
                                            dateFormat: "Y-m-d",
                                            enable: [ 
                                                enabledaily ? enabledaily : ''
                                            ],
                                            minDate: startdate ? startdate : "today",
                                            maxDate: enddate ? enddate : "",
                                            locale: {
                                                "firstDayOfWeek": 1 // start week on Monday
                                            },
                                        }}
                                    /> 
                                </div>
                            </div>
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
