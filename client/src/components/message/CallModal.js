import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Avatar from '../Avatar'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import {addMessage} from '../../redux/actions/messageAction'


const CallModal = () => {
      const auth = useSelector((state) => state.auth)
      const call = useSelector((state) => state.call)
      const peer = useSelector((state) => state.peer)
      const socket = useSelector((state) => state.socket)
      const dispatch = useDispatch()

      const [hours, setHours] = useState(0)
      const [mins, setMins] = useState(0)
      const [second, setSecond] = useState(0)
      const [total, setTotal] = useState(0)

      const youVideo = useRef()
      const otherVideo = useRef()
      const [tracks, setTracks] = useState(null)
      const [answer, setAnswer] = useState(false)


      // Timer setup
      useEffect(() => {
            const setTime = () => {
                  setTotal((t) => t + 1)
            }
            const timer = setInterval(setTime, 1000)
            return () => clearInterval(timer)
      }, [])

      useEffect(() => {
            setSecond(total % 60)
            setMins(parseInt(total / 60))
            setHours(parseInt(total / 3600))
      }, [total])

      // End Call Handler
      const addCallMessage = useCallback((call, times) => {
            if(call.recipient !== auth.user._id){
                  const msg = {
                        sender: call.sender,
                        recipient: call.recipient,
                        text: '', 
                        media: [],
                        call: {video: call.video, times},
                        createdAt: new Date().toISOString()
                  }
                  dispatch(addMessage({msg, auth, socket}))
            }
            
      },[auth, dispatch, socket])
      const handleEndCall = () => {
            tracks && tracks.forEach(track => track.stop())
            let times = answer ?  total : 0
            socket.emit('endCall', {...call, times})

            addCallMessage(call, times)
            dispatch({ type: GLOBALTYPES.CALL, payload: null })
      }

      useEffect(() => {
            if (answer) {
                  setTotal(0)
            } else {
                  const timer = setTimeout(() => {
                        socket.emit('endCall', {...call, times: 0})
                        addCallMessage(call, 0)
                        dispatch({ type: GLOBALTYPES.CALL, payload: null })
                  }, 15000)
                  return () => clearTimeout(timer)
            }
      }, [dispatch, answer,call, socket, tracks,addCallMessage])

      useEffect(() => {
            socket.on('endCallToClient', data => {
                  tracks && tracks.forEach(track => track.stop())
                  addCallMessage(data, data.times)
                  dispatch({ type: GLOBALTYPES.CALL, payload: null })
            })
            return () => socket.off('endCallToClient')
      }, [socket, dispatch,tracks, addCallMessage])

      // Open Stream
      const openStream = (video) => {
            const config = { audio: true, video }
            return navigator.mediaDevices.getUserMedia(config)
      }

      const playStream = (tag, stream) => {
            let video = tag
            video.srcObject = stream
            video.play()
      }

      // Answer Call
      const handleAnswer = () => {
            openStream(call.video).then(stream => {
                  playStream(youVideo.current, stream)
                  const track = stream.getTracks()
                  setTracks(track)
                  const newCall = peer.call(call.peerId, stream)
                  newCall.on('stream', function(remoteStream) {
                  playStream(otherVideo.current, remoteStream)
                  })
                  setAnswer(true)
            })
      }

      useEffect(() => {
            peer.on('call', (newCall) => {
                  openStream(call.video).then((stream) => {
                  if (youVideo.current) {
                        playStream(youVideo.current, stream)
                  }
                  const track = stream.getTracks()
                  setTracks(track)
                  newCall.answer(stream)
                  newCall.on('stream', function(remoteStream) {
                        if (otherVideo.current) {
                              playStream(otherVideo.current, remoteStream)
                        }
                  })
                  setAnswer(true)
                  })
            })
            return () => {
                  peer.removeListener('call')
            }
      }, [peer, call.video])

      // disconnect
      useEffect(() => {
        socket.on('callerDisconnect',  () => {
            tracks && tracks.forEach(track => track.stop())
            dispatch({ type: GLOBALTYPES.CALL, payload: null })
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: 'Người dùng ngắt kết nối!'} })
        })
        return () => socket.off('callerDisconnect')
      }, [socket,tracks, dispatch])
      
      return (
            <div className='call_modal'>
                  <div className='call_box' style={{
                        display : (answer && call.video) ? 'none' : 'flex'
                  }}>
                        <div className='text-center p-4'>
                              <Avatar src={call.avatar} size='supper-avatar' />
                              <h4>{call.username}</h4>
                              {answer 
                                    ? <div> 
                                    <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                                    <span>:</span>
                                    <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                                    <span>:</span>
                                    <span>{second.toString().length < 2 ? '0' + second : second}</span>
                                    </div>
                                    : <div>
                                    {call.video ? <span> Đang gọi video...</span> : <span> Đang gọi thoại...</span>}
                                    </div>
                              }
                        </div>
                        {!answer && 
                              <div className='timer'>
                                    <small>{mins.toString().length < 2 ? '0' + mins : mins}</small>
                                    <small>:</small>
                                    <small>{second.toString().length < 2 ? '0' + second : second}</small>
                              </div>
                        }
                  
                        <div className='call_menu'>
                              <span className='material-icons text-danger' onClick={handleEndCall}>
                                    call_end
                              </span>
                              {(call.recipient === auth.user._id && !answer) && 
                                    <>
                                    {call.video 
                                          ? <span className='material-icons text-success' onClick={handleAnswer}>
                                                videocam
                                          </span>
                                          : <span className='material-icons text-success' onClick={handleAnswer}>
                                                call
                                          </span>
                                    }
                                    </>
                              }
                        </div>
                  </div>
                  <div className='show_video' style={{ opacity: (answer && call.video) ? '1' : '0' }}>
                        <video ref={youVideo} className='you_video' />
                        <video ref={otherVideo} className='other_video' />

                        <div className='time_video'> 
                              <span>{hours.toString().length < 2 ? '0' + hours : hours}</span>
                              <span>:</span>
                              <span>{mins.toString().length < 2 ? '0' + mins : mins}</span>
                              <span>:</span>
                              <span>{second.toString().length < 2 ? '0' + second : second}</span>
                        </div>

                        <span className='material-icons text-danger end_call' onClick={handleEndCall}>
                              call_end
                        </span>
                  </div>
            </div>
      )
}

export default CallModal
