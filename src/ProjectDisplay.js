import React from 'react'

const ProjectDisplay = ({url, title, desc}) => {
    console.log(url, title, desc)
  return (
    <>
        <div>
            <h1 style={styles.title}>
                {title}
            </h1>
            <p style={styles.ptag}>
                {desc}
            </p>
            <p style={styles.ptag}>
                Check out the live version of <i>{title}</i> below
            </p>
        </div>
        <iframe style={styles.iframe} src={url}></iframe>
    </>
  )
}

export default ProjectDisplay

const styles = {
    iframe:{
        marginTop: '-93px',
        width: '75vw',
        height: '89vh',
        scale: '0.8'
    },
    title: {
        color: '#ff8800'
    },
    ptag: {
        color: 'white'
    }
}
