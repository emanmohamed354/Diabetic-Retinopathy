import axios from 'axios';
import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { BaseUrl } from '../../BaseUrl/base';
import ErrorList from '../ErrorList/ErrorList';
import FormWrapper from '../FormWrapper/FormWrapper';

export default function ForgetPassword() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const notify = (msg, type) => {
    toast[type](msg, { autoClose: 1000 });
  };

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required').email('Invalid email'),
  });

  const Formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      axios.post(`${BaseUrl}/users/forget-password`, values)
        .then((response) => {
          if (response.status === 200) {
            setLoading(false);
            notify('OTP sent! 📧', 'success');
            navigate('/auth/reset-password');
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
      icon="fas fa-key"
      title="Forgot Password"
      onSubmit={Formik.handleSubmit}
    >
      <div className="formBody">
        <div className="inputGroup">
          <label>Email Address</label>
          <div className="inputWrapper">
            <i className="fas fa-envelope"></i>
            <input
              type="email"
              name="email"
              placeholder="Enter your registered email"
              onBlur={Formik.handleBlur}
              onChange={Formik.handleChange}
              value={Formik.values.email}
              className={`form-control ${Formik.errors.email && Formik.touched.email ? 'error' : ''}`}
            />
          </div>
          <ErrorList Formik={Formik} type="email" />
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
              <i className="fas fa-paper-plane"></i>
              <span>Send OTP</span>
            </>
          )}
        </button>

        <p className="switchText">
          Remember password?
          <Link to="/auth/login" className="link">Back to Login</Link>
        </p>
      </div>
    </FormWrapper>
  );
}