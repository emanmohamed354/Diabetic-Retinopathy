import axios from 'axios';
import { PredictUrl } from '../Componentes/BaseUrl/base';

const API_URL = `${PredictUrl}/predict`;

const DR_LEVELS = {
  0: {
    label: 'No DR',
    severity: 'Normal',
    description: 'No diabetic retinopathy detected',
    color: 'success',
    icon: 'check-circle',
    recommendations: [
      'Continue annual diabetic eye examinations',
      'Maintain optimal blood glucose control (HbA1c < 7%)',
      'Regular monitoring every 12 months',
      'Healthy lifestyle and diet management'
    ],
    followUp: 'Annual screening recommended'
  },
  1: {
    label: 'Mild NPDR',
    severity: 'Mild',
    description: 'Mild Non-Proliferative Diabetic Retinopathy detected',
    color: 'info',
    icon: 'info-circle',
    recommendations: [
      'Follow-up examination in 6-12 months',
      'Optimize blood glucose control (HbA1c < 7%)',
      'Monitor blood pressure regularly (< 130/80 mmHg)',
      'Consider diabetes education program',
      'Regular exercise and healthy diet'
    ],
    followUp: 'Re-examination in 6-12 months'
  },
  2: {
    label: 'Moderate NPDR',
    severity: 'Moderate',
    description: 'Moderate Non-Proliferative Diabetic Retinopathy detected',
    color: 'warning',
    icon: 'exclamation-circle',
    recommendations: [
      'Follow-up in 3-6 months with dilated fundus exam',
      'Referral to retina specialist recommended',
      'Strict glycemic control essential (HbA1c < 7%)',
      'OCT imaging to assess macular edema',
      'Control blood pressure and lipid levels',
      'Monthly self-monitoring of vision changes'
    ],
    followUp: 'Re-examination in 3-6 months'
  },
  3: {
    label: 'Severe NPDR',
    severity: 'Severe',
    description: 'Severe Non-Proliferative Diabetic Retinopathy - urgent attention needed',
    color: 'error',
    icon: 'exclamation-triangle',
    recommendations: [
      'URGENT: Refer to retina specialist within 2-4 weeks',
      'Consider pan-retinal photocoagulation',
      'Monthly follow-up examinations required',
      'Intensive diabetes management essential',
      'Monitor for signs of proliferative changes',
      'Emergency contact if sudden vision changes occur'
    ],
    followUp: 'Urgent follow-up within 2-4 weeks'
  },
  4: {
    label: 'Proliferative DR',
    severity: 'Critical',
    description: 'Proliferative Diabetic Retinopathy - immediate treatment required',
    color: 'error',
    icon: 'times-circle',
    recommendations: [
      'IMMEDIATE referral to ophthalmologist (within 1 week)',
      'Pan-retinal photocoagulation indicated',
      'Anti-VEGF therapy consideration',
      'Weekly monitoring until stable',
      'Risk of severe vision loss without treatment',
      'Emergency protocol for sudden vision changes'
    ],
    followUp: 'Immediate treatment required (within 1 week)'
  }
};

export const diabeticAPI = {
  async analyzeImage(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      console.log('Sending request to:', API_URL);
      console.log('File:', file.name, 'Size:', file.size);

      const response = await axios.post(API_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('API Response:', response.data);

      const { filename, raw_regression_score, predicted_class, status } = response.data;

      if (status !== 'success') {
        throw new Error('Analysis failed - please try again');
      }

      if (predicted_class < 0 || predicted_class > 4) {
        throw new Error(`Invalid prediction class: ${predicted_class}`);
      }

      const drInfo = DR_LEVELS[predicted_class];

      const scoreDiff = Math.abs(raw_regression_score - predicted_class);
      let confidence;
      
      if (scoreDiff < 0.3) {
        confidence = 95;
      } else if (scoreDiff < 0.5) {
        confidence = 85;
      } else if (scoreDiff < 0.8) {
        confidence = 75;
      } else {
        confidence = 65;
      }

      return {
        success: true,
        filename,
        rawScore: parseFloat(raw_regression_score).toFixed(4),
        predictedClass: predicted_class,
        confidence: parseFloat(confidence.toFixed(1)),
        
        label: drInfo.label,
        severity: drInfo.severity,
        description: drInfo.description,
        color: drInfo.color,
        icon: drInfo.icon,
        recommendations: drInfo.recommendations,
        followUp: drInfo.followUp,
        
        timestamp: new Date().toISOString(),
        reportId: `DR-${Date.now()}`,
      };

    } catch (error) {
      console.error('API Error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('⏱️ Request timeout - server is taking too long to respond');
      }
      
      if (error.response) {
        const status = error.response.status;
        if (status === 404) {
          throw new Error('❌ API endpoint not found - check server status');
        } else if (status === 500) {
          throw new Error('🔧 Server error - please try again later');
        } else if (status === 413) {
          throw new Error('📦 File too large - maximum size is 10MB');
        } else if (status === 422) {
          throw new Error('⚠️ Invalid file format - please upload a valid retinal image');
        }
        throw new Error(error.response.data?.detail || error.response.data?.message || 'Server error occurred');
      }
      
      if (error.message.includes('Network Error')) {
        throw new Error('🌐 Network error - Check if backend server is running or CORS is enabled');
      }
      
      throw new Error(error.message || 'Failed to analyze image');
    }
  },

  exportReport(analysis) {
    const reportData = {
      reportTitle: 'Diabetic Retinopathy Analysis Report',
      ...analysis,
      exportDate: new Date().toISOString(),
      generatedBy: 'DR Analysis System v1.0',
      disclaimer: 'This is an AI-assisted analysis. Clinical decision should be made by qualified ophthalmologists.'
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { 
      type: 'application/json' 
    });
    
    return blob;
  }
};