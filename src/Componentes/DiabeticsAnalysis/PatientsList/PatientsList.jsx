import React, { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { mediaContext } from '../../../Context/MediaStore';
import PatientForm from './PatientForm/PatientForm';
import AnalysisHistoryModal from './AnalysisHistoryModal/AnalysisHistoryModal';
import PatientDetailsModal from './PatientDetailsModal/PatientDetailsModal';
import DeleteConfirmModal from './DeleteConfirmModal/DeleteConfirmModal';
import { patientAPI } from '../../../services/patientAPI';
import styles from './patientsList.module.scss';

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [filterDiabetes, setFilterDiabetes] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editingPatient, setEditingPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const { userData } = useContext(mediaContext);
  const [showHistory, setShowHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, [userData]);

  useEffect(() => {
    filterPatients();
  }, [patients, searchTerm, filterGender, filterDiabetes]);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.getDoctorPatients();
      setPatients(response.data.patients || []);
    } catch (error) {
      toast.error('Failed to fetch patients');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewHistory = (patient) => {
    if (!patient || !patient._id) {
      toast.error('Invalid patient data');
      return;
    }
    
    setHistoryPatient(patient);
    setShowHistory(true);
  };

  const filterPatients = () => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.phone?.includes(searchTerm)
      );
    }

    if (filterGender !== 'all') {
      filtered = filtered.filter(p => p.gender === filterGender);
    }

    if (filterDiabetes !== 'all') {
      filtered = filtered.filter(p => p.diabetesType === filterDiabetes);
    }

    setFilteredPatients(filtered);
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleViewDetails = (patient) => {
    setSelectedPatient(patient);
    setShowDetails(true);
  };

  const handleDeleteClick = (patient) => {
    setPatientToDelete(patient);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await patientAPI.deletePatient(patientToDelete._id);
      toast.success(`✅ Patient "${patientToDelete.name}" deleted successfully`);
      fetchPatients();
      setShowDeleteModal(false);
      setPatientToDelete(null);
    } catch (error) {
      toast.error('Failed to delete patient');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingPatient) {
        await patientAPI.updatePatient(editingPatient._id, formData);
        toast.success('✅ Patient updated successfully');
      } else {
        await patientAPI.createPatient(formData);
        toast.success('✅ Patient created successfully');
      }
      fetchPatients();
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const getGenderIcon = (gender) => {
    switch(gender) {
      case 'male': return 'fa-mars';
      case 'female': return 'fa-venus';
      default: return 'fa-user';
    }
  };

  const getDiabetesColor = (type) => {
    switch(type) {
      case 'type1': return 'warning';
      case 'type2': return 'error';
      default: return 'info';
    }
  };

  const getLatestAnalysisStatus = (patient) => {
    if (!patient.latestAnalysis) return null;
    const analysis = patient.latestAnalysis;
    return {
      class: analysis.predictedClass,
      label: analysis.label,
      date: new Date(analysis.timestamp).toLocaleDateString()
    };
  };

  return (
    <div className={styles.patientsContainer}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h2>
            <i className="fas fa-users"></i>
            Patient Management
          </h2>
          <p>Manage and monitor your patients' diabetic retinopathy assessments</p>
        </div>
        <button className={styles.addPatientBtn} onClick={handleAddPatient}>
          <i className="fas fa-user-plus"></i>
          Add New Patient
        </button>
      </div>

      <div className={styles.filtersSection}>
        <div className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <select
            value={filterDiabetes}
            onChange={(e) => setFilterDiabetes(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Diabetes Types</option>
            <option value="type1">Type 1</option>
            <option value="type2">Type 2</option>
            <option value="gestational">Gestational</option>
          </select>
        </div>

        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Total Patients:</span>
            <span className={styles.statValue}>{patients.length}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>Filtered:</span>
            <span className={styles.statValue}>{filteredPatients.length}</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingState}>
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading patients...</p>
        </div>
      ) : filteredPatients.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fas fa-inbox"></i>
          <h3>No Patients Found</h3>
          <p>{patients.length === 0 ? 'Add your first patient to get started' : 'No patients match your filters'}</p>
          <button className={styles.emptyAddBtn} onClick={handleAddPatient}>
            <i className="fas fa-plus"></i>
            Add Patient
          </button>
        </div>
      ) : (
        <div className={styles.patientsGrid}>
          {filteredPatients.map((patient) => {
            const latestAnalysis = getLatestAnalysisStatus(patient);
            return (
              <div key={patient._id} className={styles.patientCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.patientInfo}>
                    <div className={styles.patientAvatar}>
                      <i className={`fas ${getGenderIcon(patient.gender)}`}></i>
                    </div>
                    <div className={styles.patientMeta}>
                      <h3 className={styles.patientName}>{patient.name}</h3>
                      <p className={styles.patientAge}>
                        <i className="fas fa-birthday-cake"></i>
                        {patient.age} years old
                      </p>
                    </div>
                  </div>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleViewDetails(patient)}
                      title="View Details"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      className={styles.actionBtn}
                      onClick={() => handleEditPatient(patient)}
                      title="Edit"
                    >
                      <i className="fas fa-edit"></i>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.delete}`}
                      onClick={() => handleDeleteClick(patient)}
                      title="Delete"
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{patient.email || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Phone:</span>
                    <span className={styles.value}>{patient.phone || 'N/A'}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Diabetes Type:</span>
                    <span className={`${styles.badge} ${styles[getDiabetesColor(patient.diabetesType)]}`}>
                      {patient.diabetesType === 'type1' ? 'Type 1' : 
                       patient.diabetesType === 'type2' ? 'Type 2' : 'Gestational'}
                    </span>
                  </div>
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Total Analyses:</span>
                    <span className={styles.value}>{patient.totalAnalyses || 0}</span>
                  </div>
                </div>

                {latestAnalysis && (
                  <div className={styles.cardFooter}>
                    <div className={styles.analysisInfo}>
                      <span className={styles.analysisLabel}>Latest Analysis:</span>
                      <span className={`${styles.analysisBadge} ${styles[getDiabetesColor(latestAnalysis.class)]}`}>
                        {latestAnalysis.label}
                      </span>
                      <span className={styles.analysisDate}>{latestAnalysis.date}</span>
                    </div>
                  </div>
                )}

                <div className={styles.cardFooterBtn}>
                  <button 
                    className={styles.viewHistoryBtn}
                    onClick={() => handleViewHistory(patient)}
                    type="button"
                  >
                    <i className="fas fa-history"></i>
                    View History ({patient.totalAnalyses || 0})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <PatientForm
          patient={editingPatient}
          onSubmit={handleFormSubmit}
          onClose={() => setShowForm(false)}
        />
      )}

      {showHistory && historyPatient && (
        <AnalysisHistoryModal
          patient={historyPatient}
          onClose={() => {
            setShowHistory(false);
            setHistoryPatient(null);
          }}
        />
      )}

      {showDetails && selectedPatient && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setShowDetails(false)}
          onEdit={() => {
            handleEditPatient(selectedPatient);
            setShowDetails(false);
          }}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          patient={patientToDelete}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            setShowDeleteModal(false);
            setPatientToDelete(null);
          }}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}