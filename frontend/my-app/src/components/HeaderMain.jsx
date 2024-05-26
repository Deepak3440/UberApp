import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';

const MyAppBar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: 'black' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Add the Uber logo here */}
          <img
            src="https://helios-i.mashable.com/imagery/articles/03y6VwlrZqnsuvnwR8CtGAL/hero-image.fill.size_1248x702.v1623372852.jpg"
            alt="Uber Logo"
            style={{ width: '6%' }}
          />
          
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MyAppBar;
