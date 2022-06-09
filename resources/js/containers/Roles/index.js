import React, {useEffect, useMemo, useState} from 'react';
import { createBrowserHistory } from 'history';
import ApiClient from "../../config";
import {toast} from "react-toastify";
import { MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBDataTable, MDBRow } from 'mdbreact';
import 'react-toastify/dist/ReactToastify.css';
import {
    PowerSettingsNewTwoTone as PowerOff, VisibilityOutlined as ViewRecord, EditOutlined as EditRecord, DeleteOutlineRounded as DeleteRecord, Add as AddRolesIcon
} from '@mui/icons-material';

import {Breadcrumbs, Link, Typography} from '@material-ui/core'

export default function Roles() {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [rolesData, setRolesData] = useState([]);
    const userData = localStorage.getItem('users');
    
    const logOut = () => {
        if(confirm('Do you want to log out?')) {
            localStorage.removeItem('users')
            localStorage.removeItem('token')            
            return history.push("/login")
        }
    }

    const deleteRole = (id) => {
        if (confirm('Are you sure you want to delete this role?')) {
            ApiClient.post('/api/roles/delete-role/' + id)
            .then(response => {
                if(response.data){
                    toast.success('Record deleted successfully')
                    return history.push("/roles")
                }
            });
        }else{
            return toast.success('Something went wrong try again')
        }
    }

    useMemo(()=>{
        ApiClient.get('/api/roles/')
        .then(response => {
            let postsArray = [];
            JSON.parse(JSON.stringify(response.data)).map((item, index) => {
                item.ids = (
                    <div className='text-center'>
                        {index+1}
                    </div>
                );
                item.actions = (
                    <div className='text-center d-flex'>
                        <div className='mx-1 rounded custom-actions'>
                            <EditRecord className='action-icon-style' onClick={() => {history.push(`/roles/edit-roles/${item.id}`)}}/>
                        </div>
                        <div className='mx-1 rounded custom-actions'>
                            <DeleteRecord className='action-icon-style' onClick={()=>{deleteRole(item.id)}} /> 
                        </div>
                    </div>  
                );
                postsArray.push(item);
            });
            setRolesData(postsArray)
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
                label: 'Role Name',
                field: 'name',
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
        rows: rolesData
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
                                <Typography className='text-black'>Roles</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right role-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className="card mt-3">
                        <div className="card-header">
                            <strong>Role Details</strong>
                            <AddRolesIcon className='text-align-right add-icon-style' onClick={()=>{history.push('/roles/add-roles')}}/> 
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
