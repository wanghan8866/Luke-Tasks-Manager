import * as React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
// import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
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
import { alpha } from '@mui/material/styles';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { ResponsiveChartContainer } from '@mui/x-charts';
// import linearGradient
import { LineChart, lineElementClasses } from '@mui/x-charts/LineChart';
import Title from '../Title';
import { useUIControls } from '../context/UIControlProvider';

const Colorswitch = () => {
  const { top, height, bottom } = useDrawingArea();
  const svgHeight = top + bottom + height;
  const theme = useTheme(); 

  return (
    <svg width="100" height="100">
          <defs>
              <linearGradient id="paint0_linear_45_2" x1="300.25" y1="46.9999" x2="300.25" y2={`${svgHeight}px`} gradientUnits="userSpaceOnUse">
                  <stop stopColor={theme.palette.primary.main} stopOpacity="1" />
                  <stop offset="0.5" stopColor={theme.palette.primary.main} stopOpacity="0.1" />
              </linearGradient>
          </defs>

          <defs>
              <linearGradient id="paint0_linear_45_3" x1="299.498" y1="-4.28272" x2="299.498" y2={`${svgHeight}px`} gradientUnits="userSpaceOnUse">
                  <stop stopColor={theme.palette.success.main} stopOpacity="1" />
                  <stop offset="0.7" stopColor={theme.palette.success.main} stopOpacity="1" />
                  <stop offset="0.8" stopColor={theme.palette.success.main} stopOpacity="0.2" />
              </linearGradient>
          </defs>
          </svg>
  )
}


export default function MultiLineChart(props) {
  const [isResponsive, setIsResponsive] = React.useState(true);
  const {upComingDays, isInlucdeAllTime} = useUIControls();
  const theme = useTheme(); 
  // // console.logprops.tasks_data);
//   // console.logprops.tasks_data);
//   // console.logprops.tasks_data?.map((item)=>item.time));
  // const Container = isResponsive ? ResponsiveChartContainer : ChartContainer;
  const sizingProps = isResponsive ? {} : { width: 500, height: 300 };
  return (
    <React.Fragment>
    <Title>Upcoming Tasks {(isInlucdeAllTime)?"for All Time":`for the Next ${upComingDays} ${upComingDays===1?"Day":"Days"}`}</Title>
    <div style={{ width: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, overflow: 'hidden' }}>


      <LineChart
        // width={500}
        // height={300}
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
            color: alpha(theme.palette.primary.light, 1),
            
            label: "Total Tasks",
            area: true,
            showMark: ({ index }) => props.tasks_data[index].total!=0,
            highlightScope: {
                highlighted: 'item',
                // faded: 'global' 
              },
          },
          {
            id:"Completed",
            dataKey: 'completed',
            color:  alpha(theme.palette.success.light, 1),
            label: "Completed Tasks",
            area: true,
            showMark: ({ index }) => props.tasks_data[index].completed!=0,
            highlightScope: {
                highlighted: 'item',
                faded: 'global' 
              },
          },
        ]}
        grid={{ vertical: false, horizontal: true }}
      //   sx={{
      //     '.css-11xqiom-MuiAreaElement-root': {
      //         fill: 'url(#paint0_linear_45_2)',
      //     },
      //     '.css-4rc6ww-MuiAreaElement-root': {
      //         fill: 'url(#paint0_linear_45_3)',
      //     },

      // }}
        
        
      >
             <Colorswitch />
        </LineChart>

        </div>
           
  </React.Fragment>
);

    // </Box>

}
