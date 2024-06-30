import * as React from 'react';
import Box from '@mui/material/Box';
import axios from "axios";
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import MovieDataGrid from './MovieDataGrid';
import UserDataGrid from './UserDataGrid';
import MovieScheduler from './MovieScheduler';
import EthanMovieScheduler from './EthanMovieScheduler';
import PromotionDataGrid from './PromotionDataGrid';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function Admin() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        '& .actions': {
          color: 'text.secondary',
        },
        '& .textPrimary': {
          color: 'text.primary',
        },
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Users" {...a11yProps(0)} />
            <Tab label="Movies" {...a11yProps(1)} />
            <Tab label="Promotions" {...a11yProps(2)} />
            <Tab label="MovieScheduler" {...a11yProps(3)} />
            </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <UserDataGrid/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <MovieDataGrid />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <PromotionDataGrid/>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={3}>
        <MovieScheduler/>
      </CustomTabPanel>
    </Box>
  );
}

export default Admin;