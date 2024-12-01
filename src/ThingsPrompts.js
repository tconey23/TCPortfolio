import { Alert, Button, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState, Suspense  } from 'react'
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import { database } from './firebase';
import Calendar from './Calendar';
import ProgressBar from './ProgressBar';
import { ref, set, get, child } from 'firebase/database';

const ThingsPrompts = ({user}) => {

    const [disabledDates, setDisabledDates] = useState({date: '12/01/2024', title: 'title'})
    const [prompts, setPrompts] = useState([])
    const [category, setCategory] = useState()
    const [promptText, setPromptText] = useState()
    const [uploadType, setUploadType] = useState('Upload CSV')
    const [categories, setCategories] = useState()
    const [csvData, setCsvData] = useState([])
    const [loading, setLoading] = useState()
    const [changesMade, setChangesMade] = useState({
        cat: false, 
        prompts: false,
        date: false
    })
    const [success, setSuccess] = useState(false)
    const [date, setDate] = useState()
    const [calendarLoaded, setCalendarLoaded] = useState(false)

    useEffect(() => {
        console.log(database[0])
    }, [database])

const handleSubmit = async () => {

  const newCategory = {
    [category]: [...prompts],
    date: `${date.$M + 1}/${date.$D}/${date.$y}`, // Ensure date is formatted correctly
  };

  try {
    const categoriesRef = ref(database, 'categories'); // Get a reference to 'categories'

    // Fetch existing categories to determine the next key
    const snapshot = await get(categoriesRef);
    let nextKey = 0;

    if (snapshot.exists()) {
      const existingCategories = snapshot.val();
      const keys = Object.keys(existingCategories).map((key) => parseInt(key)); // Parse keys as integers
      nextKey = Math.max(...keys) + 1; // Determine the next key
      console.log(nextKey);
    }

    // Add new category to the database
    const newCategoryRef = child(categoriesRef, nextKey.toString());
    await set(newCategoryRef, newCategory);
    console.log('Category added successfully');

    // Update local state
    setCategories((prevCategories) => [
      ...prevCategories,
      {
        id: nextKey.toString(),
        ...newCategory,
      },
    ]);

    setSuccess(true);
    setCategory('');
    setPrompts([]);
    setChangesMade({
      cat: false,
      prompts: false,
      date: false,
    });
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
              header: false, // Set to true if your CSV has headers
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
      }, []);


      useEffect(() => {
        console.log(calendarLoaded)
      }, [calendarLoaded])
      

  return (
    <Stack direction={'row'} width={'90vw'} height={500} justifyContent={'center'} alignItems={'flex-start'} padding={10}>
        <Stack justifyContent={'center'} alignItems={'center'} sx={{background: 'white', padding: 10}} width={300}>
            {success && <Alert sx={{position: 'absolute', top: 100}}>Category added!</Alert>}
            <Stack color={'black'}>
                    {!calendarLoaded && <ProgressBar />}
                    <Calendar setSelectedDate={setDate} disabledDates={disabledDates} setCalendarLoaded={setCalendarLoaded}/>
                    {date && <Typography>{`${date.$M+1}/${date.$D}/${date.$y}`}</Typography>}
                <Select onChange={(e) => setUploadType(e.target.value)} value={uploadType} label={uploadType}>
                    <MenuItem value={'Enter Single Prompts'}>Enter Single Prompts</MenuItem>
                    <MenuItem value={'Upload CSV'}>Upload CSV</MenuItem>
                </Select>
            </Stack>
                <TextField required='true' spellCheck={true} onBlur={(e) => setCategory(e.target.value)} sx={{color: 'white', padding: 2}} placeholder='Category Title'/>
                <TextField label='Author' required='true' defaultValue={user}/>
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
        <Stack sx={{height: '100%', marginLeft: 10}} key={prompts}>
        <Typography variant="h4" component="h4">
            {category && category}
        </Typography>
           {prompts.length > 0 && 
           <List sx={{height: '100%', overflowY: 'scroll', width: '100%'}}> 
                {prompts.map((p, i) => (
                    <Stack direction={'row'}>
                        <ListItem color={'white'}>{p}</ListItem>
                        <Button onClick={() => handleRemove(p)}><i class="fi fi-tr-trash-xmark"></i></Button>
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
