import React, { useRef, useEffect, useState } from 'react';
import socket from './socket';
import Chat from './Chat';

let peerConnection;

function Viewer() {
  const videoRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    function joinAsWatcher() {
      console.log('Emitting watcher');
      socket.emit('watcher');
    }
    joinAsWatcher();

    socket.on('broadcaster', () => {
      console.log('Received broadcaster event, joining as watcher again');
      joinAsWatcher();
    });

    socket.on('offer', async (id, description) => {
      console.log('Received offer from broadcaster', id);
      if (peerConnection) {
        console.log('Closing old peerConnection');
        peerConnection.close();
        peerConnection = null;
      }
      peerConnection = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' }
        ]
      });

      peerConnection.ontrack = (event) => {
        console.log('Received track event', event);
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
          console.log('Set video srcObject');
        }
        setConnected(true);
      };

      await peerConnection.setRemoteDescription(description);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit('answer', id, peerConnection.localDescription);

      peerConnection.onicecandidate = event => {
        if (event.candidate) {
          socket.emit('candidate', id, event.candidate);
        }
      };
    });

    socket.on('candidate', (id, candidate) => {
      console.log('Received candidate', candidate);
      peerConnection && peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    });

    socket.on('disconnectPeer', () => {
      console.log('Received disconnectPeer');
      if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
      }
      setConnected(false);
    });

    window.onunload = window.onbeforeunload = () => {
      socket.close();
    };

    return () => {
      socket.off('offer');
      socket.off('candidate');
      socket.off('disconnectPeer');
      socket.off('broadcaster');
    };
  }, []);

  return (
    <div>
      <h3>Viewer Mode</h3>
      <div style={{ position: 'relative', width: '100%', minHeight: 200, background: '#222', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 4px 24px #0002', marginBottom: 8 }}>
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
        <video ref={videoRef} autoPlay playsInline controls style={{ width: '100%', maxHeight: 240, borderRadius: 8, background: '#000' }} />
        {!connected && <span style={{ position: 'absolute' }}>Waiting for broadcast...</span>}
      </div>
      <Chat username="Viewer" />
    </div>
  );
}

export default Viewer; 