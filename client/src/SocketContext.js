import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');

const ContextProvider = function({ children }){
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState({});
    const [name, setName] = useState('');

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(function(){
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(function(currentStream){
                setStream(currentStream);

                myVideo.current.srcObject = currentStream;
            });
        socket.on('me', function(id){ setMe(id)});

        socket.on('calluser', function({from, name: callerName, signal}){
            setCall({ isReceivingCall: true, from, name: callerName, signal })
        });
    }, []);

    const answerCall = function(){
        setCallAccepted(true)

        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on('signal', function(data){
            socket.emit('answercall', { signal: data, to: call.from });
        });

        peer.on('stream', function(currentStream){
            userVideo.current.srcObject = currentStream;
        });
        peer.signal(call.signal);

        connectionRef.current = peer;
    };

    const callUser = function(id){
        const peer = new Peer({ initiator: true, trickle: false, stream });

        peer.on('signal', function(data){
            socket.emit('calluser', { userToCall: id, signalData: data, from: me, name });
        });

        peer.on('stream', function(currentStream){
            userVideo.current.srcObject = currentStream;
        });

        socket.on('callaccepted', function(signal){
            setCallAccepted(true);

            peer.signal(signal);
        })

        connectionRef.current = peer;
    }

    const leaveCall = function(){
        setCallEnded(true);

        connectionRef.current.destroy();

        window.location.reload();
    }

    return(
        <SocketContext.Provider value={{ call, callAccepted, myVideo, userVideo, stream, name, setName, callEnded, me, callUser, leaveCall, answerCall }}>
            { children }
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext };