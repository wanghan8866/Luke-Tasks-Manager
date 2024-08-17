import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Slider } from '@mui/material';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';
import TaskCard from '../component/TaskCard';
import Chart from '../component/chart/Chart';
import AirplayIcon from '@mui/icons-material/Airplay';
import DashboardWrapper from '../DashboardWrapper';
import useAxios from '../../../utils/useAxios';
import UserData from '../../plugin/UserData';
import CustomPieChart from '../component/chart/CustomPieChart';
import TaskDetailCard from '../component/TaskDetailCard';
import TasksTable from '../component/TasksTable';
// import MultiLineBarChart from '../component/MultiLineBarChart';
import MultiLineChart from '../component/chart/MultiLineChart';
import { useTasks } from '../component/context/TaskProvider';
import TaskTableView from '../component/TaskTableView';


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
export default function Dashboard() {
  // const [tasks, setTasks] = useState([]);
  const {tasks, updateTaskFromTasks} = useTasks();
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [upComingDays, setUpComingDays] = useState(30);
  const [isOnlyIncludeYou, setIsOnlyIncludeYou] = useState(true);
  const [isInlucdeAllTime, setIsInlucdeAllTime] = useState(false);
  const [numberOfTaskInDays, setNumberOfTaskInDays] = useState([]);
  const [numberOfTaskByPriority, setNumberOfTaskByPriority] = useState([]);
  const [upcomingUrgentTasks, setUpcomingUrgentTasks] = useState({completed:0, total: 0});
  const [upcomingTasks, setUpcomingTasks] = useState({completed:0, total: 0});
  const [allTasks, setAllTasks] = useState({completed:0, total: 0});
  const user = UserData();
  
  // // console.log"hi");

  // const updateTaskFromTasks=(task_id, updatedTask)=>{
  //   // // console.log"User", updatedTask);
  //   setTasks((prevTasks)=>
  //     prevTasks.map((task)=>
  //       task.id===task_id?{...task, ...updatedTask}:task)
  //   )
  // };

  // const deleteTaskFromTasks = (task_id) =>{
  //   setTasks((prevTasks)=>prevTasks.filter((task)=>task.id!==task_id))
  // };


  

    // const fetchTasksData =  () => {
    //   useAxios()
    //   .get(`user/task-all/`)
    //   .then((res) => {
    //     // // console.logres.data);
    //     // // console.logUserData());
    //     // // console.logres.data);
    //     setTasks(res.data);
        
    //     // setNumberOfTaskInDays(res.data);

    //     // // console.log"user",numberOfTaskInDays);
    //     // // console.log"user",tasks);
        
        

       
    //   });
    // }


    // // fetchTasksData();

    // useEffect(() => {
    //   fetchTasksData();
    // }, []);

    useEffect(() => {
    // This will show the updated tasks after setTasks is called

      // 0: Count total tasks
      const totalTaskCounter = {completed:0, total:0};
      tasks.forEach(task => {
        if(!isOnlyIncludeYou || user.user_id === task.user){
          if(task.status === "Finished"){
            // // console.log"all",task.status);
            
            totalTaskCounter.completed +=1;
          }
          totalTaskCounter.total +=1;
        }

      });

      // // console.logtask);
      
      
      // 1: Get today's date and the date next coming days from today
      var today = new Date();
      var in30Days = new Date(today);
      in30Days.setDate(in30Days.getDate() + upComingDays);
      


      // 2: Filter the list to only include tasks within the next coming days
      // only if not isInlucdeAllTime
      // filter the list to inlcude tasks for the current user
      // only if isOnlyIncludeYou
      
      const tasksWithin30Days = tasks.filter(task => {
        const taskDate = new Date(task.due_by);
        
        if(isInlucdeAllTime){
          if(taskDate<today){
            today = taskDate;
            // // console.log"filter", taskDate.toISOString());
          }
          if(in30Days< taskDate){
            in30Days= taskDate;
            // // console.log"filter", taskDate.toISOString());
          }
        }

        return (isInlucdeAllTime || (taskDate >= today && taskDate <= in30Days)) && (!isOnlyIncludeYou || user.user_id === task.user) ;
      });

      setSelectedTasks(tasksWithin30Days);

      // // console.logtasksWithin30Days);

      
      // 3: count ammount of tasks in each day
      const taskCounts = {};
      const taskCountsByPriority = {};
      const urgentTaskCounter = {completed:0, total:0};
      const upComingTaskCounter = {completed:0, total:0};
      

      today.setHours(0, 0, 0, 0);
      in30Days.setHours(0, 0, 0, 0);

      for (let d = today; d <= in30Days; d.setDate(d.getDate() + 1)) {
        const formattedDate = new Date(d).toISOString().split('T')[0];
        // // console.log"set", formattedDate, d);
        

        taskCounts[formattedDate] = {total: 0, urgent: 0, urgent_completed:0, completed: 0}; // Initialize with a value of 0 or any other default value
      }

      tasksWithin30Days.forEach(task => {
        const dueDate = new Date(task.due_by).toISOString().split('T')[0];

        // // console.logdueDate, taskCounts[dueDate]);
          if(!taskCounts[dueDate]){
            taskCounts[dueDate] = {total: 0, urgent: 0, urgent_completed:0, completed: 0}; 
          }
          
          taskCounts[dueDate].total+=1;
          if(task.is_urgent){
            taskCounts[dueDate].urgent+=1;
          }
          if(task.status==="Finished"){
            taskCounts[dueDate].completed+=1;
            if(task.is_urgent){
              taskCounts[dueDate].urgent_completed+=1;
            }
          }
        
          
          
        
    

        

        if(taskCountsByPriority[task.priority]){
          taskCountsByPriority[task.priority]++;
        }else{
          taskCountsByPriority[task.priority]=1;
        }

        if(task.status === "Finished"){

          upComingTaskCounter.completed +=1;
          if(task.is_urgent){
            // // console.log"Urgent",task.status);
            urgentTaskCounter.completed +=1;
          }else{
            // // console.log"UpComing",task.status);
          }
        }

        if(task.is_urgent){
          urgentTaskCounter.total +=1
        }
        upComingTaskCounter.total +=1;

        // // console.logtask.priority, task.is_urgent, task.status);
      });



      // 4: Reformat the counts into what line chart accept 
      function createData(time, amount) {
        return { time,  ...amount ?? null };
      }
      const t =Object.entries(taskCounts).map(([date, count])=>{
        return createData(date, count);
      })


      // 5: Sort the days by date in ascending order 
      t.sort((a, b) =>
        { 
          // // console.loga);
          return new Date(a.time) - new Date(b.time)});

      // 6: Save the data
      setNumberOfTaskInDays(t);
      setNumberOfTaskByPriority(taskCountsByPriority);
      setUpcomingUrgentTasks(urgentTaskCounter);
      setUpcomingTasks(upComingTaskCounter);
      setAllTasks(totalTaskCounter);

      // // console.logtaskCountsByPriority, urgentTaskCounter, upComingTaskCounter, totalTaskCounter);
      



    
    }, [tasks, isInlucdeAllTime, isOnlyIncludeYou, upComingDays]);


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

              
            <Grid item xs={12}>
            <FormGroup 
      row 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'flex-start' // or 'center' if you want to center horizontally too
      }}
    >
      <FormControlLabel
        control={<Checkbox checked={isOnlyIncludeYou} onClick={() => setIsOnlyIncludeYou(!isOnlyIncludeYou)} />}
        label="Only Show Your Tasks"
      />
      <FormControlLabel
        control={<Checkbox checked={isInlucdeAllTime} onClick={() => setIsInlucdeAllTime(!isInlucdeAllTime)} />}
        label="Include All Time"
      />
      

      {!isInlucdeAllTime && (
        <Box sx={{ width: 300, display: 'flex', alignItems: 'center' }}>
          <Slider
            aria-label="Custom marks"
            defaultValue={upComingDays}
            getAriaValueText={(value) => `${value} Days`}
            min={1}
            max={100}
            step={1}
            value={upComingDays}
            onChange={(e, new_value) => setUpComingDays(new_value)}
            valueLabelDisplay="auto"
            // marks={[
            //   { value: 1, label: '1' },
            //   { value: 100, label: '100' },
            // ]}
          />
        </Box>
      )}
    </FormGroup>
       
            </Grid>
              
             

                <Grid container spacing={3}>
                  
                    <Grid item xs={12} sm={6} md={4}>
                          <TaskCard
                            title="Upcoming Urgent Tasks"
                            total={upcomingUrgentTasks}
                            color="warning"
                            icon={<AirplayIcon/>}
                            // progress = {15/32*100}
                          />
                        </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                          <TaskCard
                            title="Upcoming Tasks"
                            total={upcomingTasks}
                            color="success"
                            icon={<AirplayIcon/>}
                            // progress = {20/100*100}
                          />
                        </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                          <TaskCard
                            title="Total Tasks"
                            total={allTasks}
                            color="primary"
                            icon={<AirplayIcon/>}
                            // progress = {16/32*100}
                          />
                        </Grid>
                    {/* <Grid item xs={12} sm={6} md={3}>
                          <TaskCard
                            title="Urgent Tasks"
                            total={100}
                            color="success"
                            icon={<AirplayIcon/>}
                          />
                        </Grid> */}


                {/* Line Chart */}
                <Grid item xs={12} md={9} lg={9}>
                    <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 500,
                    }}
                    >

                {/* {numberOfTaskInDays && <Chart tasks_data={numberOfTaskInDays}/>} */}
                {numberOfTaskInDays[0] && <MultiLineChart tasks_data={numberOfTaskInDays}/>}

                    </Paper>

                    {/* Pie Chart */}
                </Grid>
    
                <Grid item xs={12} md={3} lg={3}>
                    <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 400,
                    }}
                    >
                       {numberOfTaskByPriority && <CustomPieChart tasks_data={numberOfTaskByPriority}/>}
                    
                    </Paper>
                </Grid>

             {/* Table View */}
                <Grid item xs={12}>
                  {selectedTasks[0] && < TaskTableView tasks={selectedTasks}/>}

        
                  
                  {/* {selectedTasks && <TasksTable tasks={selectedTasks} onUpdate={updateTaskFromTasks} onDelete={deleteTaskFromTasks}/>} */}
          

                </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
            </Container>

           
            </Box>

            {/* {tasks?.map((t)=>{du
              return (<h1>{t.task_title}</h1>)
            })} */}


</DashboardWrapper>
        




  );
}