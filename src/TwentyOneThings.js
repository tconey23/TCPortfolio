import React, { useEffect, useState } from 'react';
import EmailConfirmation from './EmailConfirmation';
import emailjs from 'emailjs-com';
import './TwentyOneThings.css';
import { MenuItem, Stack, Typography, TextField, Button, Alert, Select } from '@mui/material';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Link } from 'react-router-dom';
import { addTester } from './apiCalls';

const TwentyOneThings = () => {
  const [success, setSuccess] = useState(false)
  const [pubLink, setPublink] = useState('https://testflight.apple.com/join/HADecKXT')
  const [fieldState, setFieldState] = useState({
    name: false,
    email: false,
    os: true
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    os: 'iOS',
    message: `${pubLink}`
  });
  
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      message: formData.os === 'iOS'
        ? 'https://testflight.apple.com/join/HADecKXT'
        : 'https://play.google.com/apps/testing/com.tconey23.connect21Mobile'
    }));
  }, [formData.os]);


  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.trim().length > 0;
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value} = e.target;
    const { email, emailAdd} = e.target;

    setFormData({
      ...formData,
      [name]: value,
      [email]: emailAdd
    });

    setFieldState((prevState) => ({
      ...prevState,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (Object.values(fieldState).includes(false)) {
      alert('Please fill out all fields correctly.');
      return;
    }
  
    try {
      // Ensure message is correctly set
      const emailData = {
        name: formData.name,
        email: formData.email,
        os: formData.os,
        message: formData.message // Ensure it matches the template's placeholder
      };
  
      console.log(emailData);
  
      const response = await emailjs.send(
        'service_sj8p1yb',    // Service ID
        'template_v84kp7q',   // Template ID
        emailData,
        'iEa1QtTEPPBHKUYfL'   // Public Key
      );

      if(formData.os === 'Android'){
        addTester(emailData.email)
      }
  
      setSuccess(true);
    } catch (error) {
      console.error("Error sending email:", error);
      setSuccess(false);
    }
  };
  

  return (
    <Stack
      justifyContent={'flex-start'}
      alignItems={'center'}
      className="things-wrapper"
      sx={{ fontFamily: '"Bebas Neue", sans-serif' }}
    >
      <Link to={'/prompts'}>Admin Login</Link>
      <Stack className="things-header">
        <Typography fontSize={30} fontFamily={'"Bebas Neue", sans-serif'} color="white">
          Thank you for your interest in 21Things!
        </Typography>
        <Typography fontFamily={'"Bebas Neue", sans-serif'} color="white">
          Please complete the form below to request access to the beta version of the application. 
        </Typography>
      </Stack>

      <Stack sx={{ color: 'orange' }} alignItems={'center'} justifyContent={'center'} width={500}>
        <FormControl component="form" onSubmit={handleSubmit}>
          <FormLabel sx={{ color: 'orange'}} id="name-label">
            Name
          </FormLabel>
          <Stack direction={'row'}>
            <TextField
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ backgroundColor: 'white', marginBottom: 5}}
              variant="filled"
              error={!fieldState.name && formData.name !== ''}
              helperText={!fieldState.name && formData.name !== '' ? 'Name is required' : ''}
            />
          </Stack>

          <FormLabel sx={{ color: 'orange'}} id="email-label">
            Email
          </FormLabel>
          <TextField
            type="email"
            name="email"
            value={formData.to_email}
            onChange={handleChange}
            sx={{ backgroundColor: 'white', marginBottom: 5}}
            variant="filled"
            error={!fieldState.email && formData.email !== ''}
            helperText={!fieldState.email && formData.email !== '' ? 'Enter a valid email' : ''}
          />

          <Stack>
            <FormLabel sx={{ color: 'orange'}} id="os-label">
              Mobile Operating System
            </FormLabel>
            <RadioGroup
              sx={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 5}}
              aria-labelledby="os-label"
              name="os"
              value={formData.os}
              onChange={handleChange}
            >
              <FormControlLabel value="iOS" control={<Radio />} label="iOS (iPhone)" />
              <FormControlLabel value="Android" control={<Radio />} label="Android" />
            </RadioGroup>
          </Stack>

          <Button type="submit" sx={{ backgroundColor: 'orange' }} variant="contained">
            SUBMIT
          </Button>
        </FormControl>
      </Stack>
      <EmailConfirmation setFormData={setFormData} formData={formData} success={success} setSuccess={setSuccess}/>
    </Stack>
  );
};

export default TwentyOneThings;
