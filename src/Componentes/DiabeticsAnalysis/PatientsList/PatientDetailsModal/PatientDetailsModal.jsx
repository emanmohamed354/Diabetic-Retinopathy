import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { patientAPI } from '../../../../services/patientAPI';
import styles from './patientDetailsModal.module.scss';

export default function PatientDetailsModal({ patient, onClose, onEdit }) {
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatientData();
  }, [patient]);

  const fetchPatientData = async () => {
    setLoading(true);
    try {
      const [historyResponse, statsResponse] = await Promise.all([
        patientAPI.getPatientAnalysisHistory(patient._id),
        patientAPI.getPatientStats(patient._id)
      ]);
      setAnalysisHistory(historyResponse.data.analyses || []);
      setStats(statsResponse.data.stats);
    } catch (error) {
      toast.error('Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  const getDRLevelColor = (level) => {
    switch(level) {
      case 0: return 'success';
      case 1: return 'info';
      case 2: return 'warning';
      case 3:
      case 4: return 'error';
      default: return 'gray';
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            <i className="fas fa-user-medical"></i>
            Patient Details
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading patient data...</p>
          </div>
        ) : (
          <div className={styles.modalContent}>
            {/* Patient Info */}
            <div className={styles.section}>
              <h3>
                <i className="fas fa-user"></i>
                Basic Information
              </h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Name</span>
                  <span className={styles.value}>{patient.name}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Age</span>
                  <span className={styles.value}>{patient.age} years</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Gender</span>
                  <span className={styles.value}>
                    {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Diabetes Type</span>
                  <span className={styles.value}>
                    {patient.diabetesType === 'type1' ? 'Type 1' : 
                     patient.diabetesType === 'type2' ? 'Type 2' : 'Gestational'}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Email</span>
                  <span className={styles.value}>{patient.email || 'N/A'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Phone</span>
                  <span className={styles.value}>{patient.phone || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {stats && (
              <div className={styles.section}>
                <h3>
                  <i className="fas fa-chart-bar"></i>
                  Analysis Statistics
                </h3>
                <div className={styles.statsGrid}>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>{stats.totalAnalyses}</div>
                    <div className={styles.statLabel}>Total Analyses</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>{stats.normalCases}</div>
                    <div className={styles.statLabel}>Normal (No DR)</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>{stats.mildCases}</div>
                    <div className={styles.statLabel}>Mild NPDR</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>{stats.moderateCases}</div>
                    <div className={styles.statLabel}>Moderate NPDR</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>{stats.severeCases}</div>
                    <div className={styles.statLabel}>Severe NPDR</div>
                  </div>
                  <div className={styles.statBox}>
                    <div className={styles.statValue}>{stats.proliferativeCases}</div>
                    <div className={styles.statLabel}>Proliferative</div>
                  </div>
                </div>
              </div>
            )}

            {/* Analysis History */}
            <div className={styles.section}>
              <h3>
                <i className="fas fa-history"></i>
                Analysis History
              </h3>
              {analysisHistory.length === 0 ? (
                <div className={styles.emptyHistory}>
                  <i className="fas fa-inbox"></i>
                  <p>No analyses yet</p>
                </div>
              ) : (
                <div className={styles.historyList}>
                  {analysisHistory.map((analysis, idx) => (
                    <div key={idx} className={styles.historyItem}>
                      <div className={styles.historyDate}>
                        {new Date(analysis.timestamp).toLocaleDateString()}
                      </div>
                      <div className={styles.historyContent}>
                        <span className={`${styles.badge} ${styles[getDRLevelColor(analysis.predictedClass)]}`}>
                          {analysis.label}
                        </span>
                        <span className={styles.severity}>{analysis.severity}</span>
                      </div>
                      <div className={styles.historyConfidence}>
                        {analysis.confidence}% confidence
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className={styles.modalActions}>
          <button className={styles.closeActionBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
            Close
          </button>
          <button className={styles.editBtn} onClick={onEdit}>
            <i className="fas fa-edit"></i>
            Edit Patient
          </button>
        </div>
      </div>
    </div>
  );
}