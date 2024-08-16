import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

export default function TaskCard({ title, total, progress = 70, color = 'primary', sx, ...other }) {
    // console.log(total.completed/total.total);
    
  return (
    <Card
      component={Stack}
      spacing={3}
      direction="row"
      sx={{
        px: 3,
        py: 2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        ...sx,
      }}
      {...other}
    >
      <Stack spacing={0.5} sx={{ flexGrow: 1 }}>
        <Typography variant="h4">{`${total.completed}/${total.total}`}</Typography>
        <Typography variant="subtitle1" sx={{ color: 'text.disabled' }}>
          {title}
        </Typography>
        
        <LinearProgress
          variant="determinate"
          value={(total.total)?total.completed/total.total*100: 0}
          sx={{
            height: 10,
            borderRadius: 5,
            bgcolor: `${color}.lighter`,
            '& .MuiLinearProgress-bar': {
              bgcolor: `${color}.main`,
            },
          }}
        />
      </Stack>
    </Card>
  );
}

TaskCard.propTypes = {
  title: PropTypes.string.isRequired,
  total: PropTypes.object.isRequired,
  progress: PropTypes.number,
  color: PropTypes.string,
  sx: PropTypes.object,
};
