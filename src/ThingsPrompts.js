import { Alert, Button, List, ListItem, MenuItem, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles';
import Papa from 'papaparse';
import { database } from './firebase';

const ThingsPrompts = () => {

    const [prompts, setPrompts] = useState([])
    const [category, setCategory] = useState()
    const [promptText, setPromptText] = useState()
    const [uploadType, setUploadType] = useState('Upload CSV')
    const [categories, setCategories] = useState()
    const [csvData, setCsvData] = useState([])
    const [loading, setLoading] = useState()
    const [changesMade, setChangesMade] = useState({
        cat: false, 
        prompts: false
    })
    const [success, setSuccess] = useState(false)

    const handleSubmit = async () => {
        const newCategory = {
          [category]: [...prompts]
        };
      
        try {
          const categoriesRef = database.ref('categories');

          const snapshot = await categoriesRef.once('value');
          let nextKey = 0;
      
          if (snapshot.exists()) {
            const existingCategories = snapshot.val();
            const keys = Object.keys(existingCategories).map(key => parseInt(key));  

            nextKey = Math.max(...keys) + 1;
          }
      
          await categoriesRef.child(nextKey.toString()).set(newCategory); 
          console.log('Category added successfully');
      
          setCategories(prevCategories => ({
            ...prevCategories,
            [nextKey]: newCategory,
          }));

          setSuccess(true)
          setCategory('')
          setPrompts([])
          setChangesMade({
            cat: false, 
            prompts: false
        })
      
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
    }, [prompts, category])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await database.ref('categories').once('value');
                if (snapshot.exists()) {
                    setCategories(snapshot.val());
                    console.log(snapshot.val())
                } else {
                    console.log('No data available');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
      }, []);

  return (
    <Stack direction={'row'} width={'90vw'} height={500} justifyContent={'center'} alignItems={'center'} padding={10}>
        <Stack justifyContent={'center'} alignItems={'center'} sx={{background: 'white', padding: 10}} width={300}>
            {success && <Alert sx={{position: 'absolute', top: 100}}>Category added!</Alert>}
            <Stack color={'black'}>
                <Select onChange={(e) => setUploadType(e.target.value)} value={uploadType} label={uploadType}>
                    <MenuItem value={'Enter Single Prompts'}>Enter Single Prompts</MenuItem>
                    <MenuItem value={'Upload CSV'}>Upload CSV</MenuItem>
                </Select>
            </Stack>
                <TextField required='true' spellCheck={true} onBlur={(e) => setCategory(e.target.value)} sx={{color: 'white', padding: 2}} placeholder='Category Title'/>
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
