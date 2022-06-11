// packages imported
import React from "react"
import {BrowserRouter, Switch, Route, Redirect} from "react-router-dom"
import { ToastContainer, toast } from 'react-toastify';
import ReactDOM from 'react-dom';

// components imported
import LoginPage from "../Login";
import SignUpPage from "../SignUp";
import DashboardPage from "../Dashboard";
import EmployeesPage from "../Employees";
import AddEmployees from "../Employees/AddEmployees";
import EditEmployees from "../Employees/EditEmployees";
import RolesPage from "../Roles";
import AddRoles from "../Roles/AddRoles";
import EditRoles from "../Roles/EditRoles";
import PermissionsPage from "../Permissions";
import AddPermissions from "../Permissions/AddPermissions";
import EditPermissions from "../Permissions/EditPermissions";
import LeaveTypesPage from "../LeaveTypes";
import AddLeaveTypes from "../LeaveTypes/AddLeaveTypes";
import EditLeaveTypes from "../LeaveTypes/EditLeaveTypes";
import ApplyLeaveApplication from "../LeaveApplication/ApplyLeaveApplication";
import LeaveApplication from "../LeaveApplication";
import ProfilePage from "../Profile";

const AdminProtectedRoute = ({component: Component, ...rest}) => {
    const userDataFetched = JSON.parse(localStorage.getItem('users'));
    return <Route {...rest} render={props=> localStorage.getItem('token') && userDataFetched.roleName[0]==='Admin' ? <Component {...props} /> : <Redirect to={"/"} />} />
}

const ProtectedRoute = ({component: Component, ...rest}) => {
    return <Route {...rest} render={props=> localStorage.getItem('token')?<Component {...props} /> : <Redirect to={"/login"} />} />
}
 
const PublicRoute = ({component: Component, ...rest}) => {
    return <Route {...rest} render={props=> !localStorage.getItem('token')?<Component {...props} /> : <Redirect to={"/login"} />} />
}

export default function App() {
return(
    <div className="h-100">
        <ToastContainer autoClose={3000}  />
        <BrowserRouter>
            <Switch>
                {/* Public-Routes accesible by everyone */}
                <PublicRoute exact path="/login" component={LoginPage} />
                <PublicRoute exact path="/sign-up" component={SignUpPage} />

                {/* Protected-Routes accessible by system users */}
                <ProtectedRoute exact path="/" component={DashboardPage} />
                    {/* Employees Management Routes */}
                    <AdminProtectedRoute exact path="/employees" component={EmployeesPage} />
                    <AdminProtectedRoute exact path="/employees/add-employees" component={AddEmployees} />
                    <AdminProtectedRoute exact path="/employees/edit-employees/:id" component={EditEmployees} />

                    {/* Roles Management Routes */}
                    <AdminProtectedRoute exact path="/roles" component={RolesPage} />
                    <AdminProtectedRoute exact path="/roles/add-roles" component={AddRoles} />
                    <AdminProtectedRoute exact path="/roles/edit-roles/:id" component={EditRoles} />

                    {/* Permissions Management Routes */}
                    <AdminProtectedRoute exact path="/permissions" component={PermissionsPage} />
                    <AdminProtectedRoute exact path="/permissions/add-permissions" component={AddPermissions} />
                    <AdminProtectedRoute exact path="/permissions/edit-permissions/:id" component={EditPermissions} />

                    {/* Permissions Management Routes */}
                    <AdminProtectedRoute exact path="/leave-types" component={LeaveTypesPage} />
                    <AdminProtectedRoute exact path="/leave-types/add-leave-types" component={AddLeaveTypes} />
                    <AdminProtectedRoute exact path="/leave-types/edit-leave-types/:id" component={EditLeaveTypes} />

                    {/* Profile Management Routes */}
                    <ProtectedRoute exact path="/profile" component={ProfilePage} />

                    <ProtectedRoute exact path="/apply-leave" component={ApplyLeaveApplication} />
                    <ProtectedRoute exact path="/leave-applications" component={LeaveApplication} />
            </Switch>
        </BrowserRouter>
    </div>
    )
}

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}