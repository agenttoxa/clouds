import React, {FC, useEffect, useState, useRef, useMemo} from 'react';
import cloudImage from './../../assets/cloud-0.svg';
import CloudImage2 from './../cloudImage/CloudImage.tsx';

import './cloud.sass'

interface ICloud {
  width: number;
  isActive?: boolean;
  setActive?: () => boolean;
  text?: string;
  author?: string;
}


const Cloud: FC<ICloud> = ({width, isActive = false, setActive, text, author}) => {
  const [posY, setPosY] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const colors = ['#02315E', '#00457E', '#2F70AF', '#B9848C', '#806491', '#364969', '#51648c', '#97989d', '#c0ced1', '#dbbdbb'];

  const currentColor = useMemo(() => colors[Math.floor(getRandomArbitrary(0, colors.length))], [])
  
  let count = 0;
  let dir = 1;
  let positionY = 0;
  let zIndex = useMemo(() => Math.floor(getRandomArbitrary(1, 10)), []);
  let speed = useMemo(() => getRandomArbitrary(1, 6), []);
  let startPosY = useMemo(() => getRandomArbitrary(0, 1800), [])
  let startPosX = useMemo(() => getRandomArbitrary(0, window.innerWidth), [])
  let positionX = startPosX;
  let interval: any = null;
  const [posX, setPosX] = useState(positionX);

  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  const moving = () => {
    setIsMoving(true);
    interval = setInterval(() => {
      positionX = posX + 100 * count;
      positionY = getRandomArbitrary(startPosY - 50, startPosY + 50);
      setPosX(positionX);
      setPosY(positionY)
      count += dir;
      if (dir == 1) {
        if (positionX + width / 2 > window.innerWidth) {
          dir = -1;
          count += dir;
          positionX = posX + 100 * count;
        }
      } else {
        if (positionX + width / 2 <= 0) {
          dir = 1;
          count += dir;
          positionX = posX + 100 * count;
        }
      }
    }, speed * 1000)
  }

  useEffect(() => {
    setPosY(startPosY);
    setPosX(startPosX);
    setTimeout(() => {
      moving();
    }, 100)
    return () => {
      clearInterval(interval);
    }
  }, [])

  const initStyle = {
    width: isActive ? 'auto' : `${width}px`,
    left: isActive ? '200px' : `${posX}px`,
    top: isActive ? '20px' : `${posY}px`,
    zIndex: isActive ? '100' : `${zIndex}`,
    transitionDuration: isMoving ? isActive ? '.3s' : `${speed}s` : '0s',
    position: isActive ? 'fixed' : 'absolute'
  }

  return (
    <div onClick={setActive} key={1} className={`cloud ${isMoving ? 'cloud--is-moving' : ''} ${isActive ? 'cloud--is-active' : ''}`} style={initStyle}>
      <CloudImage2 color={currentColor}/>
      {
        isActive && <div className='cloud-message'>
          <p>
            {text}
          </p>
          <span>{author}</span>
        </div>
      }
    </div>
  )
}

export default Cloud;