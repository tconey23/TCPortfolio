import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { Alert, Button, Modal, RadioGroup, Stack, FormControlLabel, Radio, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { ref, set, get, child } from 'firebase/database';
import {users} from './firebase'

const AuthModal = ({ loggedIn, setLoggedIn, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [togglePass, setTogglePass] = useState(false);
  const [userType, setUserType] = useState('ExistingUser');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      // Create the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the display name
      await updateProfile(user, {
        displayName: displayName,
      });

      setSuccess(true);
      setLoggedIn(true);
      setUser(displayName)
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSignIn = async () => {
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Retrieve displayName
      const displayName = user.displayName;
  
      if (displayName) {
        console.log(displayName);
        setUser(displayName); // Set displayName in your state
      } else {
        console.log('No displayName found for this user');
        setUser('Anonymous'); // Optional fallback
      }
  
      setSuccess('User signed in successfully!');
      setLoggedIn(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const togglePasswordVisibility = () => setTogglePass((prev) => !prev);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersRef = ref(users, 'users')
        const snapshot = await get(usersRef)
  
        if (snapshot.exists()) {
          const data = snapshot.val();
          console.log(data);
  
         
        } else {
          console.log('No data available');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        
      }
    };
  
    fetchData();
  }, []);

  return (
    <Modal
      open={!loggedIn}
      onClose={() => setLoggedIn(false)}
      aria-labelledby="auth-modal"
      aria-describedby="authentication-modal"
    >
      <FormControl>
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100vw' }}>
          <Stack sx={{ backgroundColor: 'white', height: 500, width: 400, padding: 5 }}>
            <FormLabel id="user-type-label">Login</FormLabel>
            <RadioGroup
              aria-labelledby="user-type-label"
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <FormControlLabel value="ExistingUser" control={<Radio />} label="Existing User" />
              <FormControlLabel value="NewUser" control={<Radio />} label="New User" />
            </RadioGroup>

            <Stack sx={{ justifyContent: 'center', alignItems: 'center', marginTop: 3 }}>
              <TextField
                label='Email'
                sx={{ margin: 1 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <Stack direction="row" alignItems="center">
                <TextField
                    label='Password'
                  sx={{ margin: 1 }}
                  type={togglePass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  fullWidth
                />
                <i
                  onClick={togglePasswordVisibility}
                  className={`fi ${!togglePass ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`}
                  style={{ cursor: 'pointer' }}
                ></i>
              </Stack>

              {userType === 'NewUser' && (
                <>
                  <Stack direction="row" alignItems="center">
                    <TextField
                      label='Re-Enter Password'
                      sx={{ margin: 1 }}
                      type={togglePass ? 'text' : 'password'}
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      fullWidth
                    />
                    <i
                      onClick={togglePasswordVisibility}
                      className={`fi ${!togglePass ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`}
                      style={{ cursor: 'pointer' }}
                    ></i>
                  </Stack>
                    <TextField
                        label="Display Name"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        fullWidth
                    />
                  {password && confirmPass && password !== confirmPass && (
                    <Alert severity="error" sx={{ marginTop: 2 }}>
                      Passwords do not match
                    </Alert>
                  )}
                </>
              )}

              {error && (
                <Alert severity="error" sx={{ marginTop: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ marginTop: 2 }}>
                  {success}
                </Alert>
              )}

              <Button
                variant="contained"
                sx={{ width: 120, marginTop: 3 }}
                onClick={userType === 'NewUser' ? handleSignUp : handleSignIn}
              >
                {userType === 'NewUser' ? 'Sign Up' : 'Sign In'}
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </FormControl>
    </Modal>
  );
};

export default AuthModal;
