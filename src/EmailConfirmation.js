import React, {useState, useEffect} from 'react';
import { Stack, Modal, Typography, Alert } from '@mui/material';

const EmailConfirmation = ({success, setSuccess, formData, setFormData }) => {
  const [osStatement, setOsStatement] = useState()

  const handleClose = () => {
    setSuccess(false)
    setFormData({
        name: '',
        email: '',
        os: 'iOS'
    })
  }

  useEffect(() => {
    if(formData && success){
        console.log(formData)
        formData.os === 'iOS' ? 
        setOsStatement('https://testflight.apple.com/join/HADecKXT') 
        : 
        setOsStatement('https://play.google.com/store/apps/details?id=com.tconey23.connect21Mobile')
    }
  }, [formData, success])
  
    return (
    <Modal
      open={!!success}
      onClose={() => handleClose()}
    >
      <Stack
        spacing={2}
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 300,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Alert severity={success ? 'success' : 'error'}>
          {success ? 'Request sent successfully!' : 'Email confirmation failed.'}
        </Alert>
        <Typography variant="body2" align="center">
          {success ? 'Your request has been sent to our development team. \n \n You will receive confirmation via email once your access has been approved. \n' : 'Please try again later.'}
            Please visit the <a href={osStatement} target='_blank'>{`21Things ${formData.os === 'iOS' ? 'TestFlight page' : 'Google Play'}`}</a> on your mobile device to install the application and review helpful information on testing beta apps.
        </Typography>
      </Stack>
    </Modal>
  );
};

export default EmailConfirmation;
