import React from 'react' 
const Avatar = ({src, theme}) => {
  return (
      <img src={src}  className='avatar' style={{filter: `${theme ? 'invert(1)' : 'invert(0)'} `}}/>
  )
}

export default Avatar