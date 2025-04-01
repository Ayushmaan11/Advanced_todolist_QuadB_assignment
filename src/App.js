// App.js
import {React}from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {Provider, useSelector, useDispatch, } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './app/store';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import Login from './components/Auth/Login';
import PrivateRoute from './components/Auth/PrivateRoute';
import { Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { logout } from './features/auth/authSlice';

const App = () => {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Advanced Todo App
              </Typography>
              <AuthButton />
            </Toolbar>
          </AppBar>
          <Container maxWidth="md" sx={{ mt: 4 }}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route element={<PrivateRoute />}>
                <Route path="/" element={
                  <>
                    <TaskInput />
                    <TaskList />
                  </>
                } />
              </Route>
            </Routes>
          </Container>
        </Router>
      </PersistGate>
    </Provider>
  );
};

const AuthButton = () => {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return isAuthenticated ? (
    <Button color="inherit" onClick={handleLogout}>
      Logout
    </Button>
  ) : (
    <Button color="inherit" onClick={() => navigate('/login')}>
      Login
    </Button>
  );
};



export default App;
