import React, { useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import resumeImage from '../../assets/resume.png'

const Home = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [atsScore, setAtsScore] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'application/pdf' || file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')) {
      setResumeFile(file);
    }
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar/>

      {/* Guide Section */}
      {/* Guide and ATS Section Side-by-Side */}
      <div className="top-info-section">
        <section className="guide-section">
          <h2>How It Works</h2> 
          <div className="guide-content">
            <p>1. Upload your resume (PDF or DOC)</p>
            <p>2. Paste the job description</p>
            <p>3. Get instant ATS score analysis</p>
            <p>4. Generate optimized cover letter</p>
            <p>5. Edit and improve your resume directly</p>
          </div>
        </section>

        <div className="ats-score-box">
          {atsScore ? (
            <>
              <h3>Your ATS Score: {atsScore}/100</h3>
              <div className="score-analysis">
                <div className="strengths">
                  <h4>✅ Strong Points:</h4>
                  <ul>
                    <li>Keyword matches (85%)</li>
                    <li>Experience alignment</li>
                    <li>Education requirements met</li>
                  </ul>
                </div>
                <div className="improvements">
                  <h4>⚠️ Areas to Improve:</h4>
                  <ul>
                    <li>Missing certification</li>
                    <li>Skill gap in project management</li>
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p>Your ATS score will appear here after analysis</p>
          )}
          <button className="edit-btn">Edit Resume</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Left Section - Resume Upload */}
        <div className="upload-section">
          <div className="upload-area">
            <input 
              type="file" 
              id="resume-upload" 
              hidden 
              onChange={handleFileUpload}
              accept=".pdf,.doc,.docx"
            />
            <label htmlFor="resume-upload" className="upload-label">
              {resumeFile ? (
                <div className="resume-preview">
                  <img src={resumeImage} alt="CV Icon" className="resume-icon" />
                  <span className="resume-name">{resumeFile.name}</span>
                </div>
              ) : (
                'Drag & Drop or Click to Upload Resume'
              )}
            </label>
          </div>
        </div>

        {/* Right Section - Job Description */}
        <div className="jd-section">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Enter the Job Description Here"
            className="jd-textarea"
          />
        </div>
      </div>

    </div>
  );
};

export default Home;