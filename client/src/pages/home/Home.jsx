import { useRef, useState } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import resumeImage from '../../assets/resume.png'
import { useAppStore } from '../../store/index.js';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { UPLOAD_RESUME_ROUTE, CALCULATE_ATS_ROUTE, GENERATE_COVERLETTER_ROUTE } from '../../utils/constants.js';
import { FaDownload } from "react-icons/fa6";
import { apiClient } from '../../lib/api_client.js';
import { MdOutlineCalculate } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import { flushSync } from 'react-dom';
import Jobs from '../jobs/Jobs.jsx';

const Home = () => {
  const { showJobs, userInfo, toastMessage, clearToastMessage } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState();
  const [atsScore, setAtsScore] = useState();
  const [matchingKeyWords, setMatchingKeyWords] = useState([]);
  const [missingKeyWords, setMissingKeywords] = useState([]);

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
        const toastId = toast.loading('Calculating Score...');
        const response = await apiClient.post(
          CALCULATE_ATS_ROUTE,
          { jobDescription },
          { withCredentials: true }
        )

        if (response.status === 200) {
          const { atsScore, keyWordsMatching, keyWordsMissing } = response.data;
          flushSync(() => {
            setAtsScore(atsScore);
            setMatchingKeyWords(keyWordsMatching);
            setMissingKeywords(keyWordsMissing);
          });
        
          toast.dismiss(toastId);
          toast.success("Score Calculated");
        }
      } else {
        toast.error("Both Resume and Job Description required for ATS Score");
      }
    } catch (error) {
      toast.error("Error analysing resume, try again");
      console.error("Error analysing resume", error);
    }
  }

  const handleGenerateCoverLetter = async () => {
    try{
      if (resumeFile && jobDescription) {
        const toastId = toast.loading('Generating Cover Letter...');
        const response = await apiClient.post(
          GENERATE_COVERLETTER_ROUTE,
          { jobDescription },
          { withCredentials: true }
        );

        if (response.status === 200) {
          const coverLetter  = response.data;

          flushSync(() => {
            console.log(coverLetter)
            const link = document.createElement('a');
            const blob = new Blob([response.data], { type: 'text/plain' });
            link.href = URL.createObjectURL(blob);
            link.download = 'cover_letter.txt'; // Filename for the downloaded file
            link.click();
          })

          toast.success("Cover Letter Generated");
          toast.dismiss(toastId);
          // Logic to download the cover letter on client side
        } else {
          toast.error("Make sure resume has been uploaded and job description is included");
        }
      }
    } catch (error) {
      toast.error("Error generating cover letter, try again");
      console.error("Error generating cover letter", error);
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
              <MdOutlineCalculate /> Calculate Score
            </button>
            <button className="guide-btn"
              onClick={handleGenerateCoverLetter}
            >
              <FaDownload /> Generate Cover Letter
            </button>
          </div>
        </section>

        <div className="ats-score-box">
          {atsScore ? (
            <>
              <h3
                style = {
                  {
                    color: 
                      atsScore <= 30 ? "red" : atsScore < 80 ? "orange" : "green"
                  }
                }
              >
                Your ATS Score: {atsScore}%
              </h3>
              <div className="score-analysis">
                <div className="strengths">
                  <h4>✅ Keywords Matching:</h4>
                  <ul>
                    {
                      matchingKeyWords.length > 0 ? (
                        matchingKeyWords.map((keyword, index) => (
                          <li key={index}>{keyword}</li>
                        )) 
                      ) : (
                        <li>❌ No Matching Keywords</li>
                      )
                    }
                  </ul>
                </div>
                <div className="improvements">
                  <h4>⚠️ Keywords Missing:</h4>
                  <ul>
                    {
                      missingKeyWords.length > 0 ? (
                        missingKeyWords.map((keyword, index) => (
                          <li key={index}>{keyword}</li>
                        ))
                      ) : (
                        <li>✅ Great, Perfect Match</li>
                      )
                    }
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p>Your ATS score will appear here after analysis</p>
          )}
          <button className="edit-btn"><FaRegEdit />Edit Resume</button>
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
      
      {showJobs && (
        <div id="jobs-section">
          <Jobs setJobDescription={setJobDescription} />
        </div>
      )}
    </div>
  );
};

export default Home;