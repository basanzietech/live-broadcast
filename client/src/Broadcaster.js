import React, { useRef, useState, useEffect } from 'react';
import socket from './socket';
import Chat from './Chat';

let peerConnections = {};

function Broadcaster() {
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [broadcasting, setBroadcasting] = useState(false);

  const startBroadcast = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setStream(mediaStream);
      setBroadcasting(true);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      socket.emit('broadcaster');
    } catch (err) {
      alert('Could not access camera/mic: ' + err.message);
    }
  };

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  useEffect(() => {
    socket.on('watcher', async (id) => {
      if (!stream) return;
      if (peerConnections[id]) {
        console.log('PeerConnection for watcher', id, 'already exists. Skipping creation.');
        return;
      }
      const peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });
      peerConnections[id] = peerConnection;
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
        }
      };

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit('offer', id, peerConnection.localDescription);
    });

    socket.on('answer', (id, description) => {
      peerConnections[id].setRemoteDescription(description);
    });

    socket.on('candidate', (id, candidate) => {
      peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('disconnectPeer', id => {
      if (peerConnections[id]) {
        peerConnections[id].close();
        delete peerConnections[id];
      }
    });

    window.onunload = window.onbeforeunload = () => {
      socket.close();
    };

    return () => {
      socket.off('watcher');
      socket.off('answer');
      socket.off('candidate');
      socket.off('disconnectPeer');
    };
    // eslint-disable-next-line
  }, [stream]);

  return (
    <div>
      <button onClick={startBroadcast} disabled={broadcasting} style={{ padding: '8px 16px', borderRadius: 4, background: '#43a047', color: '#fff', border: 'none', marginBottom: 10 }}>
        {broadcasting ? 'Broadcasting...' : 'Start Broadcast'}
      </button>
      <div style={{ position: 'relative', width: '100%', minHeight: 200, background: '#222', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 24px #0002', marginBottom: 8 }}>
        <span style={{
          position: 'absolute',
          top: 12,
          left: 16,
          background: 'linear-gradient(90deg,#ff1744,#ff9100)',
          color: '#fff',
          borderRadius: 16,
          padding: '4px 16px',
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: 2,
          boxShadow: '0 2px 8px #ff174433',
          animation: 'livePulse 1.2s infinite alternate',
          zIndex: 2
        }}>
          LIVE
        </span>
        <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', maxHeight: 240, borderRadius: 8, background: '#000' }} />
      </div>
      <Chat username="Broadcaster" />
    </div>
  );
}

export default Broadcaster; 