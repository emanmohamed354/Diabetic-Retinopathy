import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { BaseUrl } from '../../BaseUrl/base';
import ErrorList from '../ErrorList/ErrorList';
import FormWrapper from '../FormWrapper/FormWrapper';
import styles from './signUp.module.scss';

export default function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isManualSubmit, setIsManualSubmit] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setPasswordVisible(!passwordVisible);
  const toggleConfirmPasswordVisibility = () => setConfirmPasswordVisible(!confirmPasswordVisible);

  const notify = (msg, type) => {
    toast[type](msg, { autoClose: 1000 });
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const handleFormSubmit = (e) => {
        console.log('Form submit triggered by:', e.target, e.type, 'Manual:', isManualSubmit);
      };
      
      document.addEventListener('submit', handleFormSubmit, true);
      
      return () => {
        document.removeEventListener('submit', handleFormSubmit, true);
      };
    }
  }, [isManualSubmit]);

  useEffect(() => {
    setIsManualSubmit(false);
    // Validate all fields when reaching step 3
    if (currentStep === 3) {
      // Trigger validation for all fields
      const validateAll = async () => {
        await Formik.validateForm();
      };
      validateAll();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const validationSchema = Yup.object({
    userName: Yup.string().required('First name is required').min(3).max(15),
    lastName: Yup.string().required('Last name is required').min(3).max(15),
    phone: Yup.string().matches(/^\d{11}$/, 'Must be 11 digits').required('Phone is required'),
    email: Yup.string().required('Email is required').email('Invalid email'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    confirmPassword: Yup.string().required('Confirm password is required')
      .oneOf([Yup.ref('password')], 'Passwords must match'),
    age: Yup.number()
      .required('Age is required')
      .min(1, 'Age must be at least 1')
      .max(120, 'Age must be less than 120')
      .integer('Age must be a whole number'),
    gender: Yup.string()
      .required('Gender is required')
      .oneOf(['male', 'female', 'other'], 'Please select a valid gender'),
    street: Yup.string().required('Street is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    country: Yup.string().required('Country is required')
  });

  const Formik = useFormik({
    initialValues: {
      userName: '',
      lastName: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      gender: '',
      street: '',
      city: '',
      state: '',
      country: ''
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnMount: false,
    onSubmit: (values) => {
      if (!isManualSubmit) {
        console.warn('Prevented auto-submit');
        return;
      }

      if (!Formik.isValid) {
        notify('Please fill all fields correctly', 'error');
        return;
      }

      setLoading(true);
      const payload = {
        userName: values.userName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        age: parseInt(values.age),
        gender: values.gender,
        phone: values.phone,
        address: {
          street: values.street,
          city: values.city,
          state: values.state,
          country: values.country,
        },
      };

      axios.post(`${BaseUrl}/users/signUp`, payload)
        .then((response) => {
          if (response.status === 201) {
            notify('Registration successful! 💊', 'success');
            setIsManualSubmit(false);
            navigate('/auth/login');
          }
        })
        .catch((error) => {
          setLoading(false);
          setIsManualSubmit(false);
          const errorMessage = error.response?.data?.msg || "An error occurred";
          notify(errorMessage, 'error');
        })
        .finally(() => {
          setLoading(false);
          setIsManualSubmit(false);
        });
    }
  });

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      if (currentStep === 3 && e.target.type === 'submit') {
        setIsManualSubmit(true);
        Formik.handleSubmit();
      }
      else if (currentStep < 3) {

        console.log('Enter pressed on step', currentStep);
      }
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const nextStep = async () => {
    // Validate current step fields before moving forward
    let fieldsToValidate = [];
    if (currentStep === 1) {
      fieldsToValidate = ['userName', 'lastName', 'phone', 'email', 'age', 'gender'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['password', 'confirmPassword'];
    }
    
    // Validate only current step fields
    const errors = await Formik.validateForm();
    const hasErrors = fieldsToValidate.some(field => errors[field]);
    
    if (!hasErrors) {
      setCurrentStep(currentStep + 1);
      // Validate all fields when reaching step 3
      if (currentStep === 2) {
        Formik.validateForm();
      }
    } else {
      // Mark fields as touched to show errors
      fieldsToValidate.forEach(field => {
        Formik.setFieldTouched(field, true);
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setIsManualSubmit(true);
    Formik.handleSubmit();
  };

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <>
            <div className="formBody">
              <div className="row g-2">
                <div className="col-12">
                  <div className="inputGroup">
                    <label>First Name</label>
                    <div className="inputWrapper">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        name="userName"
                        placeholder="First Name"
                        onBlur={Formik.handleBlur}
                        onChange={Formik.handleChange}
                        onKeyDown={handleInputKeyDown}
                        value={Formik.values.userName}
                        className={`form-control ${Formik.errors.userName && Formik.touched.userName ? 'error' : ''}`}
                        autoComplete="given-name"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="inputGroup">
                    <label>Last Name</label>
                    <div className="inputWrapper">
                      <i className="fas fa-user"></i>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        onBlur={Formik.handleBlur}
                        onChange={Formik.handleChange}
                        onKeyDown={handleInputKeyDown}
                        value={Formik.values.lastName}
                        className={`form-control ${Formik.errors.lastName && Formik.touched.lastName ? 'error' : ''}`}
                        autoComplete="family-name"
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="inputGroup">
                <label>Email</label>
                <div className="inputWrapper">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onBlur={Formik.handleBlur}
                    onChange={Formik.handleChange}
                    onKeyDown={handleInputKeyDown}
                    value={Formik.values.email}
                    className={`form-control ${Formik.errors.email && Formik.touched.email ? 'error' : ''}`}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="inputGroup">
                <label>Phone</label>
                <div className="inputWrapper">
                  <i className="fas fa-phone"></i>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Phone (11 digits)"
                    onBlur={Formik.handleBlur}
                    onChange={Formik.handleChange}
                    onKeyDown={handleInputKeyDown}
                    value={Formik.values.phone}
                    className={`form-control ${Formik.errors.phone && Formik.touched.phone ? 'error' : ''}`}
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-12">
                  <div className="inputGroup">
                    <label>Age</label>
                    <div className="inputWrapper">
                      <i className="fas fa-birthday-cake"></i>
                      <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        min="1"
                        max="120"
                        onBlur={Formik.handleBlur}
                        onChange={Formik.handleChange}
                        onKeyDown={handleInputKeyDown}
                        value={Formik.values.age}
                        className={`form-control ${Formik.errors.age && Formik.touched.age ? 'error' : ''}`}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="inputGroup">
                    <label>Gender</label>
                    <div className="inputWrapper">
                      <i className="fas fa-venus-mars"></i>
                      <select
                        name="gender"
                        onBlur={Formik.handleBlur}
                        onChange={Formik.handleChange}
                        onKeyDown={handleInputKeyDown}
                        value={Formik.values.gender}
                        className={`form-control ${Formik.errors.gender && Formik.touched.gender ? 'error' : ''}`}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="formFooter">
              <div className={styles.stepButtons}>
                <button type="button" className={styles.nextBtn} onClick={nextStep}>
                  <span>Next</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </>
        );
        
      case 2:
        return (
          <>
            <div className="formBody">
              <div className="inputGroup">
                <label>Password</label>
                <div className="inputWrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type={passwordVisible ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    onBlur={Formik.handleBlur}
                    onChange={Formik.handleChange}
                    onKeyDown={handleInputKeyDown}
                    value={Formik.values.password}
                    className={`form-control ${Formik.errors.password && Formik.touched.password ? 'error' : ''}`}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eyeButton" onClick={togglePasswordVisibility} tabIndex="-1">
                    <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
                  </button>
                </div>
                <ErrorList Formik={Formik} type="password" />
              </div>

              <div className="inputGroup">
                <label>Confirm Password</label>
                <div className="inputWrapper">
                  <i className="fas fa-lock"></i>
                  <input
                    type={confirmPasswordVisible ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onBlur={Formik.handleBlur}
                    onChange={Formik.handleChange}
                    onKeyDown={handleInputKeyDown}
                    value={Formik.values.confirmPassword}
                    className={`form-control ${Formik.errors.confirmPassword && Formik.touched.confirmPassword ? 'error' : ''}`}
                    autoComplete="new-password"
                  />
                  <button type="button" className="eyeButton" onClick={toggleConfirmPasswordVisibility} tabIndex="-1">
                    <FontAwesomeIcon icon={confirmPasswordVisible ? faEye : faEyeSlash} />
                  </button>
                </div>
                <ErrorList Formik={Formik} type="confirmPassword" />
              </div>
            </div>

            <div className="formFooter">
              <div className={styles.stepButtons}>
                <button type="button" className={styles.prevBtn} onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i>
                  <span>Back</span>
                </button>
                <button type="button" className={styles.nextBtn}  onClick={nextStep}>
                  <span>Next</span>
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </>
        );
        
      case 3:
        return (
          <>
            <div className="formBody">
              <div className="inputGroup">
                <label>Street</label>
                <div className="inputWrapper">
                  <i className="fas fa-road"></i>
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    onBlur={Formik.handleBlur}
                    onChange={Formik.handleChange}
                    onKeyDown={handleInputKeyDown}
                    value={Formik.values.street}
                    className={`form-control ${Formik.errors.street && Formik.touched.street ? 'error' : ''}`}
                    autoComplete="street-address"
                  />
                </div>
              </div>

              <div className="row g-2">
                <div className="col-12">
                  <div className="inputGroup">
                    <label>City</label>
                    <div className="inputWrapper">
                      <i className="fas fa-city"></i>
                      <input
                        type="text"
                        name="city"
                        placeholder="City"
                        onBlur={Formik.handleBlur}
                        onChange={Formik.handleChange}
                        onKeyDown={handleInputKeyDown}
                        value={Formik.values.city}
                        className={`form-control ${Formik.errors.city && Formik.touched.city ? 'error' : ''}`}
                        autoComplete="address-level2"
                      />
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="inputGroup">
                    <label>State</label>
                    <div className="inputWrapper">
                      <i className="fas fa-map"></i>
                      <input
                        type="text"
                        name="state"
                        placeholder="State"
                        onBlur={Formik.handleBlur}
                        onChange={Formik.handleChange}
                        onKeyDown={handleInputKeyDown}
                        value={Formik.values.state}
                        className={`form-control ${Formik.errors.state && Formik.touched.state ? 'error' : ''}`}
                        autoComplete="address-level1"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="inputGroup">
                <label>Country</label>
                <div className="inputWrapper">
                  <i className="fas fa-globe"></i>
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    onBlur={Formik.handleBlur}
                    onChange={Formik.handleChange}
                    onKeyDown={handleInputKeyDown}
                    value={Formik.values.country}
                    className={`form-control ${Formik.errors.country && Formik.touched.country ? 'error' : ''}`}
                    autoComplete="country"
                  />
                </div>
              </div>
            </div>

            <div className="formFooter">
              <div className={styles.stepButtons}>
                <button type="button" className={styles.prevBtn} onClick={prevStep}>
                  <i className="fas fa-arrow-left"></i>
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  className="submitBtn"
                  onClick={handleManualSubmit}
                  disabled={
                    loading || 
                    !Formik.values.street || 
                    !Formik.values.city || 
                    !Formik.values.state || 
                    !Formik.values.country ||
                    Formik.errors.street ||
                    Formik.errors.city ||
                    Formik.errors.state ||
                    Formik.errors.country ||
                    Formik.errors.userName ||
                    Formik.errors.lastName ||
                    Formik.errors.phone ||
                    Formik.errors.email ||
                    Formik.errors.password ||
                    Formik.errors.confirmPassword ||
                    Formik.errors.age ||
                    Formik.errors.gender
                  }
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <>
                      <i className="fas fa-user-plus"></i>
                      <span>Sign Up</span>
                    </>
                  )}
                </button>
              </div>
              
              <p className="switchText mt-2">
                Already have an account?
                <Link to="/auth/login" className="link">Sign In</Link>
              </p>
            </div>
          </>
        );
        
      default:
        return null;
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!isManualSubmit) {
      console.log('Form submission prevented - not manual');
      return false;
    }
    
    Formik.handleSubmit();
  };

  return (
    <FormWrapper
      icon="fas fa-user-plus"
      title="Create Account"
      subtitle={`Step ${currentStep} of 3`}
      onSubmit={handleFormSubmit}
      onKeyPress={handleKeyPress}
      currentStep={currentStep}
      totalSteps={3}
    >
      {renderStep()}
    </FormWrapper>
  );
}