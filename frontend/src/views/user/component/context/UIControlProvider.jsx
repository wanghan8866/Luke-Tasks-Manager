import React, {createContext, useState, useContext, useEffect} from "react";
const UIControlContext = createContext();

export const useUIControls = ()=>{
    return useContext(UIControlContext);

}

export const UIControlProvider = ({children})=>{
    const [upComingDays, setUpComingDays] = useState(30);
    const [isOnlyIncludeYou, setIsOnlyIncludeYou] = useState(true);
    const [isInlucdeAllTime, setIsInlucdeAllTime] = useState(false);
    const [orderBy, setOrderBy] = useState('due_by');
    const [order, setOrder] = useState('asc');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    

    return (
        <UIControlContext.Provider value = {{
            upComingDays, isOnlyIncludeYou, isInlucdeAllTime, orderBy, order,
            page, rowsPerPage, 
            setUpComingDays, setIsOnlyIncludeYou, setIsInlucdeAllTime,
            setOrderBy, setOrder,setPage,  setRowsPerPage}}>
            {children}
        </UIControlContext.Provider>
    )
}