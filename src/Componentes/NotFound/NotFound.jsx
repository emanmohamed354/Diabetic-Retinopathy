import React from 'react';
import { Link } from 'react-router-dom';
import styles from './notFound.module.scss';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <div className={styles.errorCode}>404</div>
        <h1>Page Not Found</h1>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className={styles.homeButton}>
          <i className="fas fa-home"></i>
          Back to Home
        </Link>
      </div>
    </div>
  );
}