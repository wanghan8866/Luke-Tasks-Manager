import React,{useState, useEffect} from 'react';
import {Box, TextField, Card, CardContent, Typography, LinearProgress, Button, IconButton, List, ListItem, ListItemText, ListItemIcon, Checkbox, Autocomplete } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import useAxios from '../../../utils/useAxios';
import UserData from '../../plugin/UserData';
import CheckIcon from '@mui/icons-material/Check';
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useNavigate } from 'react-router-dom';
const user = UserData();


const TaskDetailCard = (props) => {
    // const [toDos, setToDos] = useState([]);
    // const [task_title, setTaskTitle] = useState("");
    const [task_status, setTaskStatus] = useState("");
    const [task_progress, setTaskProgress] = useState(0);
    const [pseudo_task, setPseudoTask] = useState({});
    const [progressColor, setProgressColor] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [emails, setEmails] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const navigate = useNavigate();

    const task = props.task;
    const onUpdate = props.onUpdate;
    const onDelete = props.onDelete;
    
    // const task = props.task;

    const FindTaskStatusColor=(task_status_)=>{
        const [firstPart, ...rest] = task_status_.split(" ");

        const time_status = firstPart; // "Hello"
        const priority_status = rest.join(" ");
        var color;


        if (time_status === "Old") {
            color = "grey"; // Example: Gray color for old tasks
        } else if (time_status === "Upcoming") {
            if (priority_status === "Urgent Task") {
                color = "error"; // Red for upcoming urgent tasks
            } else if (priority_status === "High Priority Task") {
                color = "warning"; // Orange for upcoming high-priority tasks
            } else if (priority_status === "Normal Priority Task") {
                color = "primary"; // Blue for upcoming normal-priority tasks
            } else if (priority_status === "Low Priority Task") {
                color = "success"; // Green for upcoming low-priority tasks
            }
         }
         return color;

    }

    const UpdateToDo = (todo) =>{
        try{
            // user//120/

            const formdata = new FormData();
            formdata.append("title", todo.title);
            formdata.append("isFinished", todo.isFinished);
            formdata.append("task", todo.task);


            useAxios()
            .put(`user/todo-update/${todo.id}/`, formdata)
            .then((res) => {
            //   console.log("Update toDo",res.data);
                    useAxios()
                    .get(`user/todo-lists-task/${task.id}/`).then((res)=>{
                    // console.log("updated todos", res.data);
                    // setToDos(res.data);
                    onUpdate(task.id, {...task, todos: res.data});
                    // setNewTodo("");
                    });
              
            });
           
        }catch(error){
            // console.log(error);
            alert(error);
        }
    };

    const handleEditPost = ()=>{

        // console.log("Handle Edit!");
        setIsEditing(true);
        
        try{
            useAxios()
            .get(`user/emails-all/`)
            .then((res) => {
            //   console.log(res.data);

              setEmails(res.data.emails);
            //   setTask(res.data);
            });
           
        }catch(error){
            // console.log(error);
            alert(error);
        }

    };

    const handleUpdatePost = ()=>{

        // console.log("Handle Update!");
        setIsEditing(false);


        try{
            // user//120/

            const formdata = new FormData();
            formdata.append("user_email", pseudo_task.user_email);
            formdata.append("task_title", pseudo_task.task_title);
            formdata.append("task", pseudo_task.task);
            formdata.append("due_by", pseudo_task.due_by);
            formdata.append("is_urgent", pseudo_task.is_urgent);
            formdata.append("priority", pseudo_task.priority);


            useAxios()
            .put(`user/task-update-email/${task.id}/`, formdata)
            .then((res) => {
            //   console.log("Update task",res.data);
              onUpdate(pseudo_task.id, pseudo_task);

            //   console.log("Update", task, pseudo_task);
              
            });
           
        }catch(error){
            // console.log(error);
            alert(error);
        }

        
    }

    const handleCompleteAll = ()=>{
        // user/todo-all-completed/<task_id>/

        try{
            // user//120/

            const formdata = new FormData();
            formdata.append("title", task.task_title);

            useAxios()
            .post(`user/todo-all-completed/${task.id}/`, formdata)
            .then((res) => {
            //   console.log("Update toDo",res.data);

              useAxios()
              .get(`user/todo-lists-task/${task.id}/`).then((res)=>{
                // console.log("updated todos", res.data);
                // setToDos(res.data);
                onUpdate(task.id, {...task, todos: res.data});
                // setNewTodo("");
              });
              
            });
           
        }catch(error){
            // console.log(error);
            alert(error);
        }
    }
    const handleDeleteClick = ()=>{
        setIsDialogOpen(true);
        
    }
    const handleDialogClose  = ()=>{
        setIsDialogOpen(false);
        
    }
    const handleConfirmDelete = ()=>{
        // console.log(`Handle Delete ${task.id}!`);
        try{
            useAxios()
            .delete(`user/task-delete/${task.id}/`)
            .then((res) => {
            //   console.log("Delete toDo",res.data);
              alert(`Task <id:${task.id}> has been deleted!`);
              onDelete(task.id);
            //   navigate("/");
              
            });
        }
        catch(error){
            alert(error);
        }


        setIsDialogOpen(false);
        
    }


    const handleDeleteToDo = (todo_id)=>{
        // console.log("Handle Delete toDo!");
        try{
            useAxios()
            .delete(`user/todo-delete/${todo_id}/`)
            .then((res) => {
            //   console.log("Delete toDo",res.data);
              alert(`ToDo <id:${todo_id}> has been deleted!`);
    
              useAxios()
              .get(`user/todo-lists-task/${task.id}/`).then((res)=>{
                // console.log("updated todos", res.data);
                // setToDos(res.data);
                onUpdate(task.id, {...task, todos: res.data});
                // setNewTodo("");
              });
    
              
            });
        }
        catch(error){
            alert(error);
        }

        
    }

    const handleCreateToDo=()=>{
        // console.log(newTodo);
        // console.log(toDos);

        const formdata = new FormData();
        formdata.append("title", newTodo);
        formdata.append("isFinished", false);
        formdata.append("task", task.id);

        try{
            useAxios()
            .post(`user/todo-create/`, formdata)
            .then((res) => {
            //   console.log("Update toDo",res.data);
              useAxios()
              .get(`user/todo-lists-task/${task.id}/`).then((res)=>{
                // console.log("updated todos", res.data);
                // setToDos(res.data);
                setNewTodo("");
                onUpdate(task.id, {...task, todos: res.data});
              });
    
              
            });
        }
        catch(error){
            alert(error);
        }




        
        
    }

    const handleStatusUpdate = (status)=>{

        setTaskStatus(status);
        // console.log(status);
        
        const [firstPart, ...rest] = status.split(" ");

        // const time_status = firstPart;
        const priority_status = rest.join(" ");
        var priority = task.priority;

        if (priority_status === "High Priority Task") {
            priority = 1;
        } else if (priority_status === "Normal Priority Task") {
            priority = 2;
        } else if (priority_status === "Low Priority Task") {
            priority = 3;
        }

        setPseudoTask({...pseudo_task, is_urgent:priority_status==="Urgent Task", priority:priority});
        // setTask({...task, is_urgent:priority_status==="Urgent Task", priority:priority});

    }
    //
    // Completed, Not Started, In Progress, 
    // Old, Upcoming
    // Urgent, High Priority , Normal, Low
    const showTaskStatus = ()=>{
        // console.log(task);
        
        const taskDate = new Date(task.due_by);
        const today = new Date();
        var color = "";
        var progressColor = "";
        var progress_status = "";
        var time_status = "";
        var priority_status = "";
        var status = "";

        if(taskDate >= today){
            time_status = "Upcoming";
            setStatusOptions(["Upcoming Urgent Task", "Upcoming High Priority Task", "Upcoming Normal Priority Task", "Upcoming Low Priority Task"]);
        }else{
            time_status = "Old";
            setStatusOptions(["Old Urgent Task", "Old High Priority Task", "Old Normal Priority Task", "Old Low Priority Task"]);
        }

        if(task.is_urgent){
            priority_status = "Urgent";
        }
        else if(task.priority===1){
            priority_status = "High Priority";
        }
        else if(task.priority===2){
            priority_status = "Normal Priority";
        }
        else if(task.priority===3){
            priority_status = "Low Priority";
        }

            // Determine the color based on time_status and priority_status


         const progress = task.todos.filter(task => task.isFinished).length / task.todos.length * 100;
        setTaskProgress(progress)
        setTaskStatus(`${time_status} ${priority_status} Task`)

        

         // Determine progress bar color based on progress percentage
        if (progress === 100) {
            progressColor = "success"; // Task fully completed
            status = "Finished";
        } else if (progress >= 75) {
            progressColor = "primary"; // Mostly completed
            status = "In Progress";
        } else if (progress >= 50) {
            progressColor = "warning"; // Halfway there
            status = "In Progress";
        } else {
            progressColor = "error"; // Less than halfway done
            status = "In Progress";
        }
        if(progress === 0){
            status = "Not Started";
        }
         // Set the task color based on the status

        // Set the task progress color
        setProgressColor(progressColor); 
        onUpdate(task.id, {...task, status: status, progress: progress});

        

    };



    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${hours}:${minutes} ${day}/${month}/${year}`;
      };
      
    useEffect(()=>{
        setPseudoTask(task);
        // setToDos(props.task.todos);
        // onUpdate(task.id, {...task, todos: res.data});
        showTaskStatus();
    }, [])

    useEffect(showTaskStatus, [task.todos])

    useEffect(()=>{
        setPseudoTask(task);
        // setToDos(task.todos);
    }, [task]);

    // useEffect(
    //     ()=>{console.log("Card", task)},
    //     [task]

    // )




    // console.log("TaskDetailCard", task.todos);


  const subtasks = [
    { label: 'Keywords, Adwords, Trends', completed: false },
    { label: 'Video Research', completed: true },
    { label: 'Popular Blogs', completed: false },
    { label: 'Summarize Research', completed: true },
  ];

//   const progress = toDos.filter(task => task.isFinished).length / toDos.length * 100;
//   setTaskProgress(toDos.filter(task => task.isFinished).length / toDos.length * 100)
// const progress = task.progress*100;

return (
    <Card sx={{ 
      maxWidth: 345, 
      margin: '0 auto', 
      padding: 2, 
      borderRadius: 4, 
      border: '1px solid #e0e0e0', // Light border around the card
      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' // Subtle shadow for depth
    }}>
      <CardContent>
        <h2>{task.id}</h2>
        {isEditing

        ?(        <Select
            value={task_status}
            onChange={(e) => handleStatusUpdate(e.target.value)}
            sx={{
              bgcolor: theme => theme.palette[FindTaskStatusColor(task_status)]?.main || '#F8D775',
              padding: '5px 10px',
              borderRadius: '15px',
              textAlign: 'center',
              marginBottom: 2 
            }}
          >

        {statusOptions?.map((value, i)=>{
            return <MenuItem value={value} key={i}>{value}</MenuItem>
            
        }


)}

          </Select>)
          :

          <Typography variant="button" 
          sx={{ 
            display: 'block', 
            bgcolor: theme => theme.palette[FindTaskStatusColor(task_status)]?.main || '#F8D775', 
            padding: '5px 10px', 
            borderRadius: '15px', 
            textAlign: 'center', 
            marginBottom: 2 
          }}>
          {task_status && task_status.toUpperCase()}
        </Typography>

        }

        {isEditing?
        (    
        
            <TextField
              label="Task Title"
            variant="outlined"
            fullWidth
            value={pseudo_task.task_title}
            onChange={(e) => setPseudoTask({...pseudo_task, task_title:e.target.value})}
            // onBlur={handleTitleSave} // Save title on blur (clicking away)
            // onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} // Save title on Enter key
            sx={{ marginBottom: 2 }}
          />
        ):
        (  <Typography variant="h6" gutterBottom>
            {pseudo_task.task_title}
          </Typography>)
    
        }
        

        {isEditing?

                <TextField
                label="Task Description"
                multiline
                fullWidth
                rows={4} // Initial number of rows
                value={pseudo_task.task}
                onChange={(e) => setPseudoTask({...pseudo_task, task:e.target.value})}
                variant="outlined"
                sx={
                    {
                '& .MuiOutlinedInput-root': {
                    paddingRight: 0, // Adjust padding if necessary
                },
                '& .MuiOutlinedInput-inputMultiline': {
                    lineHeight: 1, // Adjust line height for readability
                },
                marginBottom: 2
              
                }

         
            
            }
                />

        :
        <Typography variant="body2" color="textSecondary" gutterBottom>
        {pseudo_task.task}
      </Typography>
        
        }
               {/* User email below task details */}

        {isEditing? 
        (

            <Autocomplete
            options={emails}
            label="User Email"
            variant="outlined"
            fullWidth
            value={pseudo_task.user_email}
            onChange={
                (e, value) => {
                    // console.log("e", e.target.value, value);
                    setPseudoTask( 
                {...pseudo_task, user_email:value})}}
            // onBlur={handleTitleSave} // Save title on blur (clicking away)
            // onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} // Save title on Enter key
            sx={{
                backgroundColor: user.email === pseudo_task.user_email ? '#f0f4c3' : '#ffcccb', // Light green for current user, light red for others
                padding: '4px 8px', // Add some padding around the text
                borderRadius: '4px', // Optional: Add rounded corners
                display: 'inline-block', // Keep the background confined to the text
                fontWeight: 500 // Optional: Make the text a bit bolder
            }}
            renderInput={
                (params) => {
                    // console.log(emails);
                    
                    return (
                    <TextField
                    value={pseudo_task.user_email}
                        label="Select Email"
                        {...params}
                    />)
                }
            }

     
          />
        )
        :
        (
        <Typography 
        variant="body2" 
        color="textSecondary" 
        gutterBottom
        sx={{
            backgroundColor: user.email === pseudo_task.user_email ? '#f0f4c3' : '#ffcccb', // Light green for current user, light red for others
            padding: '4px 8px', // Add some padding around the text
            borderRadius: '4px', // Optional: Add rounded corners
            display: 'inline-block', // Keep the background confined to the text
            fontWeight: 500 // Optional: Make the text a bit bolder
        }}
        >
        Assigned to: {pseudo_task.user_email}
        </Typography>)
        }

  
 

  
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginTop: 2,
          paddingY: 1, // Vertical padding only
          marginX: -2, // Negative margin to extend beyond card padding
          paddingX: 2, // Padding inside the box to match card padding
          borderTop: '2px solid #e0e0e0', // Thicker border between sections
          borderBottom: '2px solid #e0e0e0', // Thicker border between sections
        }}>
          <Typography variant="body2" color="textSecondary">
            TASK PROGRESS
          </Typography>

          {isEditing?
          <LocalizationProvider dateAdapter={AdapterDayjs}>
                   <DateTimePicker
          label="Due By"
        //   const taskDate = new Date(task.due_by);
          value = {dayjs(pseudo_task.due_by)}
          onChange={(e)=>{
            // console.log(e.toISOString());
            setPseudoTask({...pseudo_task, due_by:e.toISOString()})}}
        //   renderInput={(params) => <TextField {...params} fullWidth />}
          />
          
          </LocalizationProvider>
 
          :
          <Typography variant="body2">
          Due {formatDate(pseudo_task.due_by)}
        </Typography>
          }
 
        </Box>
  
        <LinearProgress 
          variant="determinate" 
          value={task_progress} 
          sx={{ 
            marginY: 1,  
            bgcolor: `${progressColor}.lighter`,
            '& .MuiLinearProgress-bar': {
              bgcolor: `${progressColor}.main`,
            },
          }} 
        />
  
        <Typography 
          variant="body2" 
          color="textSecondary" 
          gutterBottom
          sx={{ 
            paddingTop: 1, 
            paddingBottom: 1,
            borderBottom: '2px solid #e0e0e0' // Thicker border under the subtask heading
          }}>
          SUB-TASKS: {task.todos.length}
        </Typography>
        
        <List>
          {task.todos?.map((subtask, index) => (
            <ListItem 
              key={index} 
              disableGutters 
              sx={{
                border: '1px solid #e0e0e0', // Border around each subtask item
                borderRadius: 2, // Rounded corners for subtasks
                marginBottom: 1, // Space between items
                padding: '10px 8px', // Padding inside each subtask item
                bgcolor: "grey.50"
              }}>
              <ListItemIcon>
                <Checkbox 
                  edge="start" 
                  checked={subtask.isFinished} 
                  disableRipple 
                  icon={<CheckCircleIcon />} 
                  checkedIcon={<CheckCircleIcon />}
                  onChange={() => {
                    const updatedToDos = task.todos.map((task, i) =>
                      i === index ? { ...task, isFinished: !task.isFinished } : task
                    );
                    // setToDos(updatedToDos);
                    UpdateToDo(updatedToDos[index]);
                  }}
                />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <span style={{ textDecoration: subtask.isFinished ? 'line-through' : 'none' }}>
                    {subtask.title}
                  </span>
                } 
              />
            {isEditing&&
                <IconButton color="error" onClick={()=>handleDeleteToDo(subtask.id)}>
                        <DeleteIcon />
                      </IconButton>
            }

          
            </ListItem>
          ))}
        </List>

        {isEditing && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <TextField 
                  variant="outlined"
                  size="small"
                  placeholder="Add new todo"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  sx={{ flexGrow: 1, marginRight: 2 }}
                />
                <Button variant="contained" color="primary" onClick={handleCreateToDo} >
                  Add
                </Button>
              </Box>
        )

        }
  
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 2,
          borderTop: '1px solid #e0e0e0', // Border above the action buttons
          paddingTop: 2
        }}>
          <IconButton color="error" onClick={handleDeleteClick}>
            <DeleteIcon />
          </IconButton>

          {!isEditing ? 
          <IconButton color="primary" onClick={handleEditPost}>
            <EditIcon />
          </IconButton>:
          <IconButton color="success" onClick={handleUpdatePost}>
            <CheckIcon/>
          </IconButton>
          
          }

          <Button variant="contained" color="success" onClick={handleCompleteAll}>
            <CheckCircleIcon />
          </Button>
        </Box>


        <ConfirmDeleteDialog
            open = {isDialogOpen}
            onClose={handleDialogClose}
            onConfirm={handleConfirmDelete}
        />
      </CardContent>
    </Card>
  );
  
}

export default TaskDetailCard;
