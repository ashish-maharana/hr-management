import {React, useState, useEffect, useRef} from 'react';
import { createBrowserHistory } from 'history';
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ApiClient from "../../config";
import {
    PowerSettingsNewTwoTone as PowerOff,
    ManageAccounts as RoleIcon
} from '@mui/icons-material';
import {Box, Breadcrumbs, Divider, Link, List, ListItemIcon, ListItemText, Typography} from '@material-ui/core'
import { Avatar, ListItemButton } from '@mui/material';
import { StyledProfileBadge } from '../../components/CustomStyles';

export default function Profile(props) {
    let history = createBrowserHistory({forceRefresh:true});
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    const [profile, setProfile] = useState({
        id:userDataFetched.id,
        first_name: "",
        last_name: "",
        dob: "",
        gender: "",
        about: "",
        image_path: "",
    });
    const {id,first_name,last_name,dob,gender,about,image_path} = profile;
    const hiddenFileInput = useRef(null);
    const onInputChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };
    
    const sendProfileData = () =>
    {
        if(profile.first_name === ''){
            return toast.error('Profile Name Field is empty')
        }else if(profile.last_name === ''){
            return toast.error('Last Name Field is empty')
        }else if(profile.dob === ''){
            return toast.error('Dob Field is empty')
        }else if(profile.gender === ''){
            return toast.error('Gender Field is empty')
        }else if(profile.about === ''){
            return toast.error('About Field is empty')
        }

        let formData = new FormData()
        formData.append('id', profile.id)
        formData.append('first_name', profile.first_name)
        formData.append('last_name', profile.last_name)
        formData.append('dob', profile.dob)
        formData.append('about', profile.about)
        formData.append('gender', profile.gender)
        formData.append('image_path', profile.image_path)
        
        ApiClient.post('/api/employees/add-or-edit-profile/',formData)
        .then(response => {
            if(response.status === 200){
                toast.success("Profile Updated Successfully")
                history.push("/profile")
            }else{
                toast.error('Something went wrong try again')
            }
        });
    }

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
                    setProfile({
                        id:response.data.id, 
                        first_name:response.data.first_name, 
                        last_name:response.data.last_name, 
                        dob:response.data.profiles ? response.data.profiles.dob : '',
                        gender:response.data.profiles ? response.data.profiles.gender : '',
                        about:response.data.profiles ? response.data.profiles.about : '',
                        image_path: response.data.profiles ? response.data.profiles.image_path : ''
                    })    
                }else{
                    toast.error('Something went wrong try again')
                }
            });
        }
    }, [id]);

    const handleClick = () => {
        hiddenFileInput.current.click();
    };
    const handleChange = (event) => {
        setProfile({...profile, image_path: event.target.files[0]})
    };
    console.log("UserData=>\n", profile)
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
                                <Typography className='text-black'>Profile</Typography>
                            </Breadcrumbs>
                        </div>
                        <div className='col-md-6'>
                            <PowerOff className="svg-logout-style" onClick={logOut}/>
                            <span className='text-align-right profile-style'><strong>(Role: {userDataFetched.roleName})&nbsp;&nbsp;</strong></span> 
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <div className='card mt-3 text-center'>
                                <div className='card-body'>
                                    <style> {"\ .MuiAvatar-root{\ font-size:3.5rem!important; cursor: pointer;margin-top:5px;\ }\ "} </style>
                                    <input type="file" ref={hiddenFileInput} onChange={handleChange} style={{display: 'none'}} />
                                    <StyledProfileBadge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" onClick={handleClick}>
                                        <Avatar 
                                            alt={first_name + last_name} 
                                            src={`images/${image_path ? image_path : 'default-avatar.png'}`}  
                                            sx={{ width: 120, height: 120, border: '4px double #dfdfdf' }} 
                                        />
                                    </StyledProfileBadge>
                                    <h5 className='mt-3 mb-0'><strong>{first_name} {last_name}</strong></h5>
                                    <div className='text-muted mt-1'><RoleIcon className='svg-icon-lighblue' style={{marginTop: '-5px', fontSize: '20px'}}/> Role : {userDataFetched.roleName}</div>
                                </div>
                            </div>
                        </div>
                        <div className='col-md-9'>
                            <div className="card mt-3">
                                <div className="card-header">
                                    <strong>Edit Profile</strong>
                                </div>
                                <div className="card-body">
                                    <div className="form-group">
                                        <input type="text" className="form-control" label="First Name" name="first_name" value={first_name} onChange={e => onInputChange(e)} placeholder="Enter First Name" required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <input type="text" className="form-control" label="Last Name" name="last_name" value={last_name} onChange={e => onInputChange(e)} placeholder="Enter Last Name" required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <input type="email" disabled className="form-control" label="Email" name="email" value={userDataFetched.email} placeholder="Enter Email" required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <input type="date" className="form-control" label="DOB" name="dob" value={dob} onChange={e => onInputChange(e)} placeholder="Enter DOB" required/>
                                    </div>
                                    <div className="form-group mt-3">
                                        <select className="form-control" label="gender" name="gender" onChange={e => onInputChange(e)}>
                                            <option hidden> - Select Gender - </option>
                                            <option value="male" selected={gender === 'male' ? 'selected' : false}>Male</option>
                                            <option value="female" selected={gender === 'female' ? 'selected' : false}>Female</option>
                                            <option value="others" selected={gender === 'others' ? 'selected' : false}>Others</option>
                                        </select>
                                    </div>
                                    <div className="form-group mt-3">
                                        <textarea defaultValue={about} className='form-control' name='about' rows="3" placeholder="Write about yourself.." onChange={e => onInputChange(e)}></textarea>
                                    </div>
                                    <hr/>
                                    <button type="submit" className="btn btn-primary" onClick={sendProfileData}>Submit</button>  
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
