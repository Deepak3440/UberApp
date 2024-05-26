import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Tabs, Tab, Typography, Box, IconButton, Menu, MenuItem } from '@mui/material';
import { AccountCircle, MoreVert as MoreVertIcon } from '@mui/icons-material'; 

const Header = ({ toCheckHistory, showHome, username, role, location = {} }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [tabAnchorEl, setTabAnchorEl] = useState(null);

  const  navigate=useNavigate()

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleTabMenuOpen = (event) => {
    setTabAnchorEl(event.currentTarget);
  };

  const handleTabMenuClose = () => {
    setTabAnchorEl(null);
  };
  const handleUberDashboardClick = () => {
    // Redirect to home page
    showHome();
  };

  const handleLogout = () => {
   
    navigate('/login')
    // history.push('/login');
  };




  useEffect(() => {
    // Add location.state to the dependency array
  }, [location.state]);

  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Add your company logo here */}
          <Typography variant="h6" onClick={handleUberDashboardClick} style={{ cursor: 'pointer' }}>
 <img
            src="https://helios-i.mashable.com/imagery/articles/03y6VwlrZqnsuvnwR8CtGAL/hero-image.fill.size_1248x702.v1623372852.jpg"
            alt="Uber Logo"
            style={{ width: '6%' }}
          />
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          {/* <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          > */}
            
          {/* </Menu> */}
          {/* Add user icon here */}
          <Typography variant="h6" sx={{ mr: 2 }}>
            {username}
          </Typography>
          {/* Add tabs here */}
          <IconButton color="inherit" onClick={handleTabMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={tabAnchorEl}
            open={Boolean(tabAnchorEl)}
            onClose={handleTabMenuClose}
          >
            {/* <MenuItem onClick={showHome}>Home</MenuItem> */}
            <MenuItem onClick={toCheckHistory}>History</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Header;
