import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from './authLayout.module.scss';

export default function AuthLayout() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.backgroundLayer}>
        <div className={styles.overlay}></div>
        <div className={styles.circleDecoration}>
          <div className={styles.circle1}></div>
          <div className={styles.circle2}></div>
          <div className={styles.circle3}></div>
        </div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.brandInfo}>
            <div className={styles.logo}>
              <i className="fas fa-heartbeat"></i>
              <span>MediCare</span>
            </div>
            <h1>Your Health, Our Priority</h1>
            <p>Experience seamless healthcare management with our advanced platform</p>
            
            <div className={styles.features}>
              <div className={styles.featureItem}>
                <i className="fas fa-shield-alt"></i>
                <div>
                  <h3>Secure</h3>
                  <p>Your data is protected</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <i className="fas fa-clock"></i>
                <div>
                  <h3>24/7 Access</h3>
                  <p>Always available</p>
                </div>
              </div>
              <div className={styles.featureItem}>
                <i className="fas fa-user-md"></i>
                <div>
                  <h3>Expert Care</h3>
                  <p>Professional support</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.formCard}>
            <Outlet /> 
          </div>
        </div>
      </div>
    </div>
  );
}