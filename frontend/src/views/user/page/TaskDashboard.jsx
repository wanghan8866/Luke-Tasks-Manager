import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Grid } from '@mui/material';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import TaskCard from '../component/TaskCard';
import Chart from '../component/Chart';
import AirplayIcon from '@mui/icons-material/Airplay';
import DashboardWrapper from '../DashboardWrapper';
import useAxios from '../../../utils/useAxios';
import UserData from '../../plugin/UserData';
import CustomPieChart from '../component/CustomPieChart';
import TaskDetailCard from '../component/TaskDetailCard';
import { useNavigate, useParams } from 'react-router-dom';

function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
function createData(time, amount) {
    return { time, amount: amount ?? null };
  }
export default function TaskDashboard() {
  const [task, setTask] = useState({});
  const navigate = useNavigate();
  const user = UserData();

  const updateTask = (task_id, updated_task)=>{
    setTask(updated_task);
  }

  const deleteTask = (task_id, updated_task)=>{
    navigate("/");
  }

  const param = useParams();
  console.log("task: ", param.task_id);
  
  
  // console.log("hi");
  

    const fetchTasksData =  () => {
        try{
            useAxios()
            .get(`user/task-detail/${param.task_id}/`)
            .then((res) => {
            //   console.log(res.data);
              setTask(res.data);
            });
           
        }catch(error){
            // console.log(error);
            alert(error);
        }

    };


    // fetchTasksData();

    useEffect(() => {
      fetchTasksData();
    }, []);



  return (
<DashboardWrapper>

    <Box
            component="main"
            sx={{
                backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: '100vh',
                overflow: 'auto',
            }}
            >
            <Toolbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
              
             

                <Grid container spacing={3}>
                <Grid item xs={12}>
                 {task.todos && <TaskDetailCard task = {task} onUpdate={updateTask} onDelete={deleteTask}/>} 

                </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
            </Container>

           
            </Box>

            {/* {tasks?.map((t)=>{
              return (<h1>{t.task_title}</h1>)
            })} */}


</DashboardWrapper>
        




  );
}