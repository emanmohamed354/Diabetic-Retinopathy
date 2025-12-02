import React, { useState } from 'react';

export default function PatientsListTEST() {
  const [showHistory, setShowHistory] = useState(false);
  const [historyPatient, setHistoryPatient] = useState(null);

  // Fake test data
  const testPatients = [
    { 
      _id: '1', 
      name: 'John Doe', 
      age: 45, 
      gender: 'male',
      email: 'john@test.com',
      phone: '123-456-7890',
      diabetesType: 'type1',
      totalAnalyses: 5 
    },
    { 
      _id: '2', 
      name: 'Jane Smith', 
      age: 38, 
      gender: 'female',
      email: 'jane@test.com',
      phone: '098-765-4321',
      diabetesType: 'type2',
      totalAnalyses: 3 
    }
  ];

  const handleViewHistory = (patient) => {
    console.log('🚀🚀🚀 handleViewHistory called!');
    console.log('Patient:', patient);
    alert(`Opening history for: ${patient.name}`);
    setHistoryPatient(patient);
    setShowHistory(true);
  };

  return (
    <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '30px' }}>TEST - Patient List</h1>
      
      {/* TEST BUTTON 1 - Absolute simplest */}
      <button
        onClick={() => {
          console.log('SIMPLE BUTTON CLICKED');
          alert('Simple button works!');
        }}
        style={{
          padding: '15px 30px',
          background: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '20px',
          display: 'block'
        }}
      >
        ✅ CLICK ME - Simple Test Button
      </button>

      {/* TEST BUTTON 2 - With handleViewHistory */}
      <button
        onClick={() => {
          console.log('HISTORY BUTTON CLICKED');
          handleViewHistory(testPatients[0]);
        }}
        style={{
          padding: '15px 30px',
          background: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '40px',
          display: 'block'
        }}
      >
        📊 Open History Modal
      </button>

      <div style={{ display: 'grid', gap: '20px', maxWidth: '600px' }}>
        {testPatients.map((patient) => (
          <div
            key={patient._id}
            style={{
              background: 'white',
              border: '2px solid #ddd',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <h2 style={{ margin: '0 0 10px 0' }}>{patient.name}</h2>
            <p style={{ margin: '5px 0' }}>Age: {patient.age}</p>
            <p style={{ margin: '5px 0' }}>Email: {patient.email}</p>
            <p style={{ margin: '5px 0' }}>Phone: {patient.phone}</p>
            <p style={{ margin: '5px 0' }}>Analyses: {patient.totalAnalyses}</p>

            <button
              onClick={() => {
                console.log(`🔥 Card button clicked for: ${patient.name}`);
                alert(`Card button clicked: ${patient.name}`);
                handleViewHistory(patient);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#00acc1',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              📋 View History ({patient.totalAnalyses})
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showHistory && historyPatient && (
        <div
          onClick={() => {
            console.log('Overlay clicked - closing modal');
            setShowHistory(false);
            setHistoryPatient(null);
          }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              padding: '40px',
              borderRadius: '12px',
              maxWidth: '500px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}
          >
            <h2 style={{ marginTop: 0 }}>Analysis History</h2>
            <h3>Patient: {historyPatient.name}</h3>
            <p>Patient ID: {historyPatient._id}</p>
            <p>Total Analyses: {historyPatient.totalAnalyses}</p>
            
            <button
              onClick={() => {
                console.log('Close button clicked');
                setShowHistory(false);
                setHistoryPatient(null);
              }}
              style={{
                padding: '12px 24px',
                background: '#ff5252',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginTop: '20px',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              ✖ Close Modal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}