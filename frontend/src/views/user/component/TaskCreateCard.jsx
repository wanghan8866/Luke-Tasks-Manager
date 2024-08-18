import React,{useState, useEffect} from 'react';
import {Box, TextField, Card, CardContent, Typography, LinearProgress, Button, IconButton, List, ListItem, ListItemText, ListItemIcon, Checkbox, Autocomplete } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import useAxios from '../../../utils/useAxios';
import UserData from '../../plugin/UserData';
import CheckIcon from '@mui/icons-material/Check';
import {LocalizationProvider, DateTimePicker} from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';
import { useNavigate } from 'react-router-dom';
import { useTasks } from './context/TaskProvider';
const user = UserData();


const TaskCreateCard = () => {
    const {setTasks, appendTaskToTasks, updateTaskFromTasks} = useTasks();
    const [toDos, setToDos] = useState([]);
    // const [task_title, setTaskTitle] = useState("");
    const [task_status, setTaskStatus] = useState("");
    const [task_progress, setTaskProgress] = useState(0);
    const [task, setTask] = useState({
      user_email: user.email,
      task_title: "",
      task: "",
      due_by: null,
      priority: 3,
      is_urgent: false

    });
    const [progressColor, setProgressColor] = useState("");
    const [isEditing, setIsEditing] = useState(true);
    const [emails, setEmails] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [statusOptions, setStatusOptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
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


    const handleEditPost = ()=>{

        // console.log"Handle Edit!");
        setIsEditing(true);
        
        try{
            axios
            .get(`user/emails-all/`)
            .then((res) => {
            //   // console.logres.data);

              setEmails(res.data.emails);
            //   setTask(res.data);
            });
           
        }catch(error){
            // // console.logerror);
            alert(error);
        }

    };

    const handleUpdatePost = async ()=>{

        // console.log"Handle Update!");
        // setIsEditing(false);
        setIsLoading(true);

        try{
            // user//120/

            const formdata = new FormData();
            formdata.append("user_email", task.user_email);
            formdata.append("task_title", task.task_title);
            formdata.append("task", task.task);
            formdata.append("due_by", task.due_by);
            formdata.append("is_urgent", task.is_urgent);
            formdata.append("priority", task.priority);

            
            const response_ = await axios.post("user/task-create-email/", formdata)
       
            // console.log"Create task",response_.data);
            // setTask(response_.data);
            
            appendTaskToTasks(response_.data.id, response_.data);

            const new_todos =  await toDos.map((todo)=>{

                const formToDO = new FormData();
                formToDO.append("title", todo.title);
                formToDO.append("isFinished", todo.isFinished);
                formToDO.append("task", response_.data.id);
        
                try{
                    axios
                    .post(`user/todo-create/`, formToDO)
                    .then((res_todo) => {
             
                      // console.log(res_todo.data)
                      return res_todo.data;
                                           
                    });
                }
                catch(error){
           
                  setIsLoading(false);
                    alert(error);
                }
              }

       


              
              )
                
              // updateTaskFromTasks(response_.data.id, {...response_.data, todos:new_todos})
              
              
              await useAxios()
              .get(`user/task-all/`)
              .then((res) => {
                // console.log("create task", res.data);
                setTasks(res.data);
      
                
               
              })
              setIsLoading(false);
              // // console.log"Navigate!");
              navigate(`/user/dashboard/task/${response_.data.id}/`);
  
           
        }catch(error){
            // console.log(error);
            setIsLoading(false);
            
            var allMessages = []
            for(let key in error.response.data){
              if( error.response.data.hasOwnProperty(key)){
                allMessages = allMessages.concat(error.response.data[key])
              }
            }
            alert(allMessages);
        }

        
    }


    const handleDeleteToDo = (todo)=>{
        // console.log"Handle Delete toDo!");
        try{
          setToDos(prevTodos => prevTodos.filter(todo_x => todo_x.title !== todo.title));
        }
        catch(error){
            alert(error);
        }

        
    }

    const handleCreateToDo=()=>{
        // console.lognewTodo);
        // console.logtoDos);

        const formdata = {
          title: newTodo,
        isFinished: false
        };
        if(newTodo===""){
          alert("ToDo can not be empty!")
          return;
        }
        var condition = true;
        toDos.forEach((todo)=>{
          condition &= !(newTodo===todo.title)
        })
        
        
        if(condition){
          setToDos(prevTodos => [...prevTodos, formdata]);
        }
        else{
          alert("Can not have ToDo with the same Name!")
        }
        
        setNewTodo("");

        // try{
        //     axios
        //     .post(`user/todo-create/`, formdata)
        //     .then((res) => {
        //     //   // console.log"Update toDo",res.data);
        //       axios
        //       .get(`user/todo-lists-task/${task.id}/`).then((res)=>{
        //         // // console.log"updated todos", res.data);
        //         setToDos(res.data);
        //         setNewTodo("");
        //       });
    
              
        //     });
        // }
        // catch(error){
        //     alert(error);
        // }




        
        
    }

    const handleStatusUpdate = (status)=>{

        setTaskStatus(status);
        // console.logstatus);
        
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
        setTask({...task, is_urgent:priority_status==="Urgent Task", priority:priority});

    }
    //
    // Completed, Not Started, In Progress, 
    // Old, Upcoming
    // Urgent, High Priority , Normal, Low
    const showTaskStatus = ()=>{
        // // console.logtask);
        
        const taskDate = new Date(task.due_by);
        const today = new Date();
        var color = "";
        var progressColor = "";
        var progress_status = "";
        var time_status = "";
        var priority_status = "";

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


         const progress = toDos.filter(task => task.isFinished).length / toDos.length * 100;
        setTaskProgress(progress)
        setTaskStatus(`${time_status} ${priority_status} Task`)

        

         // Determine progress bar color based on progress percentage
        if (progress === 100) {
            progressColor = "success"; // Task fully completed
        } else if (progress >= 75) {
            progressColor = "primary"; // Mostly completed
        } else if (progress >= 50) {
            progressColor = "warning"; // Halfway there
        } else {
            progressColor = "error"; // Less than halfway done
        }

         // Set the task color based on the status

        // Set the task progress color
        setProgressColor(progressColor); 
        

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
      handleEditPost();
    }, [])

    useEffect(showTaskStatus, [toDos, task])




    // // console.log"TaskDetailCard", task.todos);


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
        {isEditing

        ?(        <Select 
          required
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
            value={task.task_title}
            onChange={(e) => setTask({...task, task_title:e.target.value})}
            // onBlur={handleTitleSave} // Save title on blur (clicking away)
            // onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} // Save title on Enter key
            sx={{ marginBottom: 2 }}
          />
        ):
        (  <Typography variant="h6" gutterBottom>
            {task.task_title}
          </Typography>)
    
        }
        

        {isEditing?

                <TextField
                label="Task Description"
                multiline
                fullWidth
                rows={4} // Initial number of rows
                value={task.task}
                onChange={(e) => setTask({...task, task:e.target.value})}
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
        {task.task}
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
            value={task.user_email}
            onChange={
                (e, value) => {
                    // // console.log"e", e.target.value, value);
                    setTask(
                {...task, user_email:value})}}
            // onBlur={handleTitleSave} // Save title on blur (clicking away)
            // onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()} // Save title on Enter key
            sx={{
                backgroundColor: user.email === task.user_email ? '#f0f4c3' : '#ffcccb', // Light green for current user, light red for others
                padding: '4px 8px', // Add some padding around the text
                borderRadius: '4px', // Optional: Add rounded corners
                display: 'inline-block', // Keep the background confined to the text
                fontWeight: 500 // Optional: Make the text a bit bolder
            }}
            renderInput={
                (params) => {
                    // // console.logemails);
                    
                    return (
                    <TextField
                    value={task.user_email}
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
            backgroundColor: user.email === task.user_email ? '#f0f4c3' : '#ffcccb', // Light green for current user, light red for others
            padding: '4px 8px', // Add some padding around the text
            borderRadius: '4px', // Optional: Add rounded corners
            display: 'inline-block', // Keep the background confined to the text
            fontWeight: 500 // Optional: Make the text a bit bolder
        }}
        >
        Assigned to: {task.user_email}
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
          value = {dayjs(task.due_by)}
          onChange={(e)=>{
            // // console.loge.toISOString());
            setTask({...task, due_by:e.toISOString()})}}
        //   renderInput={(params) => <TextField {...params} fullWidth />}
          />
          
          </LocalizationProvider>
 
          :
          <Typography variant="body2">
          Due {formatDate(task.due_by)}
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
          SUB-TASKS: {toDos.length}
        </Typography>
        
        <List>
          {toDos?.map((subtask, index) => (
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
                    const updatedToDos = toDos.map((task, i) =>
                      i === index ? { ...task, isFinished: !task.isFinished } : task
                    );
                    setToDos(updatedToDos);
                    // UpdateToDo(updatedToDos[index]);
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
                <IconButton color="error" onClick={()=>handleDeleteToDo(subtask)}>
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

        <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100%', // Ensures the Box takes full width of its parent
              }}
            >
              <IconButton 
                color="success" 
                onClick={handleUpdatePost}
                sx={{ 
                  width: '64px', // Increase button size
                  height: '64px', // Increase button size
                }}
              >
                
                {isLoading && <>Processing <i className="fas fa-spinner fa-spin"></i>
                </>}
                {!isLoading && <CheckIcon sx={{ fontSize: 40 }} />}
              </IconButton>
            </Box>
      
        </Box>



      </CardContent>
    </Card>
  );
  
}

export default TaskCreateCard;
