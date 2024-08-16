import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses, PieChart } from '@mui/x-charts';

import Title from './Title';

// Generate Sales Data
function createData(time, amount) {
  return { time, amount: amount ?? null };
}

const default_data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
]

const priority_map = {
  1:"High",
  2: "Normal",
  3: "Low"
}

export default function CustomPieChart(tasks_data) {

  var data = Object.entries(tasks_data.tasks_data).map(([key, value])=>{
    // console.log(key,value);
    return { id: key, value: value, label: priority_map[key] }
  })

  // var data = tasks_data.tasks_data;
  // console.log("Chart task data",tasks_data , tasks_data.tasks_data.length);
  if (data.length===0){

    data = default_data;
    return (<></>);
  }


  // console.log("Chart task data After",data);


  // console.log("Chart task data After",maxTaskCount.amount);

  const theme = useTheme();
  return (
    <React.Fragment>
      <Title>Today</Title>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', flexGrow: 1, overflow: 'hidden' }}>
        <PieChart
          margin={{ top: -10, bottom: 30, left: 20, right: 20 }}  
          series={[
            {
              data: data,
            },
          ]}
          width={270}
          height={270} // Make the chart a perfect square for better balance
          slotProps={{
            legend: {
              margin: 10,
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' }, // Center the legend horizontally
              padding: 10,
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}