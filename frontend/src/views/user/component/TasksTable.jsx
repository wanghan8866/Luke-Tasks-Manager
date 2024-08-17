import { useState, useEffect } from "react";
import TaskDetailCard from "./TaskDetailCard";
import { Grid, Paper, Typography, Box } from '@mui/material';

export default function TasksTable(props){
    const [tasks, setTasks] = useState([]);
    const onUpdate = props.onUpdate;
    const onDelete = props.onDelete;

    useEffect(
        ()=>{
            setTasks(props.tasks);
        },
        [props.tasks]

    );

    // // console.log"table",props.tasks);
    
    return (
        <Box sx={{ padding: 2 }}>
               <Paper elevation={3} sx={{ padding: 2 }}>
               <Grid container spacing={2}>
          {tasks.map((task, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
                {/* <h1>{task.id}</h1> */}
                <TaskDetailCard task={task} onUpdate={onUpdate} onDelete={onDelete}/>
       
            </Grid>
          ))}
        </Grid>


               </Paper>

      </Box>
        


    );
};