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

export default function MultiLineBarChart(props) {
  const [isResponsive, setIsResponsive] = React.useState(true);
  const theme = useTheme(); 
//   console.log(props.tasks_data);
  const Container = isResponsive ? ResponsiveChartContainer : ChartContainer;
  const sizingProps = isResponsive ? {} : { width: 500, height: 300 };
  return (
    // <Box sx={{ width: '100%' }}>

        <Container
          series={[
            {
              type: 'bar',
              data: props.tasks_data?.map((item)=>item.completed),
              label:"Completed Tasks",
              color: theme.palette.success.main
              
            },
            {
              type: 'bar',
              data: props.tasks_data?.map((item)=>item.urgent_completed),
              label:"Completed Urgent Tasks",
              color: theme.palette.warning.main
              
            },
            {
              type: 'line',
              data: props.tasks_data?.map((item)=>item.total),
                label:"Total Tasks",
                color: theme.palette.primary.main,
                area: true,
                showMark: false,
            },
            {
              type: 'line',
              data:  props.tasks_data?.map((item)=>item.urgent),
                label:"Urgent Tasks",
                color: theme.palette.error.main,
                area: true,
                showMark: false,
            },
          ]}
          xAxis={[
            {
              data: props.tasks_data?.map((item)=>item.time),
              scaleType: 'band',
              id: 'x-axis-id',
              categoryGapRatio: 0.7,
              barGapRatio: 0.1,
            },
          ]}
        //   {...sizingProps}
        >
          <BarPlot/>
          <LinePlot />
          <MarkPlot />
          <ChartsXAxis 
          label="Date" position="bottom" axisId="x-axis-id"
           />
          <ChartsYAxis  label="Amount of Tasks"/>
          <ChartsGrid horizontal />
          <ChartsTooltip />
          <ChartsAxisHighlight x='line'/>
          <ChartsLegend/>
        </Container>

    // </Box>
  );
}
