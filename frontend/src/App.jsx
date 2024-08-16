import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';
import MainWrapper from './layouts/MainWrapper.jsx';
import PrivateRoute from './layouts/PrivateRoute';
import Register from "../src/views/auth/Register";
import Login from "../src/views/auth/Login";
import Logout from './views/auth/Logout.jsx';
import ForgotPassword from './views/auth/ForgotPassword.jsx';
import CreateNewPassword from './views/auth/CreateNewPassword.jsx';
import PublicOnly from './layouts/PublicOnlyRoute.jsx';
import UserDashboard from "./views/user/page/UserDashboard.jsx";
import TaskDashboard from './views/user/page/TaskDashboard.jsx';
import './App.css'
import TaskCreateDashboard from './views/user/page/TaskCreateDashboard.jsx';


function App() {
  return (
    <BrowserRouter>
    <MainWrapper>
      <Routes>

        {/* Authentication */}
        <Route path="/register/" element = {<PublicOnly children={<Register/>}/> }/>
        <Route path="/login/" element = {<PublicOnly children={<Login/>}/> }/>
        <Route path="/logout/" element = {<PrivateRoute children={<Logout/>}/>}/>
        <Route path="/forgot-password/" element = {<PublicOnly children={ <ForgotPassword/>}/>}/>
        <Route path="/create-new-password/" element = {<PublicOnly children={<CreateNewPassword/>}/> }/> 

        {/* Dashboard */}
        <Route path="/" element={<Navigate to="/user/dashboard/"/>}/>
        <Route path="/user/dashboard/" element = {<PrivateRoute children={<UserDashboard/>}/>}/>
        <Route path="/user/dashboard/task/:task_id/" element = {<PrivateRoute children={<TaskDashboard/>}/>}/>
        <Route path="/user/dashboard/task-create/" element = {<PrivateRoute children={<TaskCreateDashboard/>}/>}/>


      </Routes>
    </MainWrapper>
    
    </BrowserRouter>
  )
}

export default App
