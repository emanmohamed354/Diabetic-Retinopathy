import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { patientAPI } from '../../../../services/patientAPI';
import styles from './analysisHistoryModal.module.scss';

export default function AnalysisHistoryModal({ patient, onClose }) {
  console.log('===== AnalysisHistoryModal MOUNTED =====');
  console.log('Props received:', { patient, onClose });
  
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnalysis, setSelectedAnalysis] = useState(null);

  useEffect(() => {
    console.log('AnalysisHistoryModal useEffect triggered');
    console.log('patient:', patient);
    console.log('patient._id:', patient?._id);
    
    if (patient?._id) {
      console.log('Calling fetchHistory...');
      fetchHistory();
    } else {
      console.error('No patient._id found!');
    }
  }, [patient]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      console.log('Fetching history for patient:', patient._id); // Debug
      const response = await patientAPI.getPatientAnalysisHistory(patient._id);
      console.log('History response:', response); // Debug
      setAnalysisHistory(response.data.analyses || []);
    } catch (error) {
      console.error('Failed to load analysis history:', error);
      toast.error('Failed to load analysis history');
      setAnalysisHistory([]); // Set empty array on error
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

  const getDRLevelIcon = (level) => {
    switch(level) {
      case 0: return 'fa-check-circle';
      case 1: return 'fa-info-circle';
      case 2: return 'fa-exclamation-circle';
      case 3:
      case 4: return 'fa-exclamation-triangle';
      default: return 'fa-question-circle';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleToggleDetails = (idx) => {
    setSelectedAnalysis(selectedAnalysis === idx ? null : idx);
  };

  // Prevent modal from closing when clicking inside
  const handleModalClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={handleModalClick}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <h2>
              <i className="fas fa-history"></i>
              Analysis History
            </h2>
            <p className={styles.patientName}>
              <i className="fas fa-user"></i>
              {patient?.name || 'Unknown'} • {patient?.age || 'N/A'} years • 
              {patient?.diabetesType === 'type1' ? ' Type 1' : 
               patient?.diabetesType === 'type2' ? ' Type 2' : ' Gestational'}
            </p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button">
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Content */}
        <div className={styles.modalContent}>
          {loading ? (
            <div className={styles.loadingState}>
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading history...</p>
            </div>
          ) : analysisHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-inbox"></i>
              <h3>No Analysis Records</h3>
              <p>This patient hasn't had any retinopathy analyses yet.</p>
            </div>
          ) : (
            <>
              {/* Summary Stats */}
              <div className={styles.summaryBar}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>{analysisHistory.length}</span>
                  <span className={styles.summaryLabel}>Total Analyses</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>
                    {analysisHistory.filter(a => a.predictedClass === 0).length}
                  </span>
                  <span className={styles.summaryLabel}>Normal</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>
                    {analysisHistory.filter(a => a.predictedClass >= 3).length}
                  </span>
                  <span className={styles.summaryLabel}>High Risk</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryValue}>
                    {analysisHistory[0] ? formatDate(analysisHistory[0].timestamp).split(',')[0] : 'N/A'}
                  </span>
                  <span className={styles.summaryLabel}>Latest</span>
                </div>
              </div>

              {/* Timeline View */}
              <div className={styles.timeline}>
                {analysisHistory.map((analysis, idx) => (
                  <div 
                    key={analysis._id || idx} 
                    className={`${styles.timelineItem} ${selectedAnalysis === idx ? styles.selected : ''}`}
                    onClick={() => handleToggleDetails(idx)}
                  >
                    <div className={`${styles.timelineIcon} ${styles[getDRLevelColor(analysis.predictedClass)]}`}>
                      <i className={`fas ${getDRLevelIcon(analysis.predictedClass)}`}></i>
                    </div>
                    
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineHeader}>
                        <span className={`${styles.badge} ${styles[getDRLevelColor(analysis.predictedClass)]}`}>
                          {analysis.label || `Class ${analysis.predictedClass}`}
                        </span>
                        <span className={styles.date}>
                          <i className="fas fa-calendar"></i>
                          {formatDate(analysis.timestamp)}
                        </span>
                      </div>
                      
                      <div className={styles.timelineDetails}>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Severity:</span>
                          <span className={styles.detailValue}>{analysis.severity || 'N/A'}</span>
                        </div>
                        <div className={styles.detailItem}>
                          <span className={styles.detailLabel}>Confidence:</span>
                          <span className={styles.detailValue}>
                            <div className={styles.confidenceBar}>
                              <div 
                                className={styles.confidenceFill} 
                                style={{ width: `${analysis.confidence || 0}%` }}
                              ></div>
                            </div>
                            {analysis.confidence || 0}%
                          </span>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {selectedAnalysis === idx && (
                        <div className={styles.expandedDetails}>
                          {analysis.recommendations && analysis.recommendations.length > 0 && (
                            <div className={styles.recommendations}>
                              <h4>
                                <i className="fas fa-clipboard-list"></i>
                                Recommendations
                              </h4>
                              <ul>
                                {analysis.recommendations.map((rec, i) => (
                                  <li key={i}>{rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {analysis.imageUrl && (
                            <div className={styles.imagePreview}>
                              <h4>
                                <i className="fas fa-image"></i>
                                Analyzed Image
                              </h4>
                              <img src={analysis.imageUrl} alt="Retinal scan" />
                            </div>
                          )}

                          {analysis.notes && (
                            <div className={styles.notes}>
                              <h4>
                                <i className="fas fa-sticky-note"></i>
                                Notes
                              </h4>
                              <p>{analysis.notes}</p>
                            </div>
                          )}

                          {!analysis.recommendations?.length && !analysis.imageUrl && !analysis.notes && (
                            <p className={styles.noExtra}>No additional details available.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className={styles.expandIcon}>
                      <i className={`fas fa-chevron-${selectedAnalysis === idx ? 'up' : 'down'}`}></i>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <button className={styles.closeActionBtn} onClick={onClose} type="button">
            <i className="fas fa-times"></i>
            Close
          </button>
          {analysisHistory.length > 0 && (
            <button 
              className={styles.exportBtn} 
              onClick={() => toast.info('Export feature coming soon!')}
              type="button"
            >
              <i className="fas fa-download"></i>
              Export History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}