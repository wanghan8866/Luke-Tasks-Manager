import React, {createContext, useState, useContext, useEffect} from "react";
import useAxios from "../../../../utils/useAxios";
import { useAuthStore } from "../../../../store/auth";
import UserData from "../../../plugin/UserData";
const TasksContext = createContext();

export const useTasks = ()=>{
    return useContext(TasksContext);
}

export const TaskProvider = ({children})=>{
    const [tasks, setTasks] = useState([]);

    
    const updateTaskFromTasks=(task_id, updatedTask)=>{
        console.log("updating task", updatedTask);
        setTasks((prevTasks)=>
        prevTasks.map((task)=>
            task.id===task_id?{...task, ...updatedTask}:task)
        )
    };

    const deleteTaskFromTasks = (task_id) =>{
        console.log("deleting task", task_id);
        setTasks((prevTasks)=>prevTasks.filter((task)=>task.id!==task_id))
    };
    
    const appendTaskToTasks = (task_id, newTask) => {
        console.log("appending task", newTask);
        setTasks(prevTasks => [...prevTasks, newTask]);
    };

    
    const fetchTasksData =  () => {
        // // console.log"context", UserData()?.email );
        if(UserData()?.email){
            useAxios()
            .get(`user/task-all/`)
            .then((res) => {
              setTasks(res.data);
    
              
             
            });
        }
        // // console.log"Hi fetchTasksData for context!");


      }
  
  
      // fetchTasksData();
  
      useEffect(() => {
        fetchTasksData();
      }, []);

    //   useEffect(() => {
    //     // console.logtasks);
    //   }, [tasks]);


    return (
        <TasksContext.Provider value = {
            {tasks, updateTaskFromTasks, deleteTaskFromTasks, setTasks, appendTaskToTasks}}>

            {children}
        </TasksContext.Provider>
    )
}