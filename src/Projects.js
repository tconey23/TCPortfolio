import React from 'react'
import { overlay } from 'three/examples/jsm/nodes/Nodes.js'
import projects from './projects.json'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { DisplayP3ColorSpace } from 'three'

const Projects = () => {
  const projectList = useMemo(()=>{
    const projList = []
    const proj = Object.entries(projects)

  
    for(let i = 0; i < proj.length; i++){
      if(projects[i].featured){
        projList.push(
          <section key={'proj' + i} style={styles.project}>
          <div style={styles.infoCont}>
            <h2 style={styles.title}>{projects[i].title}</h2>
            <p style={styles.description}>
              {projects[i].description}
              <Link style={styles.link}target="_blank" to={projects[i].url}>more...</Link>
              </p>
          </div>
          {/* <div style={styles.imgCont}>
            <img src={projects[i].img} style={styles.img}/>
            </div> */}
        </section>
        )
      }
    }
    return projList
  })

  return (
    <div style={mainStyle}>
      {projectList}
    </div>
  )
}

export default Projects

const mainStyle = {
    width: '75vw',
    height: '55vh',
    border: '0.5px solid white',
    overflowY: 'scroll',
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#ff8800',
    fontSize: '30px',
    textDecoration: 'none'
}


const styles = {
  project: {
    width: '100%',
    height: '30%',
    marginBottom: '50px',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center'
  },
  img:{
    scale: '0.25'
  },
  link: {
    textDecoration: 'none'
  },
  imgCont: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '75%'
  },
  infoCont: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  description: {
    fontSize: '20px',
    width: '75%',
    marginLeft: '10px',
    color: 'white',
    textAlign: 'left'
  },
  title :{
    fontSize: '40px',
    margin: '10px',
    width: '25%'
  }
}