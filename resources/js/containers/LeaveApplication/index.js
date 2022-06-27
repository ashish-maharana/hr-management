import React, {useEffect, useMemo, useState, useRef} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddLeaveTypesIcon, CalendarMonth as TotalLeaves, Sick as SickLeave, Event as CasualLeaves, Close as CloseModal
} from '@mui/icons-material';
import moment from 'moment';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'
import 'flatpickr/dist/flatpickr.css'
import 'react-toastify/dist/ReactToastify.css';
import "react-datepicker/dist/react-datepicker.css";
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

export default function LeaveApplication() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const hiddenFileInput = useRef(null);
    const [userLeaveData, setUserLeaveData] = useState({
        id:userDataFetched.id,
        balanced_leaves: "",
        c_l: "",
        s_l: ""
    });
    const {id,balanced_leaves,c_l,s_l} = userLeaveData;
    const [leaveApplicationsData, setleaveApplicationsData] = useState([]);
    const userData = localStorage.getItem('users');
    const [selectedDoc, setSelectedDoc] = useState('');
    const [open, setOpen] = useState(false);
    const handleAlertMessage = (id, data, sickRemark, status) => {
        let leaveData = {'leaveAppId':id, 'sickDoc': data, 'sickRemark': sickRemark, 'leaveStatus': status}
        setSelectedDoc(leaveData);
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };
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
                    <div className='d-flex align-items-center'>
                        {item.leave_types.name}
                    </div>
                );
                item.from_to_date = (
                    <div className='d-flex align-items-center'>
                        {`"`+item.from_date+`"` + " To " + `"`+item.to_date+`"` + " = (" + (moment(item.to_date).diff(item.from_date, 'days')+1) + " Days)"}
                    </div>
                );
                item.upload_sick_doc = (
                    item.attachment ? 
                    <div className='text-center'>
                        <button name='btnSickDoc' onClick={()=> handleAlertMessage(item.id, item.attachment, item.sick_remark, item.leave_status)} className='custom-badge-upload'>View Document</button>
                    </div> : 
                    <div className='text-center'>
                        <button name='btnSickDoc' className='custom-badge-upload' onClick={handleClick}>Upload Doc</button>
                        <input type='file' className="d-none" id="sick_doc" name='sick_doc' ref={hiddenFileInput} onChange={(e) => handleSicDocUpload(e, item.id)}/> 
                    </div> 
                ); 
                item.status = (
                    <div className='text-center'>
                        <div className={`mx-1 rounded ${statusOfLeave(item.leave_status).statusClass}`}>{statusOfLeave(item.leave_status).leaveStatus}</div>
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
                label: 'Reason',
                field: 'reason',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Upload Sick Doc',
                field: 'upload_sick_doc',
                width: 100,
                attributes: {className: 'text-center'}
            },
            {
                label: 'Status',
                field: 'status',
                width: 100,
                attributes: {className: 'text-center'}
            }
        ],
        rows: leaveApplicationsData
    };
    
    const handleClick = () => {
        hiddenFileInput.current.click();
    }

    const handleSicDocUpload = (event, id) => {
        let formData = new FormData()
        formData.append('id', id)
        formData.append('attachment', event.target.files[0])
        ApiClient.post('/api/leave-applications/apply-for-sick-doc-approval/',formData)
        .then(response => {
            if(response.status === 200){
                toast.success("Document Uploaded Successfully Wait for Response")
                history.push("/leave-applications")
            }else{
                toast.error('Something went wrong try again')
            }
        });
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
                    
                    <div className="card">
                        <div className="card-header">
                            <strong>Leave Requests</strong>
                            <a href='' className='btn btn-primary side-link text-align-right' onClick={()=>{history.push('/apply-leave')}}>Apply Leave</a>
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
                    <Dialog key={selectedDoc} open={open} onClose={handleClose}>
                        <div className="card-header">
                            <strong>Medical Document</strong>
                            <CloseModal className='text-align-right close-icon-style' onClick={handleClose}/>    
                        </div>
                        <DialogContent className='dialog-overflow'>
                        {selectedDoc.sickRemark && selectedDoc.leaveStatus !== 0 ? 
                            <div className="alert alert-secondary p-1 m-2">
                                <strong>Remark :</strong> {selectedDoc.sickRemark}
                            </div> : <div className="alert alert-secondary p-1 m-2">
                                <strong>Remark :</strong> No Remarks Yet
                            </div>}
                            <hr style={{margin: '5px 5px 0px 0px'}}/>
                            <img src={`images/sickDocs/${selectedDoc.sickDoc}`} className="view-sick-doc"/>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
