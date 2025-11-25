import React from 'react';
import styles from './formWrapper.module.scss';

export default function FormWrapper({ 
  icon, 
  title, 
  subtitle, 
  children, 
  onSubmit,
  currentStep,
  totalSteps 
}) {
  return (
    <div className={styles.formContent}>
      <div className={styles.formHeader}>
        <div className={styles.iconBox}>
          <i className={icon}></i>
        </div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
        {totalSteps && (
          <div className={styles.stepIndicator}>
            {[...Array(totalSteps)].map((_, index) => (
              <div 
                key={index} 
                className={`${styles.step} ${index + 1 === currentStep ? styles.active : ''} ${index + 1 < currentStep ? styles.completed : ''}`}
              />
            ))}
          </div>
        )}
      </div>
      <form onSubmit={onSubmit} className={styles.form}>
        {children}
      </form>
    </div>
  );
}