import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

const SideBar = (setIsOn) => {
  const location = useLocation();

  const handleClick = () =>{
    setIsOn(false)
  }

  return (

    <div style={styles.menu}>
      {location.pathname !== '/home' && <Link onClick={() => handleClick()} style={styles.link} to={'/home'}>HOME</Link>}
      {location.pathname !== '/bio' && <Link onClick={() => handleClick()} style={styles.link}>BIO</Link>}
      {location.pathname !== '/portfolio' && <Link onClick={() => handleClick()} style={styles.link}>PORTFOLIO</Link>}
      {location.pathname !== '/resume' && <Link onClick={() => handleClick()} style={styles.link}>RESUME</Link>}
      {location.pathname !== '/contact' && <Link onClick={() => handleClick()} style={styles.link} to={'/contact'}>CONTACT</Link>}
    </div>
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
    }
}