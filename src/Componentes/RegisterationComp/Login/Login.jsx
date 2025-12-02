import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { useFormik } from 'formik';
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { BaseUrl } from '../../BaseUrl/base';
import { mediaContext } from '../../../Context/MediaStore';
import ErrorList from '../ErrorList/ErrorList';
import FormWrapper from '../FormWrapper/FormWrapper';

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { saveUserData } = useContext(mediaContext);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const notify = (msg, type) => {
    toast[type](msg, {
      autoClose: 1000,
    });
  };

  const validationSchema = Yup.object({
    email: Yup.string().required('Email is required').email('Invalid email'),
    password: Yup.string()
      .required('Password is required')
  });

  const Formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    onSubmit: (values) => {
      setLoading(true);
      axios.post(`${BaseUrl}/users/signIn`, values)
        .then((response) => {
          if (response.status === 200 || response.status === 201) {
            setLoading(false);
            notify('Login successful! 🎉', 'success');
            localStorage.setItem('token', response.data.token);
            saveUserData();
            navigate('/');
          }
        })
        .catch((error) => {
          setLoading(false);
          const errorMessage = error.response?.data?.msg || 'Invalid credentials';
          notify(errorMessage, 'error');
        });
    }
  });

  return (
    <FormWrapper
      icon="fas fa-sign-in-alt"
      title="Welcome Back"
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
              placeholder="Enter your email"
              onBlur={Formik.handleBlur}
              onChange={Formik.handleChange}
              value={Formik.values.email}
              className={`form-control ${Formik.errors.email && Formik.touched.email ? 'error' : ''}`}
            />
          </div>
          <ErrorList Formik={Formik} type="email" />
        </div>

        <div className="inputGroup">
          <label>Password</label>
          <div className="inputWrapper">
            <i className="fas fa-lock"></i>
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              onBlur={Formik.handleBlur}
              onChange={Formik.handleChange}
              value={Formik.values.password}
              className={`form-control ${Formik.errors.password && Formik.touched.password ? 'error' : ''}`}
            />
            <button
              type="button"
              className="eyeButton"
              onClick={togglePasswordVisibility}
            >
              <FontAwesomeIcon icon={passwordVisible ? faEye : faEyeSlash} />
            </button>
          </div>
          <ErrorList Formik={Formik} type="password" />
        </div>

        <div className="options">
          <label className="checkbox">
            <input type="checkbox" />
            <span>Remember me</span>
          </label>
          <Link to="/auth/forget-password" className="link">
            Forgot Password?
          </Link>
        </div>
      </div>

      <div className="formFooter">
        <button
          type="submit"
          className="submitBtn"
          disabled={loading || !Formik.values.email || !Formik.values.password || Formik.errors.email || Formik.errors.password}
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className="fas fa-sign-in-alt"></i>
              <span>Sign In</span>
            </>
          )}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <button type="button" className="socialBtn">
          <i className="fab fa-google"></i>
          <span>Continue with Google</span>
        </button>

        <p className="switchText">
          Don't have an account?
          <Link to="/auth/signup" className="link">
            Create Account
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
}