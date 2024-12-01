import React, {useState, useEffect, Suspense} from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

const SideBar = ({setIsOn, loggedIn}) => {
  const location = useLocation();
  const [canSetOn, setCanSetOn] = useState(false)

  const handleClick = () =>{
    setIsOn(false)
  }

  useEffect(() => {

  }, [])

  return (

    <Suspense>    
      <div style={styles.menu}>
            {location.pathname !== '/home' && <Link onClick={() => handleClick()} style={styles.link} to={'/home'}>HOME</Link>}
            {/* {location.pathname !== '/bio' && <Link onClick={() => handleClick()} style={styles.link}>BIO</Link>} */}
            {location.pathname !== '/portfolio' && <Link onClick={() => handleClick()} style={styles.link}>PORTFOLIO</Link>}
            {/* {location.pathname !== '/resume' && <Link onClick={() => handleClick()} style={styles.link}>RESUME</Link>} */}
            {location.pathname !== '/contact' && <Link onClick={() => handleClick()} style={styles.link} to={'/contact'}>CONTACT</Link>}
            {location.pathname !== '/auth' && <Link onClick={() => handleClick()} style={styles.link} to={'/21Things'}>21Things</Link>}
            {location.pathname !== '/account' && loggedIn && <Link onClick={() => handleClick()} style={styles.link} to={'/account'}>My Account</Link>}
            <div style={styles.logoCont}>
              <img src='/TC192.png' style={styles.logo}/>
            </div>    
          </div>
    </Suspense>

  )
}

export default SideBar

const styles = {
    menu: {
        padding: '20px',
        fontSize: '30px',
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'nowrap',
        justinfyContent: 'center',
        alignItems: 'center'
    },
    link: {
        color: 'white',
        border: '1px solid whitesmoke',
        width: '100%',
        marginBottom: '20px',
        borderRadius: '20px'
    },
    logoCont: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '192px',
      height: '192px'
    },
    logo: { 
      scale: '0.35'
    },
}