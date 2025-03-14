import logo from './logo.svg';
import './App.css';
import { auth, currentUser } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import Home from './Home';
import Contact from './Contact';
import React, {useState, useRef, useEffect} from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ErrorBoundary } from 'react-error-boundary'
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import SideBar from './SideBar';
import ProjectDisplay from './ProjectDisplay';
import TwentyOneThings from './TwentyOneThings'; 
import ThingsPrompts from './ThingsPrompts';
import Login from './Login'
import Error from './Error';
import Account from './Account';
import { addUser } from './apiCalls';
import { Analytics } from "@vercel/analytics/react"

function App() {

  const [isOn, setIsOn] = useState(false);
  const toggleSwitch = () => setIsOn(!isOn); 
  const [projURL, setURL] = useState()
  const [projTitle, setTitle] = useState()
  const [projDesc, setDesc] = useState()
  const [loggedIn, setLoggedIn] = useState()
  const [user, setUser] = useState()
  const nav = useNavigate()

  const getHandleStyle = () => {
      return {
          ...styles.handle,
          marginLeft: isOn ? '15px' : '0px'
      };
  };



  
  const location = useLocation();
  
  const ProtectedRoute = ({ loggedIn, children }) => {
    if (!loggedIn) {
      // Redirect to login and pass the requested path in state
      return <Navigate to="/login" state={{ from: location }} />;
    }
    
    return children;
  };

  useEffect(() => {
    if(location && location.pathname === '/'){
      nav('/Landing')
    }
  }, [location])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedIn(true)
        console.log(user)
        setUser(user.displayName)
      } else {
        setLoggedIn(false)
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleCloseMenu = () => {
    isOn && setIsOn(false)
  }

  return (
    <div className="App" onClick={() => handleCloseMenu()}>
        <header className="App-header" style={styles.header}>
        {isOn && 
            <motion.div id='sideBar' style={styles.sideBar} layout transition={spring} animate={{x:500, opacity: 1, duration: 1}}>
                <SideBar setIsOn={setIsOn} loggedIn={loggedIn} user={user} setUser={setUser}/>
            </motion.div> 
        }
        <div style={styles.switchCont}>
            <div className="switch" style={styles.switch} data-ison={isOn} onClick={toggleSwitch}>
                <motion.div className="handle" style={getHandleStyle()} layout transition={button} />
            </div>
        </div>
        <nav id='navbar' style={styles.navbar}>
            <Link style={styles.link} to={'https://github.com/tconey23'} target='_blank'>        
                <i style={styles.icon} className="fab fa-github"></i>
                <p id='socials'>GITHUB</p>
            </Link>
                <p id='titleName' >TOM CONEY</p>
            <Link style={styles.link} to={'https://www.linkedin.com/in/tom-ce-coney/'} target='_blank'>        
                <i style={styles.icon} className="fab fa-linkedin"></i>
                <p id='socials' >LINKED IN</p> 
            </Link>
        </nav>
        <div style={styles.logoCont}>
            <img src='/TC192.png' style={styles.logo}/>
        </div>
    </header>
      <main id='mainContent'>
      <ErrorBoundary
        FallbackComponent={() => <h1>Something went wrong!</h1>}
      >
        <Routes>
          <Route path={'/Landing'} element={<LandingPage />}/>
          <Route path={'/Home'} element={<Home setURL={setURL} setTitle={setTitle} setDesc={setDesc}/>}/>
          <Route path={'/Contact'} element={<Contact />}/>
          <Route path={'/ViewProject'} element={<ProjectDisplay title={projTitle} desc={projDesc} url={projURL}/>}/>
          <Route path={'/Error'} element={<Error />}/>
          <Route path={'/login'} element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUser={setUser}/>}/>          
          <Route path={'/21Things'} element={<TwentyOneThings />}/>
          <Route path={'/account'} element={<Account auth={auth} user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>}/>
          <Route
            path="/prompts"
            element={
              <ProtectedRoute loggedIn={loggedIn}>
                <ThingsPrompts user={user} setUser={setUser} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
              </ProtectedRoute>
              }
          />
          {/* <Route path="*" element={<Navigate to="/Error" />} /> */}
        </Routes>
      </ErrorBoundary>
      </main>
      <Analytics/>
    </div>
  );
}

export default App;


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
      color: '#ff8800',
      fontSize: '30px',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'center',
      textDecoration: 'none',
      wordWrap: 'nowrap'
  },
  projects: {
      width: '100vw',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '80px'
  },
  navbar: {
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      justifyContent: 'center',
      width: '33vw'
  },
  name:{
      fontSize: '50px'
  },
  logo: { 
    scale: '0.35'
  },
  logoCont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '33vw',
    height: '18vh'
  },
  switchCont: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: '33vw',
    height: '18vh'
  }
}



const button = {
  type: "spring",
  stiffness: 700,
  damping: 30
}

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30
}
