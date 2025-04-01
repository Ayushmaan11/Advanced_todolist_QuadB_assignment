import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTaskWeather } from '../features/todo/todoSlice';

const useWeather = (city) => {
  const dispatch = useDispatch();
  const weatherData = useSelector(state => 
    city ? state.todo.weatherData?.[city] : null
  );
  const weatherStatus = useSelector(state =>
    city ? state.todo.weatherStatus?.[city] : 'idle'
  );
  const error = useSelector(state =>
    city ? state.todo.weatherErrors?.[city] : null
  );

  useEffect(() => {
    if (city && !weatherData && weatherStatus === 'idle') {
      dispatch(fetchTaskWeather(city));
    }
  }, [city, dispatch, weatherData, weatherStatus]);

  return {
    data: weatherData,
    isLoading: weatherStatus === 'loading',
    error,
    refresh: () => city && dispatch(fetchTaskWeather(city))
  };
};

export default useWeather;