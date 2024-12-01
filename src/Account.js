import { Box, Button, FormLabel, Stack, Typography, Alert } from '@mui/material'
import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, setPersistence, browserLocalPersistence, onAuthStateChanged, sendPasswordResetEmail, signOut } from 'firebase/auth';


const Account = ({setLoggedIn, setUser}) => {

    const [loggedInUser, setLoggedInUser] = useState(null)
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate()


    useEffect(() => {
        if (success) {
          const timeout = setTimeout(() => {
            navigate('/home');
          }, 2000);
    
          // Cleanup timeout on unmount
          return () => clearTimeout(timeout);
        }
      }, [success, navigate]);


    const handleLogout = async () => {
        try {
          await signOut(auth);
          // Perform any additional cleanup or state reset here
          setLoggedIn(false); // Update your app's logged-in state
          setUser(null); // Clear user information
          setLoggedInUser(null); // Clear user information
          setSuccess('You have been logged out successfully and will be re-routed to the home page')
        } catch (error) {
          console.error("Error logging out:", error.message);
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
            setLoggedInUser(user)
          } else {
            
          }
        });
    
        return () => unsubscribe(); // Cleanup listener on unmount
      }, [auth]);
  
    return (
    <Stack justifyContent={'center'} alignItems={'center'} height={'90vh'} width={'100vw'}>
        <Typography variant='h4'>Account Details</Typography>
    <Stack justifyContent={'flex-start'} alignItems={'flex-Start'} height={600} width={800} backgroundColor={'white'} padding={5}>
        <Box sx={{flexDirection: 'row', display: 'flex'}}>
            <FormLabel sx={{marginRight: 2}}>User name:</FormLabel>
            {loggedInUser && loggedInUser.displayName && <Typography>{loggedInUser.displayName}</Typography>}
        </Box>
        <Box sx={{flexDirection: 'row', display: 'flex'}}>
            <FormLabel sx={{marginRight: 2}}>Email:</FormLabel>
            {loggedInUser && loggedInUser.email && <Typography>{loggedInUser.email}</Typography>}
        </Box>
        <Box height={15}>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
        </Box>
        <Box sx={{flexDirection: 'row', display: 'flex', width: '100%', paddingTop: 20}} justifyContent={'space-evenly'}>
            <Button onClick={handleLogout} variant='contained'>Logout</Button>
            <Button onClick={handlePasswordReset} variant='contained'>Reset Password</Button>      
        </Box>
    </Stack>
</Stack>
  )
}

export default Account
