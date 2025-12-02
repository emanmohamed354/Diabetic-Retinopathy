import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { patientAPI } from '../../../../services/patientAPI';
import { toast } from 'react-toastify';
import styles from './patientForm.module.scss';

const validationSchema = Yup.object({
  name: Yup.string().required('Patient name is required').min(2, 'Name too short'),
  age: Yup.number()
    .required('Age is required')
    .min(1, 'Age must be positive')
    .max(120, 'Invalid age'),
  gender: Yup.string().required('Gender is required'),
  diabetesType: Yup.string().required('Diabetes type is required'),
  email: Yup.string().email('Invalid email'),
  phone: Yup.string().matches(/^[0-9]{10,15}$|^$/, 'Invalid phone number'),
  medicalHistory: Yup.string()
});

export default function PatientForm({ patient, onSubmit, onClose }) {
  const [existingPatients, setExistingPatients] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExistingPatients();
  }, []);

  const fetchExistingPatients = async () => {
    try {
      const response = await patientAPI.getDoctorPatients();
      setExistingPatients(response.data.patients || []);
    } catch (error) {
      console.error('Failed to fetch patients:', error);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: patient?.name || '',
      age: patient?.age || '',
      gender: patient?.gender || 'male',
      diabetesType: patient?.diabetesType || 'type2',
      email: patient?.email || '',
      phone: patient?.phone || '',
      medicalHistory: patient?.medicalHistory || '',
      medications: patient?.medications?.join(', ') || ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        // Check if patient already exists (for new patients only)
        if (!patient) {
          const existingPatient = existingPatients.find(
            p => p.name.toLowerCase() === values.name.toLowerCase() && 
                 p.age === parseInt(values.age)
          );
          
          if (existingPatient) {
            toast.error(`Patient "${values.name}" (Age ${values.age}) already exists!`);
            setLoading(false);
            return;
          }
        }

        await onSubmit({
          ...values,
          age: parseInt(values.age),
          medications: values.medications
            .split(',')
            .map(m => m.trim())
            .filter(m => m)
        });
      } finally {
        setLoading(false);
      }
    }
  });

  const handleNameChange = (e) => {
    const value = e.target.value;
    formik.setFieldValue('name', value);

    if (value.trim().length > 0) {
      const filtered = existingPatients.filter(p =>
        p.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSelectPatient = (selectedPatient) => {
    formik.setValues({
      name: selectedPatient.name,
      age: selectedPatient.age,
      gender: selectedPatient.gender,
      diabetesType: selectedPatient.diabetesType,
      email: selectedPatient.email || '',
      phone: selectedPatient.phone || '',
      medicalHistory: selectedPatient.medicalHistory || '',
      medications: selectedPatient.medications?.join(', ') || ''
    });
    setShowSuggestions(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            <i className={`fas fa-${patient ? 'edit' : 'user-plus'}`}></i>
            {patient ? 'Edit Patient' : 'Add New Patient'}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            {/* Patient Name with Autocomplete */}
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>
                Patient Name <span className={styles.required}>*</span>
              </label>
              <div className={styles.autocompleteWrapper}>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={handleNameChange}
                  onBlur={formik.handleBlur}
                  placeholder="Start typing patient name..."
                  className={formik.errors.name && formik.touched.name ? styles.error : ''}
                  autoComplete="off"
                />
                <i className="fas fa-search"></i>

                {/* Suggestions Dropdown */}
                {showSuggestions && filteredPatients.length > 0 && (
                  <div className={styles.suggestions}>
                    <div className={styles.suggestionsHeader}>
                      <span className={styles.suggestionsTitle}>
                        Select existing patient:
                      </span>
                    </div>
                    {filteredPatients.map((existingPatient) => (
                      <div
                        key={existingPatient._id}
                        className={styles.suggestionItem}
                        onClick={() => handleSelectPatient(existingPatient)}
                      >
                        <div className={styles.suggestionName}>
                          {existingPatient.name}
                        </div>
                        <div className={styles.suggestionMeta}>
                          <span className={styles.age}>{existingPatient.age} years</span>
                          <span className={styles.type}>
                            {existingPatient.diabetesType === 'type1' ? 'Type 1' :
                             existingPatient.diabetesType === 'type2' ? 'Type 2' :
                             'Gestational'}
                          </span>
                          <span className={styles.analyses}>
                            {existingPatient.totalAnalyses} analyses
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {formik.errors.name && formik.touched.name && (
                <span className={styles.errorMsg}>{formik.errors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Age <span className={styles.required}>*</span></label>
              <input
                type="number"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="1"
                max="120"
                className={formik.errors.age && formik.touched.age ? styles.error : ''}
              />
              {formik.errors.age && formik.touched.age && (
                <span className={styles.errorMsg}>{formik.errors.age}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Gender <span className={styles.required}>*</span></label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Diabetes Type <span className={styles.required}>*</span></label>
              <select
                name="diabetesType"
                value={formik.values.diabetesType}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              >
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
                <option value="gestational">Gestational</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="patient@example.com"
                className={formik.errors.email && formik.touched.email ? styles.error : ''}
              />
              {formik.errors.email && formik.touched.email && (
                <span className={styles.errorMsg}>{formik.errors.email}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Phone</label>
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="1234567890"
                className={formik.errors.phone && formik.touched.phone ? styles.error : ''}
              />
              {formik.errors.phone && formik.touched.phone && (
                <span className={styles.errorMsg}>{formik.errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Medical History</label>
              <textarea
                name="medicalHistory"
                value={formik.values.medicalHistory}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Any relevant medical history..."
                rows="3"
              />
            </div>

            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>Medications</label>
              <textarea
                name="medications"
                value={formik.values.medications}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Separate medications with commas..."
                rows="2"
              />
            </div>
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className={`fas fa-${patient ? 'save' : 'plus'}`}></i>
                  {patient ? 'Update Patient' : 'Add Patient'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}