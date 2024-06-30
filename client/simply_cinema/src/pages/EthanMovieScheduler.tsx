import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DemoContainer, DemoItem } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box'
import toArray from 'dayjs/plugin/toArray';
import Grid from '@mui/material/Grid';

dayjs.extend(toArray)

//TESTING STUFF DELETE THIS FILE 

function EthanMovieScheduler() {
  const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));

  return (
    <Box>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar value={value} onChange={(newValue) => {
          setValue(newValue);
          if (newValue) {
            console.log(dayjs(newValue).toArray());
          }
        }} />
      </LocalizationProvider>
      
    </Box>
  );
}

export default EthanMovieScheduler;
