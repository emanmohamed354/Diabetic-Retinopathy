import React from 'react';
import styles from './deleteConfirmModal.module.scss';

export default function DeleteConfirmModal({ 
  patient, 
  onConfirm, 
  onCancel, 
  loading 
}) {
  return (
    <div className={styles.modalOverlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.iconWrapper}>
          <i className="fas fa-exclamation-circle"></i>
        </div>

        <h2>Delete Patient?</h2>
        
        <p className={styles.message}>
          Are you sure you want to delete <strong>{patient?.name}</strong> 
          {patient?.age && ` (Age ${patient.age})`}?
        </p>

        <div className={styles.warningBox}>
          <i className="fas fa-info-circle"></i>
          <span>
            This action will remove the patient and all associated analysis records 
            from your system. This cannot be undone.
          </span>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.cancelBtn} 
            onClick={onCancel}
            disabled={loading}
          >
            <i className="fas fa-times"></i>
            Keep Patient
          </button>
          
          <button 
            className={styles.deleteBtn} 
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Deleting...
              </>
            ) : (
              <>
                <i className="fas fa-trash"></i>
                Delete Patient
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}