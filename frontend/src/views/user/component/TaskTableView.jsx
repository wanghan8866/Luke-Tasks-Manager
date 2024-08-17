import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import { Link } from 'react-router-dom';
const priority_map = {
    1:"High",
    2: "Normal",
    3: "Low"
  }
  
const columns = [
  { id: 'task_title', label: 'Task Title', 

    minWidth: 170 ,
    format: (value, id)=>(<Link to={`/user/dashboard/task/${id}`}>{value}</Link>)

},
  { id: 'user_email', label: 'User Email', minWidth: 100,

    format: (value, id)=>value
   },
  {
    id: 'due_by',
    label: 'Due By',
    minWidth: 170,
    align: 'right',
    format: (date, id) => formatDate(date),
  },
  {
    id: 'progress',
    label: 'Progress',
    minWidth: 170,
    align: 'right',
    format: (value, id) => {
      const numericValue = isNaN(value) ? 0 : parseFloat(value);
      return `${Math.round(numericValue * 100)}%`;
    },
  },
  {
    id: 'is_urgent',
    label: 'Is Urgent',
    minWidth: 170,
    align: 'right',
    format: (value, id) => value?"Urgent":"Not Urgent",
  },
  {
    id: 'priority',
    label: 'Priority',
    minWidth: 170,
    align: 'right',
    format: (value, id) => priority_map[value],
  },
  {
    id: 'number_of_todos',
    label: 'Number of ToDos',
    minWidth: 170,
    align: 'right',
    format: (value, id)=>value.toString()
    // format: (value) => value.toFixed(2),
  },
];

function createData(task) {
  const num_todos = task.todos.length;
//   // console.logtask.is_urgent?"hi":"no");
  return { 
    task_id: task.id,
    task_title:task.task_title, user_email: task.user_email,
    due_by:task.due_by, progress: task.progress,
     is_urgent: task.is_urgent,
    priority:task.priority,
    number_of_todos:num_todos};
}

//  [
//   createData('India', 'IN', 1324171354, 3287263),
//   createData('China', 'CN', 1403500365, 9596961),
//   createData('Italy', 'IT', 60483973, 301340),
//   createData('United States', 'US', 327167434, 9833520),
//   createData('Canada', 'CA', 37602103, 9984670),
//   createData('Australia', 'AU', 25475400, 7692024),
//   createData('Germany', 'DE', 83019200, 357578),
//   createData('Ireland', 'IE', 4857000, 70273),
//   createData('Mexico', 'MX', 126577691, 1972550),
//   createData('Japan', 'JP', 126317000, 377973),
//   createData('France', 'FR', 67022000, 640679),
//   createData('United Kingdom', 'GB', 67545757, 242495),
//   createData('Russia', 'RU', 146793744, 17098246),
//   createData('Nigeria', 'NG', 200962417, 923768),
//   createData('Brazil', 'BR', 210147125, 8515767),
// ];
const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };


  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }
  
  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

export default function TaskTableView(props) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('due_by');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const rows = props.tasks.map(task=>createData(task));
  // // console.log"row", rows);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const sortedRows = React.useMemo(() => {
    return rows.slice().sort((a, b) => {
      return getComparator(order, orderBy)(a, b);
    });
  }, [order, orderBy, rows]);

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={(event) => handleRequestSort(event, column.id)}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedRows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
       
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                        // if(column.id==="task_title"){

                        // }
                      const value = row[column.id];
                      return (
                        <TableCell key={`${column.id}_${index}`} align={column.align} 
                  to={`/user/dashboard/task/${row.task_id}`}>
                          {column.format(value, row.task_id)}
                          {/* {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value} */}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
