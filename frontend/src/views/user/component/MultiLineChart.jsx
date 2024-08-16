import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { barElementClasses, BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts';
import { ChartsGrid } from '@mui/x-charts';
import { ChartsTooltip } from '@mui/x-charts';
import { ChartsAxisHighlight } from '@mui/x-charts';
import { ChartsLegend } from '@mui/x-charts';
import { useTheme } from '@emotion/react';
import { axisClasses } from '@mui/x-charts';
// import linearGradient
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import Title from './Title';
export default function MultiLineChart(props) {
  const [isResponsive, setIsResponsive] = React.useState(true);
  const theme = useTheme(); 
  console.log(props.tasks_data);
//   console.log(props.tasks_data);
//   console.log(props.tasks_data?.map((item)=>item.time));
  const Container = isResponsive ? ResponsiveChartContainer : ChartContainer;
  const sizingProps = isResponsive ? {} : { width: 500, height: 300 };
  return (
    <React.Fragment>
    <Title>Upcoming Tasks</Title>
    <div style={{ width: '100%', flexGrow: 1, overflow: 'hidden' }}>
      <LineChart
        dataset={props.tasks_data}
        margin={{
          top: 16,
          right: 20,
          left: 70,
          bottom: 30,
        }}
        xAxis={[
          {
            label: 'Date',
            scaleType: 'point',
            dataKey: 'time',
            tickNumber: 2,
            tickLabelStyle: theme.typography.body2,
          },
        ]}
        yAxis={[
          {
            label: 'Tasks',
            labelStyle: {
              ...theme.typography.body1,
              fill: theme.palette.text.primary,
            },
            tickLabelStyle: theme.typography.body2,
            min: 0,
            // max: maxTaskCount.amount+1,
            tickNumber: 3,
          },
        ]}
        series={[
          {
             id:"Total",
            dataKey: 'total',
            showMark: false,
            color: theme.palette.primary.light,
            label: "Total Tasks",
            area: true,
            showMark: ({ index }) => index % 2 === 0,
            highlightScope: {
                highlighted: 'item',
                // faded: '#Completed' 
              },
          },
          {
            id:"Completed",
            dataKey: 'completed',
            showMark: false,
            color: theme.palette.success.light,
            label: "Completed Tasks",
            area: true,
            showMark: ({ index }) => index % 2 === 0,
            highlightScope: {
                highlighted: 'item',
                faded: 'global' 
              },
          },
        ]}
        grid={{ vertical: false, horizontal: true }}
        sx={{
        //   [`.${axisClasses.root} line`]: { stroke: theme.palette.text.secondary },
        //   [`.${axisClasses.root} text`]: { fill: theme.palette.text.secondary },
          [`& .${axisClasses.left} .${axisClasses.label}`]: {
            transform: 'translateX(-25px)',
            [`& .${lineElementClasses.root}`]: {
                strokeDasharray: '10 5',
                strokeWidth: 4,
              },
              '& .MuiAreaElement-series-Total': {
                // fill: "url('#myGradient')",
                // fill:"red"
                bgcolor:"red"
              },
          },
        }}
        
      />
  <svg width="0" height="0">
    <defs>
      <linearGradient id="myGradient" gradientTransform="rotate(90)">
        <stop offset="5%" stopColor="gold" />
        <stop offset="95%" stopColor="red" />
      </linearGradient>
    </defs>
  </svg>

            </div>
  </React.Fragment>
);

    // </Box>

}
