import React from 'react'

const ProjectDisplay = ({url, title, desc}) => {
    console.log(url, title, desc)
  return (
    <>
        <div>
            <h1 style={styles.title}>
                {title}
            </h1>
            <p>
                {desc}
            </p>
            <p>
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
        marginTop: '20px',
        width: '75vw',
        height: '60vh'
    }
}
