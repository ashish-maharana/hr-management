import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddLeaveTypesIcon
} from '@mui/icons-material';
import moment from 'moment';
import Flatpickr from 'react-flatpickr';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'
import DatePicker from "react-datepicker";
import 'flatpickr/dist/flatpickr.css'
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";

export default function ApplyLeaveApplication() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [allLeaveTypes, setAllLeaveTypes] = useState([])
    const [leaveApplication, setLeaveApplication] = useState({
        day_type: true,
        from_date: '',
        to_date:'',
        reason:'',
        leave_type_id:'',
    });
    const {day_type, from_date, to_date} = leaveApplication;
    const skip_weekends = [1,2,3,4,5];
    const onInputChange = (e) => {
        if(e.target.name === 'day_type'){
            e.target.value === 'true' ? 
                setLeaveApplication({...leaveApplication, to_date:'', [e.target.name]: true})
            : setLeaveApplication({...leaveApplication, [e.target.name]: false});
        }else{
            setLeaveApplication({ ...leaveApplication, [e.target.name]: e.target.value });
        }
    };

    const logOut = () => {
        if(confirm('Do you want to log out?')) {
            localStorage.removeItem('users')
            localStorage.removeItem('token')            
            return history.push("/login")
        }
    }

    const enableMonToFriDates = (date) => {
        return skip_weekends.includes(date.getDay());
    };

    const startdateTrigger = (date) => {
        setLeaveApplication({ ...leaveApplication, from_date: moment(date).format('YYYY-MM-DD') });
    };

    const enddateTrigger = (date) => {
        setLeaveApplication({ ...leaveApplication, to_date: moment(date).format('YYYY-MM-DD') });
    };
    
    useEffect(() => {
        ApiClient.get('/api/leave-types/get-all-leave-types/')
        .then(response => {
            if(response.data){
                setAllLeaveTypes(response.data)
            }else{
                toast.error('Error in fetching Roles')
            }
        });
    }, []);

    const getAllLeaveTypes = () => {
        let fetchLeaveTypes = Object.entries(allLeaveTypes).map(([key, val]) => {
            return <option key={key} value={val.name}>{val.name}</option>
        });
        return (
            <select className="form-control" label="Leave Types" name="leave_type_id" onChange={e => onInputChange(e)}>
                <option hidden> ---- Select Leave Type ---- </option>
                {fetchLeaveTypes}
            </select>
        )
    };

    const sendLeaveAppData = () =>
    {
        if(leaveApplication.from_date === ''){
            return toast.error('From Date Field is empty')
        }else if(leaveApplication.leave_type_id === ''){
            return toast.error('Leave Type Field is empty')
        }else if(leaveApplication.reason === ''){
            return toast.error('Reason Field is empty')
        }

        ApiClient.post('/api/leave-applications/apply-leave-application/',leaveApplication)
        .then(response => {
            if(response.status === 201){
                toast.error("Leave already applied wait for the response from the admin")
            }else if(response.status === 200){
                toast.success("Leave Applied Successfully")
                setLeaveType({from_date:'',to_date:'',reason:'',leave_type_id:''})
            }else{
                toast.error('Something went wrong try again')
                setLeaveType({from_date:'',to_date:'',reason:'',leave_type_id:''})
            }
        });
        // history.push("/leave-types")
    }
    console.log("Leave APP Data =>\n", leaveApplication)
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
                                <Typography className='text-black'>Leave Application</Typography>
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
                                    <div className="row">
                                        <div className="form-group mt-2 col-sm-6">
                                            <select className="form-control custom-options" label="day_type" name="day_type" onChange={e => onInputChange(e)}>
                                                <option hidden> - Select No. Of Days Type - </option>
                                                <option value={true} defaultValue={true}>One Day</option>
                                                <option value={false}>More than One Day</option>
                                            </select>
                                        </div>
                                        <div className="form-group mt-2 col-sm-6">
                                            {getAllLeaveTypes()}
                                        </div>
                                    </div>
                                    {day_type ?
                                    <div className="row">
                                        <div className='form-group mt-3'>
                                            <DatePicker
                                                name="from_date"
                                                className="form-control"
                                                dateFormat="YYYY-MM-DD"
                                                placeholderText='Select Date'
                                                minDate={moment().toDate()}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={15}
                                                autocomplete="off"
                                                onChange={(e) => {
                                                    startdateTrigger(e);
                                                }}
                                                value={from_date}
                                            />
                                        </div>
                                    </div>
                                    :
                                    <div className="row">
                                        <div className="form-group mt-3 col-sm-6">
                                            <DatePicker
                                                name="from_date"
                                                className="form-control"
                                                dateFormat="YYYY-MM-DD"
                                                placeholderText='From Date'
                                                minDate={moment().toDate()}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={15}
                                                autocomplete="off"
                                                onChange={(e) => {
                                                    startdateTrigger(e);
                                                }}
                                                value={from_date}
                                            />
                                        </div>
                                        <div className="form-group mt-3 col-sm-6">
                                            <DatePicker
                                                name="to_date"
                                                className="form-control"
                                                dateFormat="YYYY-MM-DD"
                                                placeholderText='To Date'
                                                minDate={moment().toDate()}
                                                showYearDropdown
                                                scrollableYearDropdown
                                                yearDropdownItemNumber={15}
                                                autocomplete="off"
                                                onChange={(e) => {
                                                    enddateTrigger(e);
                                                }}
                                                value={to_date}
                                            />
                                        </div>
                                    </div>}
                                    <div className='form-group mt-2'>
                                        <label htmlFor="to_date">Attachment If any:</label>
                                        <input type="file" className="form-control" label="Attachment" name="attachment" onChange={e => onInputChange(e)} required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <textarea defaultValue={''} className='form-control' name='reason' rows="3" placeholder="Provide a reason for the leave.." onChange={e => onInputChange(e)}></textarea>
                                    </div>
                                    <hr/>
                                    <button type="submit" className="btn btn-primary" onClick={sendLeaveAppData}>Submit</button>  
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <div className="card mt-3">
                                <div className="card-header">
                                    <strong>Leave Calender - (View Only)</strong>
                                </div>
                                <div className='custom-padding-calender'>
                                    {day_type ? 
                                        <Flatpickr
                                            value={from_date}
                                            options={{ 
                                                inline: true,
                                                enable: [ 
                                                    enableMonToFriDates ? enableMonToFriDates : ''
                                                ], 
                                                minDate: "today",
                                                locale: {
                                                    "firstDayOfWeek": 1 // start week on Monday
                                                },
                                            }}
                                        />
                                    : 
                                        <Flatpickr
                                            options={{ 
                                                inline: true,
                                                mode: "multiple",
                                                dateFormat: "Y-m-d",
                                                enable: [ 
                                                    enableMonToFriDates ? enableMonToFriDates : ''
                                                ],
                                                minDate: from_date ? from_date : "today",
                                                maxDate: to_date ? to_date : "",
                                                locale: {
                                                    "firstDayOfWeek": 1 // start week on Monday
                                                },
                                            }}
                                        />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
