import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddLeaveTypesIcon, CalendarMonth as TotalLeaves, Sick as SickLeave, Event as CasualLeaves
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
    const [userLeaveData, setUserLeaveData] = useState({
        id:userDataFetched.id,
        balanced_leaves: "",
        c_l: "",
        s_l: ""
    });
    const {id,balanced_leaves,c_l,s_l} = userLeaveData;    
    const [day_type, setDayType] = useState(true)
    const [leaveApplication, setLeaveApplication] = useState({
        from_date: '',
        to_date:'',
        reason:''
    });
    const {from_date, to_date} = leaveApplication;
    const skip_weekends = [1,2,3,4,5];
    const onInputChange = (e) => {
        if(e.target.name === 'day_type'){
            if(e.target.value === 'true'){
                setLeaveApplication({...leaveApplication, to_date:''})
                setDayType(true)
            }else{
                setLeaveApplication({...leaveApplication})  
                setDayType(false)
            }
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

    useEffect(() => {
        if(id){
            ApiClient.get('/api/employees/get-employee/' + id)
            .then(response => {
                if(response.data){ 
                    setUserLeaveData({
                        balanced_leaves:response.data.balanced_leaves, 
                        c_l:response.data.c_l, 
                        s_l:response.data.s_l
                    })    
                }else{
                    toast.error('Something went wrong try again')
                }
            });
        }
    }, [id]);

    const enableMonToFriDates = (date) => {
        return skip_weekends.includes(date.getDay());
    };

    const startdateTrigger = (date) => {
        setLeaveApplication({ ...leaveApplication, from_date: moment(date).format('YYYY-MM-DD') });
    };

    const enddateTrigger = (date) => {
        setLeaveApplication({ ...leaveApplication, to_date: moment(date).format('YYYY-MM-DD') });
    };

    const sendLeaveAppData = () =>
    {
        if(leaveApplication.from_date === ''){
            return toast.error('From Date Field is empty')
        }else if(leaveApplication.reason === ''){
            return toast.error('Reason Field is empty')
        }

        ApiClient.post('/api/leave-applications/apply-leave-application/',leaveApplication)
        .then(response => {
            if(response.status === 201){
                toast.error("Leave already applied wait for the response from the admin")
            }else if(response.status === 200){
                toast.success("Leave Applied Successfully")
                setLeaveType({from_date:'',to_date:'',reason:''})
            }else{
                toast.error('Something went wrong try again')
                setLeaveType({from_date:'',to_date:'',reason:''})
            }
        });
        history.push("/leave-applications")
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
                                <Typography className='text-black'>Apply Leave</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>

                    <div className="row row-cols-1 row-cols-md-4 mt-3">
                        <div className="col-md-4 mb-3">
                            <div className="card violet">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Total Leaves So Far</strong></h6>
                                <TotalLeaves className='card-icon-style svg-icon-violet' />
                                <span className='text-align-right card-text-style circle-span-violet'>{balanced_leaves}</span>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card violet">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Casual Leaves You Have</strong></h6>
                                <CasualLeaves className='card-icon-style svg-icon-teal' />
                                <span className='text-align-right card-text-style circle-span-teal'>{c_l}</span>
                            </div>
                            </div>
                        </div>
                        <div className="col-md-4 mb-3">
                            <div className="card violet">
                            <div className="card-body">
                                <h6 className="card-title"><strong>Sick Leaves You Have</strong></h6>
                                <SickLeave className='card-icon-style svg-icon-red' />
                                <span className='text-align-right card-text-style circle-span-red'>{s_l}</span>
                            </div>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-md-7'>
                            <div className="card">
                                <div className="card-header">
                                    <strong>Leave Application Form</strong>
                                    <a href='' className='btn btn-primary side-link text-align-right' onClick={()=>{history.push('/leave-applications')}}>View Leave Applications</a>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="form-group mt-2">
                                            <label htmlFor="day_type">Select No. Of Days Type:</label>
                                            <select className="form-control custom-options" label="day_type" name="day_type" onChange={e => onInputChange(e)} defaultValue={true}>
                                                <option value={true}>One Day</option>
                                                <option value={false}>More than One Day</option>
                                            </select>
                                        </div>
                                    </div>
                                    {day_type ?
                                    <div className="row">
                                        <div className='form-group mt-1'>
                                            <label htmlFor="from_date">Select a Date</label>
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
                                        <div className="form-group mt-1 col-sm-6">
                                            <label htmlFor="from_date">Select From Date</label>
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
                                        <div className="form-group mt-1 col-sm-6">
                                            <label htmlFor="to_date">Select From Date</label>
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
                                    <div className="form-group mt-1">
                                        <label htmlFor="to_date">Provide a valid reason</label>
                                        <textarea defaultValue={''} className='form-control' name='reason' rows="4" placeholder="Write here.." onChange={e => onInputChange(e)}></textarea>
                                    </div>
                                    <hr/>
                                    <button type="submit" className="btn btn-primary" onClick={sendLeaveAppData}>Submit</button>  
                                </div>
                            </div>
                        </div>
                        <div className='col-md-5'>
                            <div className="card">
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
