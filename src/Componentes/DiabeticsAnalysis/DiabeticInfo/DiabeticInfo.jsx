import React, { useState } from 'react';
import styles from './diabeticInfo.module.scss';

export default function DiabeticInfo() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: 'Overview',
      icon: 'info-circle',
      content: (
        <div className={styles.content}>
          <div className={styles.card}>
            <h3>What is Diabetic Retinopathy?</h3>
            <p>
              Diabetic retinopathy is a diabetes complication that affects the eyes. 
              It's caused by damage to the blood vessels of the light-sensitive tissue 
              at the back of the eye (retina).
            </p>
          </div>
          
          <div className={styles.card}>
            <h3>Prevalence</h3>
            <p>
              Affects approximately 1 in 3 people with diabetes and is the leading 
              cause of blindness in working-age adults worldwide.
            </p>
          </div>
          
          <div className={styles.statsGrid}>
            <div className={styles.stat}>
              <div className={styles.statValue}>33%</div>
              <div className={styles.statLabel}>of diabetics affected</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>90%</div>
              <div className={styles.statLabel}>preventable with early detection</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.statValue}>#1</div>
              <div className={styles.statLabel}>cause of blindness in adults</div>
            </div>
          </div>
        </div>
      )
    },
    stages: {
      title: 'Disease Stages',
      icon: 'layer-group',
      content: (
        <div className={styles.content}>
          <div className={styles.stagesGrid}>
            {[
              {
                class: 0,
                name: 'No DR',
                severity: 'Normal',
                color: 'success',
                description: 'No abnormalities detected',
                signs: ['No visible changes', 'Normal retinal appearance'],
                action: 'Annual screening recommended'
              },
              {
                class: 1,
                name: 'Mild NPDR',
                severity: 'Mild',
                color: 'info',
                description: 'Microaneurysms present',
                signs: ['Small balloon-like swellings', 'Minimal retinal changes'],
                action: 'Re-examine in 6-12 months'
              },
              {
                class: 2,
                name: 'Moderate NPDR',
                severity: 'Moderate',
                color: 'warning',
                description: 'More blood vessel blockage',
                signs: ['Hemorrhages', 'Hard exudates', 'Venous changes'],
                action: 'Follow-up in 3-6 months'
              },
              {
                class: 3,
                name: 'Severe NPDR',
                severity: 'Severe',
                color: 'error',
                description: 'Many blocked blood vessels',
                signs: ['Multiple hemorrhages', 'Venous beading', 'IRMA present'],
                action: 'Urgent referral within 1 month'
              },
              {
                class: 4,
                name: 'PDR',
                severity: 'Critical',
                color: 'error',
                description: 'Advanced stage with new vessel growth',
                signs: ['Neovascularization', 'Vitreous hemorrhage', 'Retinal detachment risk'],
                action: 'Immediate treatment required'
              }
            ].map((stage, idx) => (
              <div key={idx} className={`${styles.stageCard} ${styles[stage.color]}`}>
                <div className={styles.stageHeader}>
                  <div className={styles.stageClass}>Class {stage.class}</div>
                  <div className={styles.stageName}>{stage.name}</div>
                </div>
                <div className={styles.stageSeverity}>{stage.severity}</div>
                <p className={styles.stageDescription}>{stage.description}</p>
                <div className={styles.stageSigns}>
                  <strong>Signs:</strong>
                  <ul>
                    {stage.signs.map((sign, i) => (
                      <li key={i}>{sign}</li>
                    ))}
                  </ul>
                </div>
                <div className={styles.stageAction}>
                  <i className="fas fa-calendar-check"></i>
                  {stage.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    diagnosis: {
      title: 'Diagnostic Methods',
      icon: 'microscope',
      content: (
        <div className={styles.content}>
          <div className={styles.methodsGrid}>
            {[
              {
                name: 'Fundus Photography',
                icon: 'camera',
                description: 'Standard retinal imaging for documentation and screening',
                accuracy: '85-90%',
                pros: ['Non-invasive', 'Quick procedure', 'Good documentation'],
                cons: ['Limited depth view', 'Requires pupil dilation']
              },
              {
                name: 'OCT Imaging',
                icon: 'eye',
                description: 'Cross-sectional imaging for macular edema assessment',
                accuracy: '95%',
                pros: ['High resolution', 'Quantitative data', 'No dye needed'],
                cons: ['More expensive', 'Limited availability']
              },
              {
                name: 'Fluorescein Angiography',
                icon: 'syringe',
                description: 'Dye test to evaluate blood vessel leakage',
                accuracy: '92%',
                pros: ['Shows blood flow', 'Identifies leakage', 'Gold standard'],
                cons: ['Invasive', 'Dye allergies', 'Time-consuming']
              },
              {
                name: 'AI-Based Screening',
                icon: 'robot',
                description: 'Automated detection using deep learning algorithms',
                accuracy: '90-95%',
                pros: ['Fast analysis', 'Consistent results', 'Accessible'],
                cons: ['Requires validation', 'Not FDA approved everywhere']
              }
            ].map((method, idx) => (
              <div key={idx} className={styles.methodCard}>
                <div className={styles.methodIcon}>
                  <i className={`fas fa-${method.icon}`}></i>
                </div>
                <h4>{method.name}</h4>
                <p>{method.description}</p>
                <div className={styles.accuracy}>
                  Accuracy: <strong>{method.accuracy}</strong>
                </div>
                <div className={styles.prosCons}>
                  <div className={styles.pros}>
                    <strong>Advantages:</strong>
                    <ul>
                      {method.pros.map((pro, i) => (
                        <li key={i}><i className="fas fa-check"></i> {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.cons}>
                    <strong>Limitations:</strong>
                    <ul>
                      {method.cons.map((con, i) => (
                        <li key={i}><i className="fas fa-times"></i> {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    treatment: {
      title: 'Treatment Options',
      icon: 'user-md',
      content: (
        <div className={styles.content}>
          <div className={styles.treatmentGrid}>
            {[
              {
                name: 'Anti-VEGF Injections',
                icon: 'syringe',
                indication: 'DME, PDR',
                frequency: 'Monthly to quarterly',
                efficacy: '60-80% improvement',
                description: 'Intravitreal injections to reduce swelling and prevent new vessel growth'
              },
              {
                name: 'Laser Photocoagulation',
                icon: 'burn',
                indication: 'Severe NPDR, PDR',
                frequency: 'Single or multiple sessions',
                efficacy: '50% risk reduction',
                description: 'Laser treatment to seal leaking vessels and prevent progression'
              },
              {
                name: 'Vitrectomy Surgery',
                icon: 'cut',
                indication: 'Advanced PDR',
                frequency: 'As needed',
                efficacy: '60-80% vision restoration',
                description: 'Surgical removal of vitreous gel to treat complications'
              },
              {
                name: 'Steroid Implants',
                icon: 'pills',
                indication: 'DME',
                frequency: 'Every 3-6 months',
                efficacy: '30-40% improvement',
                description: 'Long-acting implants to reduce inflammation and swelling'
              }
            ].map((treatment, idx) => (
              <div key={idx} className={styles.treatmentCard}>
                <div className={styles.treatmentIcon}>
                  <i className={`fas fa-${treatment.icon}`}></i>
                </div>
                <h4>{treatment.name}</h4>
                <p>{treatment.description}</p>
                <div className={styles.treatmentDetails}>
                  <div className={styles.detail}>
                    <span>Indication:</span>
                    <strong>{treatment.indication}</strong>
                  </div>
                  <div className={styles.detail}>
                    <span>Frequency:</span>
                    <strong>{treatment.frequency}</strong>
                  </div>
                  <div className={styles.detail}>
                    <span>Efficacy:</span>
                    <strong>{treatment.efficacy}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  return (
    <div className={styles.infoContainer}>
      {/* Sidebar Navigation */}
      <aside className={styles.sidebar}>
        {Object.entries(sections).map(([key, section]) => (
          <button
            key={key}
            className={`${styles.navBtn} ${activeSection === key ? styles.active : ''}`}
            onClick={() => setActiveSection(key)}
          >
            <i className={`fas fa-${section.icon}`}></i>
            <span>{section.title}</span>
          </button>
        ))}
      </aside>

      <main className={styles.mainContent}>
        <h2>
          <i className={`fas fa-${sections[activeSection].icon}`}></i>
          {sections[activeSection].title}
        </h2>
        {sections[activeSection].content}
      </main>
    </div>
  );
}