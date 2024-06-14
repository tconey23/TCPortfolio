import React from 'react'
import { motion } from "framer-motion";
import { useState, useEffect } from 'react';

import Projects from './Projects';
import Carousel from './Carousel';
import '@fortawesome/fontawesome-free/css/all.min.css'

const Home = () => {

    return (
        <>
    <Carousel />
    <section style={styles.projects}>
    <h3>Featured Projects</h3>
        <Projects />
    </section>

    </>
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
        width: '15vw',
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
        color: 'orange',
        fontSize: '30px',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        textDecoration: 'none'
    },
    projects: {
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '20px',
        color: 'orange',
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
