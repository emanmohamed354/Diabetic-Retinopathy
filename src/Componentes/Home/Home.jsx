import React, { useContext } from 'react';
import { mediaContext } from '../../Context/MediaStore';
import styles from './home.module.scss';

export default function Home() {
  const { userData, LogOut } = useContext(mediaContext);

  return (
    <div className={styles.homeContainer}>
      <div className={styles.header}>
        <h1>Welcome, {userData?.userName || 'User'}!</h1>
        <button onClick={LogOut} className={styles.logoutBtn}>
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
      <div className={styles.content}>
        <h2>Your Healthcare Dashboard</h2>
        <p>Access your medical records, appointments, and more.</p>
      </div>
    </div>
  );
}