import React from 'react'
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWebRTC } from '../../hooks/useWebRTC';
import styles from './Room.module.css';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react';
import { getRoom } from '../../http';

const Room = () => {

  const { id: roomId } = useParams();
  const { user } = useSelector((state) => state.auth);

  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

  const [room, setRoom] = useState(null)

  const history = useHistory();

  const [isMute, setMute] = useState(true);

  useEffect(() => {

    handleMute(isMute, user.id);

  }, [isMute])



  const handleManualLeave = () => {

    history.push('/rooms');
  }

  useEffect(() => {

    const fetchRoom = async () => {

      const { data } = await getRoom(roomId);

      setRoom((prev) => data);
    }

    fetchRoom();

  }, [roomId])

  const handleMuteClick = (clientId) => {

    if (clientId !== user.id) return;



    setMute((isMute) => !isMute)

  }

  //console.log("namm",user);
  return (
    <div>
      <div className="container">
        <button className={styles.goBack} onClick={handleManualLeave}>
          <img src="/images/arrow-left.png" alt="arrow-left" />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/palm.png" alt="palm-icon" />
            </button>
            <button className={styles.actionBtn} onClick={handleManualLeave}>
              <img src="/images/win.png" alt="win-icon" />
              <span>Leave quitely</span>
            </button>
          </div>
        </div>
        <div className={styles.clientsList}>
          {
            clients.map((client) => {
              return (
                <div key={client.id} className={styles.client}>
                  <div className={styles.userHead}>
                    <audio ref={(instance) => provideRef(instance, client.id)}
                      autoPlay></audio>
                    <img src={client.avatar} alt="avatar" className={styles.userAvatar} />
                    <button onClick={() => handleMuteClick(client.id)} className={styles.micBtn}>
                      {
                        client.muted ? (<img src="/images/mic-mute.png" alt="mic-mute-icon" />)
                          : (<img src="/images/mic.png" alt="mic-icon" />)
                      }
                    </button>
                  </div>
                  <h4>{client.name}</h4>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>

  )
}

export default Room