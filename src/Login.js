import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { Alert, Button, Modal, RadioGroup, Stack, FormControlLabel, Radio, FormControl, FormLabel, TextField, Typography } from '@mui/material';
import { ref, set, get, child } from 'firebase/database';
import {users} from './firebase'
import { useLocation, useNavigate } from "react-router-dom";

const AuthModal = ({ loggedIn, setLoggedIn, setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [togglePass, setTogglePass] = useState(false);
  const [userType, setUserType] = useState('ExistingUser');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    const isPasswordValid = password && confirmPass && password === confirmPass;

    e.preventDefault();
    if (!isPasswordValid) {
      setError("Passwords do not match");
      return;
    }
  
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Set the display name
      await updateProfile(user, { displayName });
  
      setSuccess("User signed up successfully!");
      setLoggedIn(true);
      setUser(displayName);
    } catch (err) {
      setError(err.message);
    }
  };
  
  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      setUser(user.displayName || "Anonymous");
      setSuccess("User signed in successfully!");
      setLoggedIn(true);
    } catch (err) {
      setError(err.message); 
    }
  };

  const togglePasswordVisibility = () => setTogglePass((prev) => !prev);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
        const redirectTo = location.state?.from?.pathname || "/";
        navigate(redirectTo);
      } else {
        setLoggedIn(false)
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

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

    let currentUser = auth.currentUser
  
    if(currentUser){
        console.log(currentUser)
    }
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
