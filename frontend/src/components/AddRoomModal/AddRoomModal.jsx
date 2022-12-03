import React from 'react'
import styles from './AddRoomModal.module.css';
import TextInput from '../shared/TextInput/TextInput';
import { useState } from 'react';
import { createRoom as create } from '../../http';
import { useHistory } from 'react-router-dom'


const AddRoomModal = ({ onClose }) => {

    const history = useHistory();

    const [roomType, setRoomType] = useState("open");

    const [topic, setTopic] = useState('');



    async function createRoom() {

        //server call
        try {
            if (!topic) return;

            console.log("here", topic, roomType);

            const { data } = await create({
                topic, roomType
            });

            history.push(`/room/${data.id}`);



            //console.log(data)

        } catch (err) {
            console.log(err.message)
        }
    }

    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <button onClick={onClose} className={styles.closeButton}>
                    <img src="/images/close.png" alt="close" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.heading}>Enter the topic to be discussed</h3>
                    <TextInput fullWidth="true" value={topic} onChange={(e) => setTopic(e.target.value)} />
                    <h2 className={styles.subHeading}>Room Types</h2>
                    <div className={styles.roomsTypes}>
                        <div className={`${styles.typeBox} ${roomType === 'open' ? styles.active : ''}`} onClick={() => setRoomType('open')}>
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        <div className={`${styles.typeBox} ${roomType === 'social' ? styles.active : ''}`} onClick={() => setRoomType('social')}>
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
                        </div>
                        <div className={`${styles.typeBox} ${roomType === 'private' ? styles.active : ''}`} onClick={() => setRoomType('private')}>
                            <img src="/images/lock.png" alt="lock" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    <h2>Start a room, open to everyone </h2>
                    <button className={styles.footerButton} onClick={createRoom}>
                        <img src="/images/celebration.png" alt="celebration" />
                        <span> Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddRoomModal