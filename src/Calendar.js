import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Tooltip from '@mui/material/Tooltip';
import { display, styled } from '@mui/system';
import { Box } from '@mui/material';

const RefreshButton = ({props, color}) => {
  return(
    <svg
    className='fi-br-refresh'
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    id="Capa_1"
    x="0px"
    y="0px"
    viewBox="0 0 513.806 513.806"
    style={{
      enableBackground: "new 0 0 513.806 513.806",
    }}
    xmlSpace="preserve"
    width={25}
    height={25}
    {...props}
  >
    <g>
      <path stroke={'black'} fill={color} d="M66.074,228.731C81.577,123.379,179.549,50.542,284.901,66.045c35.944,5.289,69.662,20.626,97.27,44.244l-24.853,24.853   c-8.33,8.332-8.328,21.84,0.005,30.17c3.999,3.998,9.423,6.245,15.078,6.246h97.835c11.782,0,21.333-9.551,21.333-21.333V52.39   c-0.003-11.782-9.556-21.331-21.338-21.329c-5.655,0.001-11.079,2.248-15.078,6.246L427.418,65.04   C321.658-29.235,159.497-19.925,65.222,85.835c-33.399,37.467-55.073,83.909-62.337,133.573   c-2.864,17.607,9.087,34.202,26.693,37.066c1.586,0.258,3.188,0.397,4.795,0.417C50.481,256.717,64.002,244.706,66.074,228.731z" />
      <path stroke={'black'} fill={color} d="M479.429,256.891c-16.108,0.174-29.629,12.185-31.701,28.16C432.225,390.403,334.253,463.24,228.901,447.738   c-35.944-5.289-69.662-20.626-97.27-44.244l24.853-24.853c8.33-8.332,8.328-21.84-0.005-30.17   c-3.999-3.998-9.423-6.245-15.078-6.246H43.568c-11.782,0-21.333,9.551-21.333,21.333v97.835   c0.003,11.782,9.556,21.331,21.338,21.329c5.655-0.001,11.079-2.248,15.078-6.246l27.733-27.733   c105.735,94.285,267.884,85.004,362.17-20.732c33.417-37.475,55.101-83.933,62.363-133.615   c2.876-17.605-9.064-34.208-26.668-37.084C482.655,257.051,481.044,256.91,479.429,256.891z" />
    </g>
  </svg>
  )
}

const Calendar = ({ disabledDates, setSelectedDate, setCalendarLoaded, refreshCalendar, setRefreshCalendar, setAuthor, setPrompts, setCategory }) => {
  const [date, setDate] = useState(new Date().toLocaleDateString());

  const getSelectedDate = async (date) => {
    const res = await fetch(`http://localhost:5001/api/prompts/${date}`);
    const data = await res.json()
    if(data) {
      setAuthor(data.author)
      setPrompts(data.prompts)
      setCategory(data.date)
    } else{
      setAuthor('')
      setPrompts([])
      
    }

  };

  const handleDateSelect = (val) => {
    setSelectedDate(val);
    getSelectedDate(val.$d);
  };

  const getCustomTitle = (date) => {
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(date));

    if (disabledDates) {
      const match = disabledDates.find((disabledDate) =>
        dayjs(disabledDate.date, 'MM/DD/YYYY').isSame(formattedDate, 'day')
      );
      return match ? match.title : '';
    }
  };

  const StyledSpecialDay = styled('div')(({ theme }) => ({
    color: 'white',
    background: 'green',
    borderRadius: 30,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    cursor: 'pointer',
  }));

  useEffect(() => {
    setTimeout(() => {
      setCalendarLoaded(true);
    }, 2000);
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Tooltip title={'Refresh Calendar'}>
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <RefreshButton onClick={() => setRefreshCalendar((prev) => prev + 1)} color={'green'}/>
        </Box>
      </Tooltip>
      <DateCalendar
        key={refreshCalendar}
        views={['day']}
        referenceDate={dayjs(date)}
        onChange={(newValue) => handleDateSelect(newValue)}
        slotProps={{
          day: (dayProps) => {
            const isSpecialDate = disabledDates?.some((disabledDate) =>
              dayjs(disabledDate.date, 'MM/DD/YYYY').isSame(dayProps.day, 'day')
            );
            const title = getCustomTitle(dayProps.day);
            return {
              ...dayProps,
              children: isSpecialDate ? (
                
                  <StyledSpecialDay className="special-date">
                    {dayProps.day.format('D')}
                  </StyledSpecialDay>
                
              ) : (
                dayProps.children
              ),
            };
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default Calendar;
