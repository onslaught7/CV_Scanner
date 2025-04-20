import { useRef, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import resumeImage from '../../assets/resume.png'
import { useAppStore } from '../../store/index.js';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { UPLOAD_RESUME_ROUTE, CALCULATE_ATS_ROUTE } from '../../utils/constants.js';
import { FaDownload } from "react-icons/fa6";
import { apiClient } from '../../lib/api_client.js';

const Home = () => {
  const { userInfo, toastMessage, clearToastMessage } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState();
  const [atsScore, setAtsScore] = useState();
  const [matchingKeyWords, setMatchingKeyWords] = useState({});
  const [missingKeyWords, setMissingKeywords] = useState({});
  const [menuOpen, setMenuOpen] = useState(false);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (toastMessage && !hasShownToast.current) {
      toast.success(toastMessage);
      clearToastMessage();
      hasShownToast.current = true;
    }
  }, [toastMessage, clearToastMessage]);

  useEffect(() => {
    if (resumeFile) {
      console.log("Updated resume file in state:", resumeFile);
      console.log("Ats Score: ", atsScore);
      console.log("Matching Keywords: ", matchingKeyWords);
      console.log("Missing Keywords: ", missingKeyWords);
    }
  }, [resumeFile, atsScore, matchingKeyWords, missingKeyWords]);

  const handleResumeChange = (file) => {
    if (file) {
      setResumeFile(file)
      console.log("Resume added: ", file);
    } else {
      toast.error("Unsupported file format");
    }
  }

  const handleResumeUpload = async (file) => {
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const response = await apiClient.post(
        UPLOAD_RESUME_ROUTE,
        formData,
        { withCredentials: true },
      )

      if (response.status === 200) {
        toast.success("Resume uploaded");
        setResumeFile(file);
      } else {
        setResumeFile(undefined);
      }
    } catch (error) {
      toast.error("Unexpected error uploading resume");
      console.error("Unexpected error", error);
    }
  }

  const handleCalculateAts = async () => {
    try {
      if (resumeFile && jobDescription) {
        const response = await apiClient.post(
          CALCULATE_ATS_ROUTE,
          { jobDescription },
          { withCredentials: true }
        )

        if (response.status === 200) {
          const { atsScore, keyWordsMatch, keyWordsMissing } = response.data;
          setAtsScore(atsScore);
          setMatchingKeyWords(keyWordsMatch);
          setMissingKeywords(keyWordsMissing);
        }
      } else {
        toast.error("Both Resume and Job Description required for ATS Score");
      }
    } catch (error) {
      toast.error("Error analysing resume");
      console.error("Error analysing resume", error);
    }
  }

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar/>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Custom styles for different types
          success: {
            style: {
              background: 'green',
            },
          },
          error: {
            style: {
              background: 'red',
            },
          },
        }}
      />
      {userInfo ? 
      <h2 className="welcome-message">Hi {userInfo.name} 👋 let's get to building the best Resume </h2> :
      <h2 className="welcome-message">Hi Explorer 👋 let's get to building the best Resume</h2>
      }

      {/* Guide Section */}
      {/* Guide and ATS Section Side-by-Side */}
      <div className="top-info-section">
        <section className="guide-section">
          <h2>How It Works</h2> 
          <div className="guide-content">
            <p>Upload your resume (PDF or DOCX)</p>
            <p>Paste the job description</p>
            <p>Click on Calculate Score</p>
            <p>Get instant ATS score analysis</p>
            <p>Generate optimized cover letter and recommendations</p>
          </div>
          <div className="guide-buttons">
            <button 
              className="guide-btn"
              onClick={handleCalculateAts}
            >
              Calculate Score
            </button>
            <button className="guide-btn">Generate Cover Letter</button>
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
          <button className="edit-btn"><FaDownload /> Cover Letter</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Left Section - Resume Upload */}
        <div className="upload-section">
          <div className="upload-area">
            <input 
              type="file" 
              name='file'
              id="resume-upload" 
              hidden 
              onChange={(e) => handleResumeChange(e.target.files[0])}
              accept=".pdf,.doc,.docx"
            />
            <label htmlFor="resume-upload" className="upload-label">
              {resumeFile ? (
                <div className="resume-preview">
                  <img src={resumeImage} alt="CV Icon" className="resume-icon" />
                  <span className="resume-name">{resumeFile.name}</span>
                  <button
                    className='upload-confirm-btn'
                    onClick={() => handleResumeUpload(resumeFile)}
                  >
                    Upload Resume
                  </button>
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