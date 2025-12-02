import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { diabeticAPI } from '../../../services/diabeticAPI';
import { patientAPI } from '../../../services/patientAPI';
import styles from './imageUpload.module.scss';

export default function ImageUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [showAddPatientForm, setShowAddPatientForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    age: '',
    gender: 'male',
    diabetesType: 'type2'
  });

  useEffect(() => {
    fetchPatients();
  }, []);

const fetchPatients = async () => {
  setPatientsLoading(true);
  try {
    const response = await patientAPI.getDoctorPatients();
    setPatients(response.data.patients || []);
    if (response.data.patients?.length > 0) {
      setSelectedPatientId(response.data.patients[0]._id);
      setShowAddPatientForm(false);
    } else {
      setShowAddPatientForm(true);
    }
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    setShowAddPatientForm(true);
  } finally {
    setPatientsLoading(false); // ✅ CHANGED FROM true TO false
  }
};

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    
    if (!selectedFile) return;
    
    if (!selectedFile.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }
    
    setFile(selectedFile);
    
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleFileSelect({ target: { files: [droppedFile] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleAddNewPatient = async () => {
    if (!patientInfo.name || !patientInfo.age) {
      toast.error('Please fill in patient information');
      return;
    }

    setLoading(true);
    try {
      const response = await patientAPI.createPatient(patientInfo);
      setPatients([...patients, response.data.patient]);
      setSelectedPatientId(response.data.patient._id);
      setPatientInfo({ name: '', age: '', gender: 'male', diabetesType: 'type2' });
      setShowAddPatientForm(false);
      toast.success('✅ Patient created successfully');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please upload a retinal image');
      return;
    }
    
    if (!selectedPatientId) {
      toast.error('Please select or create a patient');
      return;
    }
    
    setLoading(true);
    
    try {
      toast.info('🔬 Analyzing image...');
      
      // Analyze image
      const analysis = await diabeticAPI.analyzeImage(file);
      
      // Save analysis to backend
      await patientAPI.saveAnalysis({
        patientId: selectedPatientId,
        filename: file.name,
        rawScore: parseFloat(analysis.rawScore),
        predictedClass: analysis.predictedClass,
        confidence: analysis.confidence,
        label: analysis.label,
        severity: analysis.severity,
        description: analysis.description,
        color: analysis.color,
        icon: analysis.icon,
        recommendations: analysis.recommendations,
        followUp: analysis.followUp,
        imagePath: file.name
      });
      
      setResult(analysis);
      
      if (analysis.predictedClass === 0) {
        toast.success(`✅ ${analysis.label} - No abnormalities detected`);
      } else if (analysis.predictedClass <= 2) {
        toast.warning(`⚠️ ${analysis.label} detected`);
      } else {
        toast.error(`🚨 ${analysis.label} - Urgent attention required!`);
      }
      
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const handleExport = async () => {
    try {
      const blob = await diabeticAPI.exportReport(result);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DR_Report_${new Date().getTime()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Report exported successfully!');
    } catch (error) {
      toast.error('Failed to export report');
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {/* Patient Selection Section */}
      <div className={styles.patientSelectionSection}>
        <h3>
          <i className="fas fa-user-check"></i>
          Select Patient
        </h3>
        
        {patientsLoading ? (
          <div className={styles.loadingState}>
            <i className="fas fa-spinner fa-spin"></i>
            Loading patients...
          </div>
        ) : patients.length === 0 ? (
          <div className={styles.noPatients}>
            <i className="fas fa-inbox"></i>
            <p>No patients found. Create one first.</p>
          </div>
        ) : (
          <div className={styles.patientSelector}>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className={styles.patientSelect}
            >
              <option value="">-- Select a Patient --</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} - {p.age} years old ({p.diabetesType === 'type1' ? 'Type 1' : p.diabetesType === 'type2' ? 'Type 2' : 'Gestational'})
                </option>
              ))}
            </select>
          </div>
        )}

        <button 
          className={styles.addNewPatientBtn}
          onClick={() => setShowAddPatientForm(!showAddPatientForm)}
        >
          <i className="fas fa-user-plus"></i>
          {showAddPatientForm ? 'Cancel' : 'Add New Patient'}
        </button>
      </div>

      {/* Add New Patient Form */}
      {showAddPatientForm && (
        <div className={styles.addPatientForm}>
          <h4>
            <i className="fas fa-user-plus"></i>
            Create New Patient
          </h4>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Patient Name <span className={styles.required}>*</span></label>
              <input
                type="text"
                placeholder="Enter patient name"
                value={patientInfo.name}
                onChange={(e) => setPatientInfo({...patientInfo, name: e.target.value})}
                className={styles.input}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Age <span className={styles.required}>*</span></label>
              <input
                type="number"
                placeholder="Enter age"
                value={patientInfo.age}
                onChange={(e) => setPatientInfo({...patientInfo, age: e.target.value})}
                min="1"
                max="120"
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Gender</label>
              <select
                value={patientInfo.gender}
                onChange={(e) => setPatientInfo({...patientInfo, gender: e.target.value})}
                className={styles.select}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Diabetes Type</label>
              <select
                value={patientInfo.diabetesType}
                onChange={(e) => setPatientInfo({...patientInfo, diabetesType: e.target.value})}
                className={styles.select}
              >
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="gestational">Gestational</option>
              </select>
            </div>
          </div>

          <button 
            className={styles.createPatientBtn}
            onClick={handleAddNewPatient}
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating...
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i>
                Create Patient
              </>
            )}
          </button>
        </div>
      )}

      {/* Image Upload Section */}
      {selectedPatientId && !showAddPatientForm && (
        <>
          <div className={styles.uploadSection}>
            <h3>
              <i className="fas fa-camera-retro"></i>
              Retinal Image Upload
            </h3>
            
            {!preview ? (
              <div 
                className={styles.dropzone}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input
                  type="file"
                  id="fileInput"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                />
                <label htmlFor="fileInput" className={styles.dropzoneLabel}>
                  <div className={styles.uploadIcon}>
                    <i className="fas fa-cloud-upload-alt"></i>
                  </div>
                  <h4>Drop image here or click to browse</h4>
                  <p>Supports: JPG, PNG, JPEG (Max 10MB)</p>
                  <div className={styles.modelBadge}>
                    <i className="fas fa-brain"></i>
                    <span>AI-Powered Analysis</span>
                  </div>
                </label>
              </div>
            ) : (
              <div className={styles.preview}>
                <img src={preview} alt="Retinal preview" />
                <button 
                  type="button"
                  onClick={handleReset} 
                  className={styles.removeBtn}
                  title="Remove image"
                >
                  <i className="fas fa-times"></i>
                </button>
                <div className={styles.imageInfo}>
                  <span className={styles.fileName}>{file.name}</span>
                  <span className={styles.fileSize}>
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button 
              onClick={handleAnalyze}
              disabled={loading || !file}
              className={styles.analyzeBtn}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-search-plus"></i>
                  Analyze Image
                </>
              )}
            </button>
            
            {result && (
              <button onClick={handleReset} className={styles.resetBtn}>
                <i className="fas fa-redo"></i>
                New Analysis
              </button>
            )}
          </div>

          {result && (
            <div className={styles.results}>
              <div className={styles.resultsHeader}>
                <h3>
                  <i className="fas fa-chart-line"></i>
                  Analysis Results
                </h3>
                <span className={styles.reportId}>Report ID: {result.reportId}</span>
              </div>

              <div className={`${styles.diagnosisCard} ${styles[result.color]}`}>
                <div className={styles.diagnosisHeader}>
                  <div className={styles.diagnosisIcon}>
                    <i className={`fas fa-${result.icon}`}></i>
                  </div>
                  <div className={styles.diagnosisInfo}>
                    <h4>{result.label}</h4>
                    <p>{result.description}</p>
                  </div>
                </div>
                
                <div className={styles.metrics}>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Severity</span>
                    <span className={styles.metricValue}>{result.severity}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Class</span>
                    <span className={styles.metricValue}>{result.predictedClass}</span>
                  </div>
                  <div className={styles.metric}>
                    <span className={styles.metricLabel}>Score</span>
                    <span className={styles.metricValue}>{result.rawScore}</span>
                  </div>
                </div>

                <div className={styles.confidenceSection}>
                  <div className={styles.confidenceHeader}>
                    <span>Confidence Level</span>
                    <span className={styles.confidenceValue}>{result.confidence}%</span>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progress}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.recommendations}>
                <h4>
                  <i className="fas fa-stethoscope"></i>
                  Clinical Recommendations
                </h4>
                <ul className={styles.recommendationsList}>
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>
                      <i className="fas fa-check-circle"></i>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button onClick={handleExport} className={styles.exportBtn}>
                <i className="fas fa-download"></i>
                Export Report
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}