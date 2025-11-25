import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { mediaContext } from '../../Context/MediaStore';
import ImageUpload from './ImageUpload/ImageUpload';
import DiabeticInfo from './DiabeticInfo/DiabeticInfo';
import Settings from './Settings/Settings';
import styles from './diabeticsAnalysis.module.scss';

export default function DiabeticsAnalysis() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { LogOut, userData } = useContext(mediaContext);

  const handleLogout = () => {
    LogOut();
    navigate('/auth/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getUserInitials = () => {
    if (userData?.userName && userData?.lastName) {
      return `${userData.userName[0]}${userData.lastName[0]}`.toUpperCase();
    } else if (userData?.userName) {
      return userData.userName.substring(0, 2).toUpperCase();
    }
    return 'DR';
  };

  const getFullName = () => {
    if (userData?.userName && userData?.lastName) {
      return `${userData.userName} ${userData.lastName}`;
    } else if (userData?.userName) {
      return userData.userName;
    }
    return 'Dr. User';
  };

  return (
    <div className={styles.container}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <div className={styles.iconWrapper}>
              <i className="fas fa-eye"></i>
            </div>
            <div className={styles.brandText}>
              <h1>DR Analysis</h1>
              <p>AI-Powered System</p>
            </div>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeTab === 'analysis' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('analysis');
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-microscope"></i>
            <span>Image Analysis</span>
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'info' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('info');
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-book-medical"></i>
            <span>Clinical Guidelines</span>
          </button>
          
          <button
            className={`${styles.navItem} ${activeTab === 'settings' ? styles.active : ''}`}
            onClick={() => {
              setActiveTab('settings');
              setSidebarOpen(false);
            }}
          >
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {getUserInitials()}
            </div>
            <div className={styles.userDetails}>
              <p className={styles.userName}>{getFullName()}</p>
              <p className={styles.userRole}>{userData?.role === 'admin' ? 'Administrator' : 'Ophthalmologist'}</p>
            </div>
          </div>
          
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      </aside>

      <div className={styles.mainContent}>
        <div className={styles.mobileHeader}>
          <button className={styles.menuToggle} onClick={toggleSidebar}>
            <i className="fas fa-bars"></i>
          </button>
          <div className={styles.pageTitle}>
            <h2>
              {activeTab === 'analysis' && 'Image Analysis'}
              {activeTab === 'info' && 'Clinical Guidelines'}
              {activeTab === 'settings' && 'Settings'}
            </h2>
          </div>
        </div>

        {activeTab === 'analysis' && (
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.primary}`}>
                <i className="fas fa-images"></i>
              </div>
              <div className={styles.statValue}>247</div>
              <div className={styles.statLabel}>Total Scans</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.success}`}>
                <i className="fas fa-check-circle"></i>
              </div>
              <div className={styles.statValue}>189</div>
              <div className={styles.statLabel}>Normal Cases</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.warning}`}>
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <div className={styles.statValue}>42</div>
              <div className={styles.statLabel}>Cases Detected</div>
            </div>
            
            <div className={styles.statCard}>
              <div className={`${styles.statIcon} ${styles.info}`}>
                <i className="fas fa-clock"></i>
              </div>
              <div className={styles.statValue}>16</div>
              <div className={styles.statLabel}>Pending Review</div>
            </div>
          </div>
        )}

        <div className={styles.mainSection}>
          {activeTab === 'analysis' && <ImageUpload />}
          {activeTab === 'info' && <DiabeticInfo />}
          {activeTab === 'settings' && <Settings />}
        </div>
      </div>


      <div 
        className={`${styles.overlay} ${sidebarOpen ? styles.active : ''}`}
        onClick={() => setSidebarOpen(false)}
      ></div>
    </div>
  );
}