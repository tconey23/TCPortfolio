import React from 'react'
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { MenuItem, Stack, Typography, TextField, Button, Alert, Select } from '@mui/material';

import Projects from './Projects';
import Carousel from './Carousel';
import '@fortawesome/fontawesome-free/css/all.min.css'

const Home = ({setURL, setTitle, setDesc}) => {

    return (
    <Stack justifyContent={'center'} alignItems={'center'}>
        <Carousel />
        <Stack className='projects'>
            <Typography sx={{fontFamily: '"Bebas Neue", sans-serif', marginTop: 5}} variant='h3'>Featured Projects</Typography>
            <Projects setURL={setURL} setTitle={setTitle} setDesc={setDesc}/>
        </Stack>
    </Stack>
  )
}

export default Home



  const styles = {
    header: {
        height: '10vh',
        width: '100vw',
        borderBottom: '1px solid whitesmoke',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'nowrap',
    },
    switch: {
        width: '30px',
        height: '10px',
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        display: 'flex',
        justifyContent: 'flex-start',
        borderRadius: '50px',
        padding: '10px',
        cursor: 'pointer',
        position: 'fixed',
        top: '32px',
        left: '8px'
    },
    sideBar: {
        width: '40vw',
        height: '500px',
        position: 'absolute',
        borderRadius: '40px',
        top: '12vh',
        left: '-500px',
        opacity: '0',
        boxShadow: '3px 2px 7px 0px black',
        backgroundColor: '#282c34',
        zIndex: '10'
    },
    handle: {
        width: '15px',
        height: '10px',
        backgroundColor: 'whitesmoke',
        borderRadius: '40px',
    },
    footer: {
        height: '30px',
        width: '100vw',
        borderTop: '1px solid whitesmoke',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        position: 'relative',
        top: '60vh'
    },
    link: {
        display: 'flex',
        paddingLeft: '10px',
        paddingTop: '10px',
        height: '20px',
        width: '200px',
        color: '#ff8800',
        fontSize: '30px',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
    },
    projects: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        color: '#ff8800',
        fontSize: '30px'
    },
    navbar: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
    },
    name:{
        fontSize: '50px'
    }
  }
