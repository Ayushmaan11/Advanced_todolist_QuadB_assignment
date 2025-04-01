import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTask } from '../features/todo/todoSlice';
import { fetchTaskWeather } from '../features/todo/todoSlice';
import { TextField, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TaskInput = () => {
  const [task, setTask] = useState('');
  const [city, setCity] = useState('');
  const [priority, setPriority] = useState('Medium');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    
    const newTask = {
      id: Date.now(),
      text: task,
      priority,
      city
    };
    
    dispatch(addTask(newTask));
    if (city) dispatch(fetchTaskWeather(city));
    setTask('');
    setCity('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
      <TextField
        label="New Task"
        variant="outlined"
        fullWidth
        value={task}
        onChange={(e) => setTask(e.target.value)}
        sx={{ mb: 2 }}
      />
      <TextField
        label="City (optional for weather)"
        variant="outlined"
        fullWidth
        value={city}
        onChange={(e) => setCity(e.target.value)}
        sx={{ mb: 2 }}
      />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Priority</InputLabel>
        <Select
          value={priority}
          label="Priority"
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Medium">Medium</MenuItem>
          <MenuItem value="Low">Low</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" fullWidth>
        Add Task
      </Button>
    </Box>
  );
};

export default TaskInput;