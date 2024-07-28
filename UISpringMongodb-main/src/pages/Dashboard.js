import * as React from 'react';
import { Box, Tab, Typography } from '@mui/material';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Button } from "@mui/material"
import { Link } from "react-router-dom"
import Create from './Create';
import './Dashboard.css'

export default function Home() {
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="home-container">
      <Typography variant='h3' className="title">EMPLOYER DASHBOARD</Typography>
      <Button variant="outlined" className="home-button"><Link to="/" className="link">Home</Link></Button>
      
      <TabContext value={value}>
        <Box className="tab-container">
          <TabList onChange={handleChange} aria-label="dashboard tabs">
            <Tab label="Create Post" value="1" className="tab" />
            {/* Add more tabs as needed */}
          </TabList>
        </Box>

        <TabPanel value="1" className="tab-panel"><Create /></TabPanel>
        {/* Add more TabPanels for each tab */}
      </TabContext>
    </div>
  );
}
