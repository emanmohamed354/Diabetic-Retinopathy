const API_BASE_URL = process.env.REACT_APP_API_URL 

const DR_GRADES = {
  0: { name: 'No DR', severity: 'normal', description: 'No signs of diabetic retinopathy' },
  1: { name: 'Mild NPDR', severity: 'mild', description: 'Mild non-proliferative diabetic retinopathy' },
  2: { name: 'Moderate NPDR', severity: 'moderate', description: 'Moderate non-proliferative diabetic retinopathy' },
  3: { name: 'Severe NPDR', severity: 'severe', description: 'Severe non-proliferative diabetic retinopathy' },
  4: { name: 'PDR', severity: 'critical', description: 'Proliferative diabetic retinopathy' }
};

export const diabeticAPI = {
  uploadImage: async (formData) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileName = formData.get('image')?.name || 'retinal_image.jpg';
    
    return {
      file_name: fileName,
      upload_status: 'success',
      timestamp: new Date().toISOString()
    };
  },

  getAnalysis: async (fileName) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const rawRegressionScore = (Math.random() * 3.5).toFixed(2); // 0.00 to 3.50
    const predictedClass = Math.min(4, Math.floor(parseFloat(rawRegressionScore) + 0.5)); // Round to nearest class
    
    const gradeInfo = DR_GRADES[predictedClass];
    
    const generateFindings = (grade) => {
      const findings = [];
      
      if (grade === 0) {
        findings.push(
          { type: 'positive', description: 'Clear retinal vessels with normal caliber' },
          { type: 'positive', description: 'No microaneurysms detected' },
          { type: 'positive', description: 'Macula appears healthy with normal foveal reflex' },
          { type: 'positive', description: 'Optic disc has clear margins' }
        );
      } else if (grade === 1) {
        findings.push(
          { type: 'warning', description: 'Few microaneurysms detected in peripheral retina' },
          { type: 'positive', description: 'No hard exudates or cotton-wool spots' },
          { type: 'positive', description: 'Macula not affected' },
          { type: 'warning', description: 'Mild vascular changes observed' }
        );
      } else if (grade === 2) {
        findings.push(
          { type: 'warning', description: 'Multiple microaneurysms present' },
          { type: 'warning', description: 'Retinal hemorrhages detected in one or more quadrants' },
          { type: 'warning', description: 'Possible hard exudates observed' },
          { type: 'positive', description: 'No signs of neovascularization' }
        );
      } else if (grade === 3) {
        findings.push(
          { type: 'negative', description: 'Extensive retinal hemorrhages in multiple quadrants' },
          { type: 'negative', description: 'Venous beading present' },
          { type: 'negative', description: 'Intraretinal microvascular abnormalities (IRMA) detected' },
          { type: 'warning', description: 'High risk for progression to PDR' }
        );
      } else {
        findings.push(
          { type: 'negative', description: 'Neovascularization detected at disc or elsewhere' },
          { type: 'negative', description: 'Possible vitreous hemorrhage' },
          { type: 'negative', description: 'Signs of fibrous proliferation' },
          { type: 'negative', description: 'Urgent treatment required' }
        );
      }
      
      return findings;
    };

    const generateRecommendations = (grade) => {
      const baseRecs = [
        'Maintain optimal glycemic control (HbA1c < 7%)',
        'Control blood pressure (target < 130/80 mmHg)',
        'Regular lipid profile monitoring'
      ];
      
      if (grade === 0) {
        return [
          ...baseRecs,
          'Continue annual diabetic eye screening',
          'No treatment required at this time'
        ];
      } else if (grade === 1) {
        return [
          ...baseRecs,
          'Follow-up examination in 6-12 months',
          'Consider more frequent monitoring if poor metabolic control',
          'Patient education on DR progression signs'
        ];
      } else if (grade === 2) {
        return [
          ...baseRecs,
          'Follow-up examination in 3-6 months',
          'Consider OCT imaging for macular assessment',
          'Referral to retina specialist if macular involvement'
        ];
      } else if (grade === 3) {
        return [
          'Urgent referral to retina specialist',
          'Follow-up within 2-4 months',
          'Consider panretinal photocoagulation',
          ...baseRecs
        ];
      } else {
        return [
          'IMMEDIATE referral to retina specialist',
          'Anti-VEGF therapy likely required',
          'Possible vitrectomy consideration',
          'Close monitoring for complications'
        ];
      }
    };

    const distanceToClassBoundary = Math.abs(rawRegressionScore - Math.round(rawRegressionScore));
    const confidence = Math.round(95 - (distanceToClassBoundary * 30)); 

    return {
      file_name: fileName,
      raw_regression_score: parseFloat(rawRegressionScore),
      predicted_class: predictedClass,
      status: 'success',
      
      severity: gradeInfo.name,
      severity_description: gradeInfo.description,
      confidence: confidence,
      findings: generateFindings(predictedClass),
      recommendations: generateRecommendations(predictedClass),
      progressionRisk: predictedClass <= 1 ? 'low' : predictedClass === 2 ? 'medium' : 'high',
      followUp: predictedClass === 0 ? '12 months' : 
                predictedClass === 1 ? '6-12 months' :
                predictedClass === 2 ? '3-6 months' :
                predictedClass === 3 ? '2-4 months' : 'Immediate',
      
      model_version: 'EfficientNetB5-APTOS2019-v1.0',
      preprocessing: ['Circular Cropping (Ben Graham)', 'CLAHE Enhancement', 'Ordinal Regression'],
      timestamp: new Date().toISOString()
    };
  },

  exportReport: async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const pdfContent = `
      Diabetic Retinopathy Analysis Report
      =====================================
      
      Report ID: ${reportData.reportId || 'RPT-' + Date.now()}
      Date: ${new Date().toLocaleString()}
      
      Patient Information:
      - Name: ${reportData.patientName || 'N/A'}
      - Age: ${reportData.patientAge || 'N/A'}
      
      Analysis Results:
      - Severity: ${reportData.severity}
      - Confidence: ${reportData.confidence}%
      - Regression Score: ${reportData.raw_regression_score}
      - Predicted Class: ${reportData.predicted_class}
      
      Clinical Findings and Recommendations included.
    `;
    
    const mockPdfBlob = new Blob([pdfContent], { type: 'application/pdf' });
    return mockPdfBlob;
  },

  saveReport: async (reportData) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      success: true,
      message: 'Report saved successfully to patient records',
      reportId: reportData.reportId,
      savedAt: new Date().toISOString()
    };
  },

  shareReport: async (reportId, patientEmail) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      success: true,
      message: `Report shared successfully with ${patientEmail}`,
      sharedAt: new Date().toISOString()
    };
  }
};

export default diabeticAPI;