import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchWeather } from './todoAPI';

export const fetchTaskWeather = createAsyncThunk(
  'todo/fetchWeather',
  async (city, { rejectWithValue }) => {
    try {
      const response = await fetchWeather(city);
      return { city, data: response.data }; 
    } catch (err) {
      if (err.response?.status === 401) {
        return rejectWithValue({
          city,
          message: 'Invalid API key - please check your configuration',
          code: 401
        });
      }
      return rejectWithValue({
        city,
        message: err.response?.data?.message || 'Failed to fetch weather',
        code: err.response?.status
      });
    }
  }
);

const todoSlice = createSlice({
  name: 'todo',
  initialState: {
    tasks: JSON.parse(localStorage.getItem('tasks')) || [],
    weatherData: {},
    weatherStatus: {},
    weatherErrors: {}
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = action.payload;
      state.tasks.push(newTask);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
      
      
      if (newTask.city && !(newTask.city in state.weatherData)) {
        state.weatherData[newTask.city] = null;
        state.weatherStatus[newTask.city] = 'idle';
      }
      
      
      if (newTask.city && state.weatherErrors[newTask.city]) {
        delete state.weatherErrors[newTask.city];
      }
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updatePriority: (state, action) => {
      const { id, priority } = action.payload;
      const task = state.tasks.find(task => task.id === id);
      if (task) {
        task.priority = priority;
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    clearWeatherError: (state, action) => {
      const { city } = action.payload;
      if (city && state.weatherErrors[city]) {
        delete state.weatherErrors[city];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTaskWeather.pending, (state, action) => {
        const city = action.meta.arg;
        state.weatherStatus[city] = 'loading';
      })
      .addCase(fetchTaskWeather.fulfilled, (state, action) => {
        const { city, data } = action.payload;
        state.weatherStatus[city] = 'succeeded';
        state.weatherData[city] = data;
        delete state.weatherErrors[city];
      })
      .addCase(fetchTaskWeather.rejected, (state, action) => {
        const { city, message, code } = action.payload;
        state.weatherStatus[city] = 'failed';
        state.weatherErrors[city] = { message, code };
      });
  }
});

export const { 
  addTask, 
  deleteTask, 
  updatePriority,
  clearWeatherError 
} = todoSlice.actions;

export default todoSlice.reducer;