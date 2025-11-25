import React, { useState, useContext } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { mediaContext } from '../../../Context/MediaStore';
import { userAPI } from '../../../services/userAPI';
import styles from './settings.module.scss';

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const { userData, saveUserData } = useContext(mediaContext);

  const validationSchema = Yup.object({
    userName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    phone: Yup.string()
      .matches(/^[0-9]{10,15}$/, 'Invalid phone number')
      .required('Phone is required'),
    age: Yup.number()
      .min(18, 'Must be at least 18')
      .max(120, 'Invalid age')
      .required('Age is required'),
    gender: Yup.string().required('Gender is required'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required'),
    password: Yup.string()
      .required('Password is required for verification')
  });

  const formik = useFormik({
    initialValues: {
      userName: userData?.userName || '',
      lastName: userData?.lastName || '',
      phone: userData?.phone || '',
      age: userData?.age || '',
      gender: userData?.gender || 'male',
      street: userData?.address?.street || '',
      city: userData?.address?.city || '',
      state: userData?.address?.state || '',
      country: userData?.address?.country || '',
      password: ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      
      try {
        const updateData = {
          email: userData.email,
          password: values.password,
          userName: values.userName,
          lastName: values.lastName,
          phone: values.phone,
          age: parseInt(values.age),
          gender: values.gender,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            country: values.country
          }
        };

        const response = await userAPI.updateUserData(updateData);
        
        localStorage.setItem('token', response.token);
        saveUserData();
        formik.setFieldValue('password', '');
        
        toast.success('✅ Profile updated successfully!');
      } catch (error) {
        const errorMsg = error.response?.data?.msg || error.message || 'Failed to update profile';
        toast.error(`❌ ${errorMsg}`);
      } finally {
        setLoading(false);
      }
    }
  });

  return (
    <div className={styles.settingsContainer}>
      <div className={styles.settingsHeader}>
        <h2>
          <i className="fas fa-cog"></i>
          Account Settings
        </h2>
        <p>Manage your account information and preferences</p>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.settingsForm}>
        <div className={styles.section}>
          <h3>
            <i className="fas fa-user-circle"></i>
            Personal Information
          </h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>
                First Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.userName && formik.touched.userName ? styles.error : ''}
              />
              {formik.errors.userName && formik.touched.userName && (
                <span className={styles.errorMsg}>{formik.errors.userName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                Last Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.lastName && formik.touched.lastName ? styles.error : ''}
              />
              {formik.errors.lastName && formik.touched.lastName && (
                <span className={styles.errorMsg}>{formik.errors.lastName}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                Email <span className={styles.disabled}>(Cannot be changed)</span>
              </label>
              <input
                type="email"
                value={userData?.email || ''}
                disabled
                className={styles.disabledInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label>
                Phone <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.phone && formik.touched.phone ? styles.error : ''}
              />
              {formik.errors.phone && formik.touched.phone && (
                <span className={styles.errorMsg}>{formik.errors.phone}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                Age <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                name="age"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                min="18"
                max="120"
                className={formik.errors.age && formik.touched.age ? styles.error : ''}
              />
              {formik.errors.age && formik.touched.age && (
                <span className={styles.errorMsg}>{formik.errors.age}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                Gender <span className={styles.required}>*</span>
              </label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.gender && formik.touched.gender ? styles.error : ''}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>
            <i className="fas fa-map-marker-alt"></i>
            Address Information
          </h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>
                Street Address <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formik.values.street}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.street && formik.touched.street ? styles.error : ''}
              />
              {formik.errors.street && formik.touched.street && (
                <span className={styles.errorMsg}>{formik.errors.street}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                City <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.city && formik.touched.city ? styles.error : ''}
              />
              {formik.errors.city && formik.touched.city && (
                <span className={styles.errorMsg}>{formik.errors.city}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                State <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.state && formik.touched.state ? styles.error : ''}
              />
              {formik.errors.state && formik.touched.state && (
                <span className={styles.errorMsg}>{formik.errors.state}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>
                Country <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formik.values.country}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.country && formik.touched.country ? styles.error : ''}
              />
              {formik.errors.country && formik.touched.country && (
                <span className={styles.errorMsg}>{formik.errors.country}</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h3>
            <i className="fas fa-shield-alt"></i>
            Verify with Password
          </h3>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
              <label>
                Current Password <span className={styles.required}>*</span>
              </label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password to confirm changes"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={formik.errors.password && formik.touched.password ? styles.error : ''}
              />
              {formik.errors.password && formik.touched.password && (
                <span className={styles.errorMsg}>{formik.errors.password}</span>
              )}
              <small className={styles.helpText}>
                <i className="fas fa-info-circle"></i>
                You need to enter your current password to save changes
              </small>
            </div>
          </div>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => formik.resetForm()}
          >
            <i className="fas fa-times"></i>
            Cancel
          </button>
          
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={loading || !formik.isValid}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}