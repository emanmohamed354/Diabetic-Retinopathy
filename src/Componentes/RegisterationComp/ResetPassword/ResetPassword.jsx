import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { BaseUrl } from '../../BaseUrl/base';
import ErrorList from '../ErrorList/ErrorList';
import FormWrapper from '../FormWrapper/FormWrapper';

export default function ResetPassword() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const notify = (msg, type) => {
    toast[type](msg, { autoClose: 1000 });
  };

  const validationSchema = Yup.object({
    email: Yup.string().required('Email required').email('Invalid email'),
    otp: Yup.string().required('OTP required'),
    newPassword: Yup.string()
      .matches(/^[A-Z][a-z0-9@$%&#]{5,}$/, 'Invalid format')
      .required('Password required'),
  });

  const Formik = useFormik({
    initialValues: {
      email: '',
      otp: '',
      newPassword: ''
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      axios.post(`${BaseUrl}/users/reset-password`, values)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            notify('Password reset! 🎉', 'success');
            navigate('/auth/login');
          }
        })
        .catch((error) => {
          setLoading(false);
          const errorMessage = error.response?.data?.message || "Error occurred";
          notify(errorMessage, 'error');
        });
    }
  });

  return (
    <FormWrapper
      icon="fas fa-lock-open"
      title="Reset Password"
      onSubmit={Formik.handleSubmit}
    >
      <div className="formBody">
        <div className="inputGroup">
          <label>Email</label>
          <div className="inputWrapper">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Your email"
              onBlur={Formik.handleBlur}
              onChange={Formik.handleChange}
              value={Formik.values.email}
              className={`form-control ${Formik.errors.email && Formik.touched.email ? 'error' : ''}`}
            />
          </div>
          <ErrorList Formik={Formik} type="email" />
        </div>

        <div className="inputGroup">
          <label>OTP Code</label>
          <div className="inputWrapper">
            <i className="fas fa-hashtag"></i>
            <input
              type="text"
              name="otp"
              placeholder="Enter OTP"
              onBlur={Formik.handleBlur}
              onChange={Formik.handleChange}
              value={Formik.values.otp}
              className={`form-control ${Formik.errors.otp && Formik.touched.otp ? 'error' : ''}`}
            />
          </div>
          <ErrorList Formik={Formik} type="otp" />
        </div>

        <div className="inputGroup">
          <label>New Password</label>
          <div className="inputWrapper">
            <i className="fas fa-lock"></i>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="newPassword"
              placeholder="New password"
              onBlur={Formik.handleBlur}
              onChange={Formik.handleChange}
              value={Formik.values.newPassword}
              className={`form-control ${Formik.errors.newPassword && Formik.touched.newPassword ? 'error' : ''}`}
            />
            <button
              type="button"
              className="eyeButton"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </button>
          </div>
          <ErrorList Formik={Formik} type="newPassword" />
        </div>
      </div>

      <div className="formFooter">
        <button
          type="submit"
          className="submitBtn"
          disabled={!(Formik.isValid && Formik.dirty) || loading}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className="fas fa-check"></i>
              <span>Reset Password</span>
            </>
          )}
        </button>

        <p className="switchText">
          <Link to="/auth/forget-password" className="link">Back</Link>
          {' '}or{' '}
          <Link to="/auth/login" className="link">Login</Link>
        </p>
      </div>
    </FormWrapper>
  );
}