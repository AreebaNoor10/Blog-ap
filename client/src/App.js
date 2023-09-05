import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAuthentication } from './Authentication/useAuthentication';
import Sidebar from './Components/Sidebar';
import Register from './Registration/Register'
import Login from './Registration/Login'
import Dashboard from './Components/Dashboard';
import Editor from './Components/Editor';
import Draft from './Components/Draft';
import FullBlogPage from './Pages/FullBlogPages';
import Published from './Components/Published';
import AllBlogs from './Registration/AllBlogs';
import ShowFullBlogs from './Registration/ShowFullBlog';
const App = () => {
  const location = useLocation();
  const isAuthenticated = useAuthentication();

  const shouldShowSidebar = () => {
    const { pathname } = location;
    return !['/login', '/register','/','/show'].includes(pathname) && isAuthenticated;
  };

  return (
    <>
      {shouldShowSidebar() && <Sidebar />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AllBlogs />} />
             <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/draft" element={<Draft />} />
            <Route path="/show/:id" element={<FullBlogPage />} />
            <Route path="/publish" element={<Published/>} />
            <Route path="/show" element={<ShowFullBlogs />} />
      </Routes>
    </>
  );
};

export default App;
