import React, { useCallback, useMemo } from 'react';
import useWeather from '../hooks/useWeather';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { deleteTask, updatePriority } from '../features/todo/todoSlice';
import { 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Chip, 
  Typography, 
  Box,
  Avatar,
  ListItemAvatar,
  CircularProgress,
  Tooltip,
  Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';


const TaskItem = ({ task, onDelete, onPriorityChange }) => {
  const { data: weather, isLoading, error, refresh } = useWeather(task.city);

  const getPriorityIcon = useMemo(() => (priority) => {
    switch (priority) {
      case 'High': return <PriorityHighIcon color="error" />;
      case 'Low': return <LowPriorityIcon color="success" />;
      default: return <PriorityHighIcon color="warning" />;
    }
  }, []);

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(task.id)}
        >
          <DeleteIcon />
        </IconButton>
      }
      sx={{
        mb: 1,
        bgcolor: 'background.paper',
        borderRadius: 1,
        borderLeft: '4px solid',
        borderColor: task.priority === 'High' ? 'error.main' : 
                    task.priority === 'Medium' ? 'warning.main' : 'success.main'
      }}
    >
      <ListItemAvatar>
        {isLoading ? (
          <Avatar>
            <CircularProgress size={24} />
          </Avatar>
        ) : error ? (
          <Tooltip title={error.message}>
            <Avatar sx={{ bgcolor: 'error.light' }}>
              <ErrorIcon />
            </Avatar>
          </Tooltip>
        ) : weather ? (
          <Tooltip title={`Humidity: ${weather.main.humidity}%`}>
            <Avatar 
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
          </Tooltip>
        ) : null}
      </ListItemAvatar>
      <ListItemText
        primary={task.text}
        secondary={
          <>
            {task.city && `Location: ${task.city}`}
            {error ? (
              <Alert 
                severity="error" 
                sx={{ mt: 1, py: 0 }}
                action={
                  <IconButton size="small" onClick={refresh}>
                    <RefreshIcon fontSize="inherit" />
                  </IconButton>
                }
              >
                {error.message}
              </Alert>
            ) : weather ? (
              <Typography component="span" variant="body2" display="block">
                {weather.weather[0].description}, 
                Temp: {weather.main.temp}°C
                {weather.main.temp_min !== weather.main.temp_max && (
                  ` (${weather.main.temp_min}°-${weather.main.temp_max}°)`
                )}
              </Typography>
            ) : task.city ? (
              <Typography variant="caption" color="text.secondary">
                Weather data not available
              </Typography>
            ) : null}
          </>
        }
      />
      <Chip
        icon={getPriorityIcon(task.priority)}
        label={task.priority}
        sx={{ mr: 2 }}
        onClick={() => onPriorityChange(task)}
      />
    </ListItem>
  );
};

const TaskList = () => {
  const tasks = useSelector(state => state.todo.tasks, shallowEqual);
  const dispatch = useDispatch();

  const handleDelete = useCallback((taskId) => {
    dispatch(deleteTask(taskId));
  }, [dispatch]);

  const handlePriorityChange = useCallback((task) => {
    const newPriority = 
      task.priority === 'High' ? 'Medium' : 
      task.priority === 'Medium' ? 'Low' : 'High';
    dispatch(updatePriority({ id: task.id, priority: newPriority }));
  }, [dispatch]);

  return (
    <Box>
      <List>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onPriorityChange={handlePriorityChange}
          />
        ))}
      </List>
    </Box>
  );
};

export default React.memo(TaskList);