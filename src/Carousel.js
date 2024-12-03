import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '@fortawesome/fontawesome-free/css/all.min.css'
import { Link } from 'react-router-dom';
import './Contact.css'
import { MenuItem, Stack, Typography, TextField, Button, Alert, Select } from '@mui/material';

const Carousel = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 7,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        cssEase: 'ease-in-out'
    };

    return (
    <Stack className='carousel'>
        <Typography variant='h5' sx={{fontFamily: '"Bebas Neue", sans-serif'}}>Tech Stack</Typography>
        <Slider style={styles.slider} {...settings}>
            <div>
                <i style={styles.icon} className="fab fa-react"></i>
                <p>REACT</p>
            </div>
            <div>
                <i style={styles.icon} className="fab fa-js"></i>
                <p>JAVASCRIPT</p>
            </div>
            <div>
                <i style={styles.icon} className="fab fa-html5"></i>
                <p>HTML</p>
            </div>
            <div>
                <i style={styles.icon} className="fab fa-css3-alt"></i>
                <p>CSS</p>
            </div>
            <div>
                <img style={styles.sass} src='/assets/sass-fill.svg'/>
                <p>SASS</p>
            </div>
            <div>
                <img style={styles.cypress} src="/assets/brand-cypress.svg" alt="Cypress logo"/>
                <p>CYPRESS</p>
            </div>
            <div>
                <img style={styles.framer} src='/assets/brand-framer-motion.svg'/>
                <p>FRAMER-MOTION</p>
            </div>
            <div>
                <img style={styles.gsap} src='/assets/gsap-icon.svg'/>
                <p>GSAP</p>
            </div>
            <div>
                <img style={styles.threejs} src='/assets/brand-threejs.svg'/>
                <p>THREE.JS</p>
            </div>
            <div>
                <img style={styles.threejs} src='/assets/vercel-logo.svg'/>
                <p>vercel</p>
            </div>
            <div>
                <img style={styles.threejs} src='/assets/heroku.svg'/>
                <p>heroku</p>
            </div>
            <div style={styles.r3f}>
                <img style={styles.r3f} src='/assets/drei-logo.svg'/>
                <p id='r3f'>REACT THREE FIBER</p>
            </div>
        </Slider>
    </Stack>
    );
};

export default Carousel;

const styles = {
    link: {
        display: 'flex',
        paddingLeft: '10px',
        paddingTop: '10px',
        justifyContent: 'center',
        marginBottom: '0px'
    },
    icon: {
        fontSize: '80px',
        color:  '#ff8800',
    },
    slider: {
        width: '75vw',
    },
    mocha: {
        scale: '0.5'
    },
    cypress: {
    },
    threejs: {
    },
    gsap: {
    },
    sass: {
    },
    framer: {
    },
    r3f: {
      marginBottom: '20px'
    }
}