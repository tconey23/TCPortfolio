import { Box, Button, FormLabel, Stack, Typography, Alert, TextField } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import {
  updatePhoneNumber,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signOut,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from 'firebase/auth';

const Account = ({ setLoggedIn, setUser, auth }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showWhatsApp, setShowWhatsApp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [appVerifier, setAppVerifier] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false); // New State for Edit Mode

  const navigate = useNavigate(); 

  useEffect(() => {
    if (!appVerifier) {
      try {
        const verifier = new RecaptchaVerifier(
          'recaptcha-container',
          {
            size: 'invisible',
            callback: (response) => {
              console.log('reCAPTCHA solved:', response);
            },
            'expired-callback': () => {
              console.log('reCAPTCHA expired. Please retry.');
            },
          },
          auth
        );
        setAppVerifier(verifier);
      } catch (error) {
        console.error('Error initializing reCAPTCHA verifier:', error);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (success) {
      const timeout = setTimeout(() => {
        navigate('/home');
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [success, navigate]);

  useEffect(() => {
    console.log(loggedInUser);
  }, [loggedInUser, showWhatsApp]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setLoggedIn(false);
      setUser(null);
      setLoggedInUser(null);
      setSuccess('You have been logged out successfully and will be re-routed to the home page');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, loggedInUser.email);
      setSuccess('Password reset email sent! Check your inbox.');
      setError('');
    } catch (error) {
      setError(error.message);
      setSuccess('');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleAddOrEditPhone = async () => {
    try {
      // Clear any existing RecaptchaVerifier instance
      if (appVerifier) {
        appVerifier.clear();
        setAppVerifier(null);
      }
  
      // Create a new RecaptchaVerifier instance
      const verifier = new RecaptchaVerifier(
        'recaptcha-container',
        {
          size: 'invisible',
          callback: (response) => {
            console.log('reCAPTCHA solved:', response);
          },
        },
        auth
      );
      setAppVerifier(verifier);
  
      // Validate phone number format
      const formattedPhoneNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+1${phoneNumber}`;
  
      if (!/^\+\d{10,15}$/.test(formattedPhoneNumber)) {
        throw new Error('Invalid phone number. Use E.164 format (e.g., +1234567890).');
      }
  
      // Send verification code
      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhoneNumber, verifier);
  
      // Prompt user for the verification code
      const verificationCode = prompt('Enter the verification code sent to your phone:');
      const credential = PhoneAuthProvider.credential(
        confirmationResult.verificationId,
        verificationCode
      );
  
      // Update phone number
      await updatePhoneNumber(auth.currentUser, credential);
  
      setSuccess('Phone number updated successfully.');
      setError('');
      setIsEditingPhone(false);
      setLoggedInUser(auth.currentUser);
    } catch (error) {
      setError(`Error updating phone number: ${error.message}`);
      setSuccess('');
    }
  };

  const handleEditPhoneClick = () => {
    setIsEditingPhone(true); // Enable editing mode
    setPhoneNumber(loggedInUser.phoneNumber || ''); // Pre-fill phone number if it exists
  };

  const handleCancelEditPhone = () => {
    setIsEditingPhone(false); // Exit editing mode
    setPhoneNumber(''); // Clear input
  };

  return (
    <Stack justifyContent={'center'} alignItems={'center'} height={'90vh'} width={'100vw'}>
      <Typography variant='h4'>Account Details</Typography>
      <Stack justifyContent={'flex-start'} alignItems={'flex-Start'} height={600} width={800} backgroundColor={'white'} padding={5}>
        <FormControlLabel
          control={
            <Switch value={showWhatsApp} defaultChecked={true} onChange={() => setShowWhatsApp((prev) => !prev)} />
          }
          label="Enable WhatsApp Messaging"
        />
        <Box sx={{ flexDirection: 'row', display: 'flex' }}>
          <FormLabel sx={{ marginRight: 2 }}>User name:</FormLabel>
          {loggedInUser && loggedInUser.displayName && <Typography>{loggedInUser.displayName}</Typography>}
        </Box>
        <Box sx={{ flexDirection: 'row', display: 'flex' }}>
          <FormLabel sx={{ marginRight: 2 }}>Email:</FormLabel>
          {loggedInUser && loggedInUser.email && <Typography>{loggedInUser.email}</Typography>}
        </Box>
        <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center' }}>
          <FormLabel sx={{ marginRight: 2 }}>Phone #:</FormLabel>
          {!isEditingPhone && loggedInUser?.phoneNumber && (
            <>
              <Typography>{loggedInUser.phoneNumber}</Typography>
              <Button onClick={handleEditPhoneClick}>Edit</Button>
            </>
          )}
          {isEditingPhone && (
            <>
              <TextField
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                label="New Phone Number"
              />
              <Button onClick={handleAddOrEditPhone} variant="contained">
                Save
              </Button>
              <Button onClick={handleCancelEditPhone} variant="outlined">
                Cancel
              </Button>
            </>
          )}
        </Box>
        <Box height={15}>
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}
        </Box>
        <Box
          sx={{ flexDirection: 'row', display: 'flex', width: '100%', paddingTop: 20 }}
          justifyContent={'space-evenly'}
        >
          <Button onClick={handleLogout} variant="contained">
            Logout
          </Button>
          <Button onClick={handlePasswordReset} variant="contained">
            Reset Password
          </Button>
        </Box>
        <div id="recaptcha-container"></div>
      </Stack>
    </Stack>
  );
};

export default Account;
