import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import { Button } from '@mui/material';

const Calendar = ({ disabledDates, setSelectedDate, setCalendarLoaded, refreshCalendar, setRefreshCalendar}) => {
  const [date, setDate] = useState(new Date().toLocaleDateString());
  

  // Function to check if a date should be disabled
  const shouldDisableDate = (date) => {
    if(disabledDates){
      return disabledDates.some(disabledDate =>
        dayjs(disabledDate.date, 'MM/DD/YYYY').isSame(date, 'day')
      );
    }
  };

  // Function to get the title for a disabled date
  const getDisabledTitle = (date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(date))

    if(disabledDates){
      console.log(disabledDates)
      const match = disabledDates.find(disabledDate => {
        console.log(disabledDate.date, formattedDate)  
        dayjs(disabledDate.date, 'MM/DD/YYYY').isSame(formattedDate, 'day')
        
      }
      
    );
    return match ? match.title : '';
  }
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
    if(disabledDates){
      const findDate = disabledDates.find((d) => d.date === '11/02/2024')
    }
  }, [disabledDates])

  useEffect(() => {
    setTimeout(() => {
      setCalendarLoaded(true)
    }, 2000);
  }, [])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <i onClick={() => setRefreshCalendar(prev => prev +1)} className="fi fi-br-refresh"></i>
{disabledDates && <DateCalendar
        key={refreshCalendar}
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
                    <Tooltip title={title}>
                      <StyledDisabledDay className='disabled-date'>{dayProps.day.format('D')}</StyledDisabledDay>
                    </Tooltip>
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
