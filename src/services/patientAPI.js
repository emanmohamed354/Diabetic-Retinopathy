import axios from 'axios';
import { BaseUrl } from '../Componentes/BaseUrl/base';

const API_URL = `${BaseUrl}/patients`;
const ANALYSIS_URL = `${BaseUrl}/analysis`;

const getAuthHeaders = () => {
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  
  if (!userId) {
    console.warn('No userId found in localStorage');
  }
  
  return {
    'Content-Type': 'application/json',
    'userid': userId || '',
    'Authorization': `Bearer ${token}` // ✅ Add Bearer token
  };
};

export const patientAPI = {
  // Get all patients for doctor
  async getDoctorPatients() {
    try {
      const headers = getAuthHeaders();
      console.log('Fetching patients with headers:', headers);
      
      const response = await axios.get(`${API_URL}/all`, {
        headers
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Patients Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to fetch patients');
    }
  },

  // Get specific patient with all records
  async getPatientById(patientId) {
    try {
      const response = await axios.get(`${API_URL}/${patientId}`, {
        headers: getAuthHeaders()
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Patient Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to fetch patient');
    }
  },

  // Create new patient
  async createPatient(patientData) {
    try {
      const response = await axios.post(`${API_URL}/create`, patientData, {
        headers: getAuthHeaders()
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Create Patient Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to create patient');
    }
  },

  // Update patient
  async updatePatient(patientId, patientData) {
    try {
      const response = await axios.put(
        `${API_URL}/${patientId}/update`,
        patientData,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Update Patient Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to update patient');
    }
  },

  // Delete patient
  async deletePatient(patientId) {
    try {
      const response = await axios.delete(
        `${API_URL}/${patientId}/delete`,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Delete Patient Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to delete patient');
    }
  },

  // Get patient statistics
  async getPatientStats(patientId) {
    try {
      const response = await axios.get(
        `${API_URL}/${patientId}/stats`,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Stats Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to fetch statistics');
    }
  },

  // Get patient analysis history
  async getPatientAnalysisHistory(patientId) {
    try {
      const response = await axios.get(
        `${ANALYSIS_URL}/patient/${patientId}/history`,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get History Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to fetch analysis history');
    }
  },

  // Save analysis result
  async saveAnalysis(analysisData) {
    try {
      const response = await axios.post(
        `${ANALYSIS_URL}/save`,
        analysisData,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Save Analysis Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to save analysis');
    }
  },

  // Get analysis report
  async getAnalysisReport(analysisId) {
    try {
      const response = await axios.get(
        `${ANALYSIS_URL}/${analysisId}`,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Get Report Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to fetch report');
    }
  },

  // Export analysis
  async exportAnalysisReport(analysisId) {
    try {
      const response = await axios.get(
        `${ANALYSIS_URL}/${analysisId}/export`,
        { headers: getAuthHeaders() }
      );
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Export Error:', error);
      throw new Error(error.response?.data?.msg || 'Failed to export report');
    }
  }
};