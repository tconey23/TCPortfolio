import { Alert, Button, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import Tooltip from '@mui/material/Tooltip';
import React, { useEffect, useState, Suspense  } from 'react'
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import { database } from './firebase';
import Calendar from './Calendar';
import ProgressBar from './ProgressBar';
import { ref, set, get, child } from 'firebase/database';
import Draggable from 'react-draggable';

const ThingsPrompts = ({user}) => {

    const [disabledDates, setDisabledDates] = useState(null)
    const [prompts, setPrompts] = useState([])
    const [category, setCategory] = useState()
    const [promptText, setPromptText] = useState()
    const [uploadType, setUploadType] = useState('Upload CSV')
    const [categories, setCategories] = useState()
    const [loading, setLoading] = useState()
    const [changesMade, setChangesMade] = useState({ 
        cat: false, 
        prompts: false,
        date: false,
        author: false
    })
    const [success, setSuccess] = useState(false)
    const [date, setDate] = useState()
    const [calendarLoaded, setCalendarLoaded] = useState(false)
    const [refreshCalendar, setRefreshCalendar] = useState(0)
    const [author, setAuthor] = useState(null)
    const [isEditing, setIsEditing] = useState()
    const [editValue, setEditValue] = useState('')

    useEffect(() => {
        console.log(user)
    }, [database, user])

    const handleSubmit = async () => {
        try {
          // Format the date to 'November 01, 2024'
          const formattedDate = new Intl.DateTimeFormat('en-US', {
            month: 'long',
            day: '2-digit',
            year: 'numeric',
          }).format(new Date(category));

          const numericDate = new Intl.DateTimeFormat('en-US', {
            month: '2-digit',
            day: '2-digit',
            year: 'numeric',
          }).format(new Date(category));
      
          const fullCategoryPath = `categories/${formattedDate}`; // E.g., 'categories/November 01, 2024'
      
          // Prepare the data with prompts and author
          const newCategoryData = {
            prompts: [...prompts], // Array of prompts
            author: user, // Add the author's name or ID
            date: numericDate
          };

          console.log(newCategoryData)
      
          // Create a reference to the formatted path
          const categoryRef = ref(database, fullCategoryPath);
      
          // Write the data to the specific path
          await set(categoryRef, newCategoryData);
      
          // Update the local state
          setCategories((prevCategories) => [
            ...prevCategories,
            {
              id: formattedDate,
              author: user, // Store author in the local state
              prompts: [...prompts],
            },
          ]);
      
          // Reset form state
          setSuccess(true);
          setCategory('');
          setPrompts([]);
          setChangesMade({
            cat: false,
            prompts: false,
            date: false,
          });
          setRefreshCalendar(prev => prev +1)
        } catch (error) {
          console.error('Error adding category:', error);
        }
      };  

      useEffect(() => {
        if(success){
            setTimeout(() => {
                setSuccess(false)
            }, 2000);
        }
      }, [success])

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const text = e.target.result;
            Papa.parse(text, {
              header: false,
              complete: (result) => {
                result.data.forEach((d) => {
                    setPrompts(prev => ([
                        ...prev, 
                        ...d
                    ]))
                })
              },
              error: (error) => {
                console.error('Error parsing CSV:', error);
              },
            });
          };
          reader.readAsText(file);
        }
      };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
      });

    const addPrompt = (text) => {
        setPrompts(prev => ([
            ...prev,
            text
        ]))

        setPromptText('')
    }

    const handleRemove = (prompt) => {
        setPrompts(prompts.filter((p) => p !== prompt))
    }

    useEffect(() =>{
        if(prompts.length > 0){
            setChangesMade(prev => ({
                ...prev,
                prompts: true
            }))
        }

        if(category){
            setChangesMade(prev => ({
                ...prev,
                cat: true
            }))

        }

        if(date){
            setChangesMade(prev => ({
                ...prev,
                date: true
            }))
        }

    }, [prompts, category, date])

    useEffect(() => {
        const fetchData = async () => {
          try {
            const categoriesRef = ref(database, 'categories'); // Get a reference to 'categories'
            const snapshot = await get(categoriesRef); // Get the data at the reference
      
            if (snapshot.exists()) {
              const data = snapshot.val();
      
              // Transform object to array
              const categoriesArray = Object.entries(data).map(([key, value]) => ({
                id: key, // Firebase key
                ...value, // Spread the properties of the value
              }));
      
              setCategories(categoriesArray);
             categoriesArray.forEach((c) =>{
                // console.log(Object.keys(c)[1])
              })
      
              // Map disabledDates
              setDisabledDates(
                categoriesArray.map((category) => ({
                  date: category.date,
                  title: Object.keys(category)[1] || 'No title',
                }))
              );
            } else {
              console.log('No data available');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          } finally {
            setLoading(false);
          }
        };
      
        fetchData();
      }, [refreshCalendar]);

      useEffect(() =>{
        if(date) {
            const formattedDate = new Intl.DateTimeFormat('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
            }).format(new Date(date));
            // console.log(formattedDate)
            setCategory(formattedDate)
        }
      }, [date])

    const handleUpdate = (i, newText) => {
      setPrompts((prevArray) => 
        prevArray.map((item, id) => (id === i ? newText : item))
      );
      setIsEditing(null)
    }

    const handleEditing = (i) => {
      setIsEditing(i)
      setEditValue(prompts[i])
    }


      useEffect(() => {
        if(user){
          setAuthor(user)
        }
      }, [user])
      
      useEffect(() => {
        console.log(prompts)
      }, [prompts])
      

  return (
    <Stack direction={'row'} width={'90vw'} height={'80vh'} justifyContent={'center'} alignItems={'flex-start'} padding={10}>
        <Stack justifyContent={'flex-start'} alignItems={'center'} sx={{background: 'white', padding: 5, overflowY: 'scroll', overflowX: 'hidden'}} width={300} height={'65%'}>
            {success && <Alert sx={{position: 'absolute', top: 100}}>Category added!</Alert>}
            <Stack color={'black'}>
                    {!calendarLoaded && <ProgressBar />}
                    <Calendar setAuthor={setAuthor} setPrompts={setPrompts} setCategory={setCategory} setCalendarLoaded={setCalendarLoaded} setSelectedDate={setDate} disabledDates={disabledDates} refreshCalendar={refreshCalendar} setRefreshCalendar={setRefreshCalendar} />
                <Select onChange={(e) => setUploadType(e.target.value)} value={uploadType} label={uploadType}>
                    <MenuItem value={'Enter Single Prompts'}>Enter Single Prompts</MenuItem>
                    <MenuItem value={'Upload CSV'}>Upload CSV</MenuItem>
                </Select>
            </Stack>
            {uploadType === 'Enter Single Prompts' ?
            <>
                <TextField spellCheck={true} value={promptText} onChange={(e) => setPromptText(e.target.value)} sx={{color: 'white', padding: 2}} placeholder='Prompt'/>
                <Stack width={200}>
                    <Button onClick={()=>addPrompt(promptText)} variant='contained'>
                        ADD
                    </Button>
                </Stack>
            </>
            :
            <Stack>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    sx={{margin: '10px'}}
                >
                    <i style={{marginRight: '10px'}} className="fi fi-sr-folder-upload"></i>
                    Select File 
                    <VisuallyHiddenInput
                        type="file"
                        accept='csv'
                        onChange={handleFileChange}
                    />
                </Button>
            </Stack>
            }
                <Stack padding={2}>
                    {changesMade.cat && <Alert onClick={(e) => console.log(e)} severity={category ? 'success' : 'error'}  action={category ? 'Category entered' : 'Category Required'}></Alert>}
                    {changesMade.prompts && <Alert severity={prompts.length > 20 ? 'success' : 'error'} action={`${prompts.length}/21 prompts added`}></Alert>}
                </Stack>
            <Stack>
            </Stack>
        </Stack>
        <Stack className='list-stack' sx={{height: '80%', marginLeft: 10, paddingBottom: 5, paddingRight: 5, boxShadow: 'inset 1px 1px 1px 1px black', width: '50vw'}} key={prompts}>
          <Typography variant="h4" component="h4">
              {category && category}
          </Typography>
           {prompts.length > 0 && 
           <List sx={{height: '80%', overflowY: 'scroll', width: '40vw', padding: 5}}> 
              {prompts.map((p, i) => (
               
                  <Stack direction={'row'}>
                        {isEditing === i ? 
                        <Stack width={'100%'}>
                          <TextField onChange={(e) => setEditValue(e.target.value)} value={editValue}></TextField>
                          <Button sx={{color: 'green', border: '1px white solid'}} onClick={(e) => handleUpdate(i, editValue)}><i class="fi fi-sr-check-circle"></i></Button>
                        </Stack>
                        :
                        <ListItem color={'white'}>{p}</ListItem>}
                        {!isEditing && <Button sx={{color: 'orange', border: '1px white solid'}} onClick={() => handleEditing(i)}><i class="fi fi-sr-pencil"></i></Button>}
                        <Button sx={{color: 'red', border: '1px white solid'}} onClick={() => handleRemove(p)}><i class="fi fi-tr-trash-xmark"></i></Button>
                    </Stack>
              
              ))}
          </List>} 
            <Stack justifyContent={'center'} alignItems={'center'} width={'100%'}>
              <Button onClick={()=>handleSubmit()} disabled={!category || !prompts.length > 0} variant='contained'>
                  SUBMIT
              </Button>
            </Stack>
        </Stack>
    </Stack>
  )
}

export default ThingsPrompts
