import React from 'react';
import styles from './errorList.module.scss';

export default function ErrorList({ Formik, type }) {
  return (
    <>
      {Formik.errors[type] && Formik.touched[type] && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          <span>{Formik.errors[type]}</span>
        </div>
      )}
    </>
  );
}