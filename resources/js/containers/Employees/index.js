import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../config";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import {Breadcrumbs, Link, Typography} from '@material-ui/core'
import { Avatar } from '@mui/material';
import { StyledBadge } from '../../components/CustomStyles';
import { MDBDataTable } from 'mdbreact';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddEmployeesIcon, Close as CloseModal } from '@mui/icons-material';
import { auto } from '@popperjs/core';

export default function Employees() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [userData, setUserData] = useState([]);
    // To handle the dialogue open & close
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const handleClickOpen = (data) => {
        setSelectedUser(data);
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

    const deleteEmp = (id) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            ApiClient.post('/api/employees/delete-employee/' + id)
            .then(response => {
                if(response.data){
                    toast.success('Record deleted successfully')
                    return history.push("/employees")
                }
            });
        }else{
            return toast.error('Something went wrong try again')
        }
    }

    useMemo(()=>{
        ApiClient.get('/api/employees/')
        .then(response => {
            let postsArray = [];
            JSON.parse(JSON.stringify(response.data)).map((item, index) => {
                item.ids = (
                    <div className='text-center'>
                        {index+1}
                    </div>
                );
                item.users = (
                    <div>
                        <div className='d-flex align-items-center'>
                            <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                                <Avatar 
                                    alt={item.first_name + " " + item.last_name} 
                                    src={`images/${item.profiles && item.profiles.image_path ? item.profiles.image_path : 'default-avatar.png'}`} 
                                    sx={{ width: 45, height: 45 , border: '4px double #dfdfdf'}} 
                                />
                            </StyledBadge>
                            <div className='ps-3'>
                                <p className='mb-0'>
                                    <span>{item.first_name + " " + item.last_name}</span> <br/>
                                    <span className='text-muted font-weight-bold'><small>Role : {item.roleName}</small></span>
                                </p>
                            </div>
                        </div>
                    </div>
                );
                item.actions = (
                    <div className='text-center d-flex'>
                        <div className='mx-1 rounded custom-actions'>
                            <ViewRecord className='action-icon-style' onClick={()=> handleClickOpen(item)} />
                        </div>
                        <div className='mx-1 rounded custom-actions'>
                            <EditRecord className='action-icon-style' onClick={() => {history.push(`/employees/edit-employees/${item.id}`)}}/>
                        </div>
                        <div className='mx-1 rounded custom-actions'>
                            <DeleteRecord className='action-icon-style' onClick={()=>{deleteEmp(item.id)}} /> 
                        </div>
                    </div>  
                );
                postsArray.push(item);
            });
            setUserData(postsArray)
        });
    },[]);
    
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
                label: 'Users',
                field: 'users',
                sort: 'asc',
                width: 150
            },
            {
                label: 'Email',
                field: 'email',
                sort: 'asc',
                attributes: {className: 'adjust-width-email'}
            },
            {
                label: 'Actions',
                field: 'actions',
                width: 100,
                attributes: {className: 'text-center'}
            }
        ],
        rows: userData
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
                                <Typography className='text-black'>Employees</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Employee Details</strong>
                            <AddEmployeesIcon className='text-align-right add-icon-style' onClick={()=>{history.push('/employees/add-employees')}}/>    
                        </div>
                        <div className="card-body">
                            <MDBDataTable 
                                className='empTable'
                                striped 
                                bordered 
                                small
                                entries={5}
                                data = {data}
                            />
                        </div>
                    </div>
                    
                    <Dialog key={selectedUser.id} open={open} onClose={handleClose}>
                        <div className="card-header" style={{fontSize: 'initial'}}>
                            <strong>More Details</strong>
                            <CloseModal className='text-align-right close-icon-style' onClick={handleClose}/>    
                        </div>
                        <DialogContent>
                            <div className='d-flex align-items-center'>
                                <StyledBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot">
                                    <Avatar 
                                        alt={selectedUser.first_name + " " + selectedUser.last_name} 
                                        src={`images/${selectedUser.profiles && selectedUser.profiles.image_path ? selectedUser.profiles.image_path : 'default-avatar.png'}`} 
                                        sx={{ width: 60, height: 60 , border: '4px double #dfdfdf'}} 
                                    />
                                </StyledBadge>
                                <div className='ps-3'>
                                    <h4 className='mb-0'>{selectedUser.first_name + " " + selectedUser.last_name}</h4>
                                    <h6 className='mb-0'>Role : {selectedUser.roleName}</h6>
                                </div>
                            </div>
                            <div className='mt-3'>
                                <TableContainer component={Paper}>
                                    <Table aria-label="simple table">
                                        <TableBody>
                                            <TableRow>
                                                <TableCell scope="row"> Email </TableCell>
                                                <TableCell>{selectedUser.email}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell scope="row"> DOB </TableCell>
                                                <TableCell>{selectedUser.profiles && selectedUser.profiles.dob ? selectedUser.profiles.dob : 'Not Updated'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell scope="row"> Gender </TableCell>
                                                <TableCell>{selectedUser.profiles && selectedUser.profiles.gender ? selectedUser.profiles.gender : 'Not Updated'}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell scope="row"> About </TableCell>
                                                <TableCell>{selectedUser.profiles && selectedUser.profiles.about ? selectedUser.profiles.about : 'Not Updated'}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </div>
    );
}
