import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import { Button } from '@mui/material';

const Calendar = ({ disabledDates, setSelectedDate, setCalendarLoaded }) => {
  const [date, setDate] = useState(new Date().toLocaleDateString());

  // Function to check if a date should be disabled
  const shouldDisableDate = (date) => {
    return disabledDates.some(disabledDate =>
      dayjs(disabledDate.date, 'MM/DD/YYYY').isSame(date, 'day')
    );
  };

  // Function to get the title for a disabled date
  const getDisabledTitle = (date) => {
    const match = disabledDates.find(disabledDate =>
      dayjs(disabledDate.date, 'MM/DD/YYYY').isSame(date, 'day')
    );
    return match ? match.title : '';
  };

  const StyledDisabledDay = styled('div')(({ theme }) => ({
    color: 'white',
    background: 'green',
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  }));

  useEffect(() => {
    setTimeout(() => {
      setCalendarLoaded(true)
    }, 2000);
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
{disabledDates.length > 0 && <DateCalendar
        shouldDisableDate={shouldDisableDate}
        views={['day']}
        referenceDate={dayjs(date)}
        onChange={(newValue) => setSelectedDate(newValue)}
        slotProps={{
          day: (dayProps) => {
            const isDisabled = shouldDisableDate(dayProps.day);
            const title = getDisabledTitle(dayProps.day);
            return {
              ...dayProps,
              children: isDisabled ? (
                  <Button sx={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                    <Tooltip title={title}>
                      <StyledDisabledDay className='disabled-date'>{dayProps.day.format('D')}</StyledDisabledDay>
                    </Tooltip>
                  </Button>
                
              ) : (
                dayProps.children
              ),
            };
          },
        }}
      />}
    </LocalizationProvider>
  );
};

export default Calendar;
