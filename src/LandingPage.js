import React, {useState, useEffect, useRef} from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import Geometry from './Geometry'
import { Float, OrbitControls, SpotLight } from '@react-three/drei'
import { motion } from "framer-motion";
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom';
import { Physics, RigidBody } from '@react-three/rapier';
import { Plane } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { Link } from 'react-router-dom';
import { Stats } from '@react-three/drei';


const CameraControl = ({cameraPosition}) => {
  const {camera} = useThree()
  const planeRef = useRef()
  camera.lookAt(0,0,0)
  
  useFrame(() =>{
    const {x,y,z} = cameraPosition
    const vect = new Vector3(x,y,z)
    camera.lookAt(vect)
    camera.position.set(x,y,z+5)
  })
}

const LandingPage = () => {

  const [cameraPosition, setCameraPosition] = useState({x: 0,y: 0,z: 3})
  const [lightPosition, setLightPosition] = useState([[0, 5, 0],[0, -5, 0],[0, 0, 5]])
  const [lightFollow, setLightFollow] = useState(true)
  const [type, setType] = useState('cuboid')
  const [onHover, setOnHover] = useState()
  const [windowDims, setWindowDims] = useState([window.outerWidth, window.outerHeight])
  const [isOn, setIsOn] = useState(false);
  const [position, setPosition] = useState(0);
  // const toggleSwitch = () => setIsOn(!isOn);
  const [isHover, setIsHover] = useState(false)
  const [clipStyle, setClipStyle] = useState([styles.clip, styles.clip2])
  const [canvasStyle, setCanvasStyle] = useState(styles.canvas)
  const [handleStyle, setHandleStyle] = useState(styles.handle)
  const [renderCanvas, setRenderCanvas] = useState(false)
  const handleX = useRef(0)
  const midWindow = useRef()
  const rightWindow = useRef()
  const [initialState, setInitialState] = useState()
  const tom = useRef()
  const coney = useRef()
  const frontend = useRef()
  const engineer = useRef()
  const enterSwitch = useRef()
  const [showSwitch, setShowSwitch] = useState(true)

  const light = new THREE.PointLight( 0xff0000, 100, 5 ); 
  const light2 = new THREE.PointLight( 0x22ff00, 100, 5 ); 
  const light3 = new THREE.PointLight( 0x00bbff, 100, 5 ); 

  const r = Math.PI /180

  const navigate = useNavigate()

  const planeCollision = () => {
    if(!lightFollow){
      setLightFollow(true)
    }
  }

  const getHandleStyle = () => {
    return {
        ...styles.handle,
        marginLeft: isOn ? '15px' : '0px'
    };
};

  useEffect(() =>{
    
    if(lightFollow) {
      const {x,y,z} = cameraPosition
      setLightPosition([[x,y+5,z], [x,y-5,z], [x,y,z+5]])
    }
  }, [lightFollow, cameraPosition])

  useEffect(() => {
    if(isOn){
      navigate('/home')
    }
  }, [isOn])


  useEffect(() => {
    setWindowDims([window.outerWidth, window.outerHeight])

    styles.text1['top']= windowDims[1] * 0.01
    styles.text1['left']= windowDims[0] * 0.43
    
    styles.text2['top']= windowDims[1] * 0.65
    styles.text2['left']= windowDims[0] * 0.01

    styles.canvas['top']= windowDims[1] * 0.01
    styles.canvas['left']= windowDims[0] * 0.01

    midWindow.current = windowDims[0] * 0.5
    rightWindow.current = windowDims[0] - 170



  }, [window.outerHeight, window.outerWidth])

    useEffect(() => {
      if (position == 100) {
        setIsOn(!isOn);
      }
    }, [position])

    useEffect(() => {

      let tomWidth, coneyWidth, frontendWidth, engineerWidth, switchWidth
      let tomHeight, coneyHeight, frontendHeight, engineerHeight
      let tomTop, frontendTop
      let fullFont = '80px'
      let mobileFont = '40px'

      if(tom.current){
        tomTop = parseInt((tom.current.style.top).split('px')[0])
        frontendTop = parseInt((tom.current.style.top).split('px')[0])
        tomWidth = tom.current.offsetWidth / 2 
        coneyWidth = coney.current.offsetWidth / 2 
        frontendWidth = frontend.current.offsetWidth / 2 
        engineerWidth = engineer.current.offsetWidth / 2 
        // switchWidth = enterSwitch.current.offsetWidth / 2

        tomHeight = tom.current.offsetHeight / 2 + 10
        coneyHeight = coney.current.offsetHeight / 2 + 10
        frontendHeight = frontend.current.offsetHeight / 2 + 10
        engineerHeight = engineer.current.offsetHeight / 2 + 10
      }

    
      const fullState = [
        [{
        position: 'absolute',
        left: windowDims[0] + 100, 
        top: 0,
        fontSize: fullFont
      },
      {
        left: windowDims[0] / 1.3, 
      }], 
      [{
        position: 'absolute',
        left: windowDims[0] + 100, 
        opacity: 0,
        fontSize: initialState
        },
        {
          left: windowDims[0] / 1.3, 
          top : tomTop + tomHeight + 8,
          opacity: 1,
          }],
        [{
          left: -windowDims[0],
          top: windowDims[1] * 0.65,
          fontSize: initialState
        },
        {
          left: windowDims[0] / 10,
          top: windowDims[1] * 0.65,
        }],
        [{
          left: -windowDims[0], 
          opacity: 0,
          fontSize: initialState
        },
        {
          left: windowDims[0] / 10,
          top: windowDims[1] * 0.65 + frontendHeight - 3,
          opacity: 1,
        }],
        [{
          height: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          display: 'flex',
          justifyContent: 'flex-start',
          borderRadius: '50px',
          padding: '10px',
          cursor: 'pointer',
          position: 'fixed',
          top: '32px',
          left: windowDims[0] /2 - 15,
          opacity: 0,
          zIndex: '100'
         },
         {
          left: windowDims[0] /2 - 15,
          opacity: 1,
         }
        ]
      ]

      const mobileState = [
          [
            {
              position: 'absolute',
              left: windowDims[0] + 100, 
              top: windowDims[0],
              fontSize: mobileFont
            },
              {
                position: 'absolute',
                left: windowDims[0] /2 - tomWidth, 
                top: windowDims[0] * 0.25,
                fontSize: mobileFont 
              }
          ], 
          [
            {
              position: 'absolute',
              left: windowDims[0] + 100, 
              opacity: 0,
              fontSize: mobileFont
            },
              {
                position: 'absolute',
                left: windowDims[0] / 2 - coneyWidth, 
                top: windowDims[0] * 0.25 + coneyHeight,
                opacity: 1,
                fontSize: mobileFont
              }
          ],
          [
            {
              left: -windowDims[0],
              top: windowDims[1],
              fontSize: mobileFont
            },
            {
              left: windowDims[0] /2 - frontendWidth,
              top: windowDims[1] * 0.75,
              fontSize: mobileFont
            }
          ],
          [
            {
              left: -windowDims[0],
              top: windowDims[1],
              fontSize: mobileFont
            },
            {
              left: windowDims[0] /2 - engineerWidth,
              top: windowDims[1] * 0.75 + engineerHeight,
              fontSize: mobileFont
            }
        ],
        [{
          height: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          display: 'flex',
          justifyContent: 'flex-start',
          borderRadius: '50px',
          padding: '10px',
          cursor: 'pointer',
          position: 'fixed',
          top: '32px',
          left: windowDims[0],
          zIndex: '100'
         },
         {
          height: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
          display: 'flex',
          justifyContent: 'flex-start',
          borderRadius: '50px',
          padding: '10px',
          cursor: 'pointer',
          position: 'fixed',
          left: windowDims[0] /2 - switchWidth,
          top: '32px',
          zIndex: '100'
          
         }
        ]
      ]
      const setFont = async () => {
        await window.outerWidth > 400 ? setInitialState(fullState) : setInitialState(mobileState)
       }
 
       setFont()

    }, [tom, coney, frontend, engineer, enterSwitch, initialState])

    useEffect(() =>{

    }, [tom.current])

    useEffect(() => {
      setTimeout(() => {
        setRenderCanvas(true)
      }, 3000);
    }, [])



    const handleDrag = (event, info) => {
      let pos = info.offset.x
      if(pos < 0){
        pos = 0
      }
      if(pos > 100){
        pos = 100
      }
      setCanvasStyle(canvasFade)
      setClipStyle([clipRotateStyle, clip2RotateStyle])
      handleX.current = pos
      setPosition(pos);
    };

    const clipRotateStyle = {
      ...styles.clipHover,
      left: `${-position * 25}px`
    };
  
    const clip2RotateStyle = {
      ...styles.clip2Hover,
      left: `${position * 25}px`
    };

    const canvasFade = {
      ...styles.canvas,
      scale: `${(1 - position / 100)}`
    }

    const returnHandle = {
      ...styles.handle,
      transform: `translateX(${handleX.current}px)`
    }
  
    const handleDragEnd = (event, info) => {
    };


  return (
    <div id='landingSplash' style={styles.splash}>
     <div>
{ initialState && showSwitch && 
    // <motion.div 
    //  className="switch"
    //  ref={enterSwitch}
    //  initial={initialState[4][0]}
    //  animate={initialState[4][1]}
    //  transition={fade}
    //  data-ison={isOn}>
    //   <motion.div
    //     onPointerOver={() => setIsHover(true)}
    //     onPointerOut={() => setIsHover(false)}
    //     className="handle"
    //     style={handleStyle}
    //     drag="x"
    //     dragConstraints={{ left: 0, right: 100 }}
    //     dragElastic={0}
    //     onDrag={handleDrag}
    //     onDragEnd={handleDragEnd}
    //     animate={{ x: isOn ? 60 : 0 }}
    //     transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    //   />
    //   <br/>
    //   <p style={styles.text}>Slide to enter</p>
    // </motion.div>
    <motion.div
      className="switch"
      ref={enterSwitch}
      initial={initialState[4][0]}
      animate={initialState[4][1]}
      transition={fade}
      onClick={() => setIsOn(!isOn)}
    >
      <p style={{width: '100%'}}>Enter</p>
    </motion.div>
    }
     </div>
     <div id='fullWindow' 
      style={{
        width: windowDims[0], 
        height: windowDims[1],
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
        }}>
        {initialState && 
          <>
          
        <motion.h1 
        ref={tom}
          layout 
          transition={fade} 
          initial={initialState[0][0]} 
          animate={initialState[0][1]}>TOM</motion.h1>
        <motion.h1 
        ref={coney}
          layout 
          transition={spring2} 
          initial={initialState[1][0]} 
          animate={initialState[1][1]}>CONEY</motion.h1>
            </>
            }
     </div>
  
      <motion.div style={clipStyle[0]}></motion.div >
      <motion.div  style={clipStyle[1]}></motion.div >
      <motion.div layout transition={floatIn} initial={{x:-5000}} animate={{x:0, y: 0,}}>
        {/* <Stats /> */}
        {renderCanvas && <Canvas style={canvasStyle}>
          <CameraControl cameraPosition={cameraPosition} setWindowDims={setWindowDims}/>
          <directionalLight castShadow intensity={2} color={'white'}/>
          <ambientLight intensity={10} position={lightPosition[0]}/>
          <primitive position={lightPosition[0]} object={light}/>
          <primitive position={lightPosition[1]} object={light2}/>
          <primitive position={lightPosition[2]} object={light3}/>
          <Physics gravity={[0,0,0]} colliders={type}>
              <Geometry style={styles.geo} setOnHover={setOnHover} castShadow receiveShadow setCameraPosition={setCameraPosition}/>
          </Physics>
          {/* <OrbitControls /> */}
        </Canvas>}
        {onHover && 
          <motion.div onPointerOver={()=>{setOnHover(true)}} layout transition={fade2} initial={{opacity: 0}} animate={{opacity: 1}}>  
            <Link style={styles.link} to={'/home'}>ENTER</Link>
          </motion.div> 
        }    
      </motion.div>

     {initialState && <>
        <motion.h2 
        ref={frontend}
            className='splash-text'
            layout 
            transition={fade} 
            initial={initialState[2][0]} 
            animate={initialState[2][1]}>FRONTEND</motion.h2>
        <motion.h2 
        ref={engineer}
          layout 
          transition={spring2} 
          initial={initialState[3][0]} 
          animate={initialState[3][1]}>ENGINEER</motion.h2>  
          </>}
    </div>
  )
}

export default LandingPage
const button = {
  type: "spring",
  stiffness: 700,
  damping: 30
}

const floatIn = {
  type: 'ease',
  duration: 2
}

const spring = {
  type: "ease",
  duration: 1
}

const spring2 = {
  type: "spring",
  stiffness: 700,
  damping: 30,
  delay: 3,
  duration: 0.1
}

const fade = {
  type: 'ease',
  duration: 2,
  delay: 1
}

const fade2 = {
  type: 'ease',
  duration: 1,
  delay: 0
}


const styles={
  splash: {
    height: '100vh', 
    width: '100vw',
    background: '#16191d'
  },
  clip: {
    clipPath: 'polygon(0 0, 0% 100%, 100% 100%)',
    width: '100vw', 
    height: '100vh',
    background: 'white',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  clipHover: {
    clipPath: 'polygon(0 0, 0% 100%, 100% 100%)',
    width: '100vw', 
    height: '100vh',
    background: 'white',
    position: 'absolute',
    top: '0px',
    left: '-15px'
  },
  canvas: {
    height: '99vh',
    width: '100vw',
    position: 'fixed',
    top: '',
    left: '',
    zIndex: '20'
  },
  clip2: {
    clipPath: 'polygon(100% 100%, 100% 0%, 0 0',
    width: '100vw', 
    height: '100vh',
    background: '#282c34',
    position: 'absolute',
    top: '0px',
    left: '0px'
  },
  clip2Hover: {
    clipPath: 'polygon(100% 100%, 100% 0%, 0 0',
    width: '100vw', 
    height: '100vh',
    background: '#282c34',
    position: 'absolute',
    top: '0px',
    left: '15px',
  },
  link: {
    fontSize: '80px',
    color: '#ff8800',
    position: 'absolute',
    top: '45vh',
    left: '45vw',
    zIndex: 100,
    width: '200px',
    background: 'black',
    boxShadow: '0px 0px 13px 1px #ffffffc7',
    borderRadius: '24px'
  },
  text1:{
    top: '',
    left: ''
  },
  text2: {
  top: '',
  left: ''
  },
  handle: {
    width: '15px',
    height: '10px',
    backgroundColor: 'whitesmoke',
    borderRadius: '40px',
    position: 'absolute',
    cursor: 'pointer'
},
switch: {

},
text: {
  color: '#ff8800',
  marginTop: '20px',
  marginLeft: '0px'
},
geo:{
  cursor: 'pointer'
}
}
