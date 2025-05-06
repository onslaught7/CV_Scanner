import { useRef, useState, useEffect } from 'react';
import './Home.css'; // Make sure to add styles for 'drag-over' class in this file
import Navbar from '../../components/Navbar';
import resumeImage from '../../assets/resume.png';
import { useAppStore } from '../../store/index.js';
import toast, { Toaster } from 'react-hot-toast';
import { UPLOAD_RESUME_ROUTE, CALCULATE_ATS_ROUTE, GENERATE_COVERLETTER_ROUTE } from '../../utils/constants.js';
import { FaDownload } from "react-icons/fa6";
import { apiClient } from '../../lib/api_client.js';
import { MdOutlineCalculate } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Jobs from '../jobs/Jobs.jsx';

const Home = () => {
  const { showJobs, userInfo, toastMessage, clearToastMessage } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState();
  const [atsScore, setAtsScore] = useState();
  const [matchingKeyWords, setMatchingKeyWords] = useState([]);
  const [missingKeyWords, setMissingKeywords] = useState([]);

  const [isCalculatingAts, setIsCalculatingAts] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  // --- State for Drag & Drop Visual Cue ---
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (toastMessage && !hasShownToast.current) {
      toast.success(toastMessage);
      clearToastMessage();
      hasShownToast.current = true;
    }
  }, [toastMessage, clearToastMessage]);

  // --- Updated handleResumeChange to accept file and validate ---
  const handleResumeChange = (file) => {
    if (file) {
      // Basic validation (can be expanded)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (allowedTypes.includes(file.type)) {
          setAtsScore(undefined);
          setMatchingKeyWords([]);
          setMissingKeywords([]);
          setResumeFile(file);
          console.log("Resume selected/dropped: ", file);
      } else {
          toast.error("Invalid file type. Please upload PDF, DOC, or DOCX.");
          setResumeFile(undefined); // Clear if invalid file was previously set
      }
    } else {
      toast.error("No file selected or unsupported format");
    }
  };

  // --- Resume Upload Handler (Unchanged) ---
  const handleResumeUpload = async (file) => {
    if (!file) {
        toast.error("No resume file selected to upload.");
        return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    const toastId = toast.loading("Uploading Resume...");

    try {
      const response = await apiClient.post(
        UPLOAD_RESUME_ROUTE,
        formData,
        { withCredentials: true },
      );

      if (response.status === 200) {
        toast.dismiss(toastId);
        toast.success("Resume uploaded successfully");
      } else {
        toast.dismiss(toastId);
        toast.error(`Resume upload failed (Status: ${response.status})`);
        setResumeFile(undefined);
      }
    } catch (error) {
      toast.dismiss(toastId);
      toast.error("Unexpected error uploading resume");
      console.error("Unexpected error", error);
      setResumeFile(undefined);
    }
  };

  // --- Calculate ATS Handler (Unchanged) ---
  const handleCalculateAts = async () => {
    if (!resumeFile || !jobDescription) {
      toast.error("Both Resume and Job Description required for ATS Score");
      return;
    }
    if (isCalculatingAts || isGeneratingCoverLetter) return;

    setIsCalculatingAts(true);
    setAtsScore(undefined);

    try {
      const response = await apiClient.post(
        CALCULATE_ATS_ROUTE,
        { jobDescription },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { atsScore, keyWordsMatching, keyWordsMissing } = response.data;
        setAtsScore(atsScore);
        setMatchingKeyWords(keyWordsMatching);
        setMissingKeywords(keyWordsMissing);
        toast.success("Score Calculated");
      } else {
         toast.error(`Failed to calculate score (Status: ${response.status})`);
      }
    } catch (error) {
      toast.error("Error analysing resume, try again");
      console.error("Error analysing resume", error);
    } finally {
      setIsCalculatingAts(false);
    }
  };

  // --- Generate Cover Letter Handler (Unchanged) ---
  const handleGenerateCoverLetter = async () => {
    if (!resumeFile || !jobDescription) {
      toast.error("Include both the resume and the job description");
      return;
    }
     if (isCalculatingAts || isGeneratingCoverLetter) return;

    setIsGeneratingCoverLetter(true);

    try {
      const response = await apiClient.post(
        GENERATE_COVERLETTER_ROUTE,
        { jobDescription },
        { withCredentials: true, responseType: 'blob' }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cover_letter.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success("Cover Letter Generated & Downloaded");
      } else {
        let errorMsg = `Failed to generate cover letter (Status: ${response.status})`;
        try {
            const errorText = await response.data.text();
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorMsg;
        } catch (parseError) {}
        toast.error(errorMsg);
      }
    } catch (error) {
      toast.error("Error generating cover letter, try again");
      console.error("Error generating cover letter", error);
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // --- Drag and Drop Event Handlers ---
  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    setIsDraggingOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDraggingOver(false);

    // Check if files were dropped
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0]; // Get the first file
      handleResumeChange(droppedFile); // Use the existing handler for validation and state update
      e.dataTransfer.clearData(); // Clean up the data transfer object
    }
  };


  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar/>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#363636', color: '#fff' },
          success: { style: { background: 'green' } },
          error: { style: { background: 'red' } },
        }}
      />
      {userInfo ?
      <h2 className="welcome-message">Hi {userInfo.name} 👋 let's get to building the best Resume </h2> :
      <h2 className="welcome-message">Hi Explorer 👋 let's get to building the best Resume</h2>
      }

      {/* Guide and ATS Section Side-by-Side */}
      <div className="top-info-section">
        <section className="guide-section">
          <h2>How It Works</h2>
          <div className="guide-content">
            <p>Upload your resume (PDF or DOCX)</p>
            <p>Paste the job description</p>
            <p>Click on Calculate Score</p>
            <p>Get instant ATS score analysis</p>
            <p>Generate optimized cover letter</p>
          </div>
          <div className="guide-buttons">
            <button
              className="guide-btn"
              onClick={handleCalculateAts}
              disabled={!resumeFile || !jobDescription || isCalculatingAts || isGeneratingCoverLetter}
            >
              {isCalculatingAts ? ('Calculating...') : (<><MdOutlineCalculate /> Calculate Score</>)}
            </button>
            <button className="guide-btn"
              onClick={handleGenerateCoverLetter}
              disabled={!resumeFile || !jobDescription || isCalculatingAts || isGeneratingCoverLetter}
            >
              {isGeneratingCoverLetter ? ('Generating...') : (<><FaDownload /> Generate Cover Letter</>)}
            </button>
          </div>
        </section>

        <div className="ats-score-box">
          {isCalculatingAts ? (
            <div className="loading-indicator">
              <p>Calculating Score...</p>
            </div>
          ) : atsScore !== undefined ? (
            <>
              <h3 style = {{ color: atsScore <= 30 ? "red" : atsScore < 80 ? "orange" : "green" }}>
                Your ATS Score: {atsScore}%
              </h3>
              <div className="score-analysis">
                <div className="strengths">
                  <h4>✅ Keywords Matching:</h4>
                  <ul>
                    { matchingKeyWords.length > 0 ? ( matchingKeyWords.map((keyword, index) => (<li key={index}>{keyword}</li>)) ) : ( <li>➖ No Matching Keywords Found</li> )}
                  </ul>
                </div>
                <div className="improvements">
                  <h4>⚠️ Keywords Missing:</h4>
                  <ul>
                    { missingKeyWords.length > 0 ? ( missingKeyWords.map((keyword, index) => (<li key={index}>{keyword}</li>)) ) : ( atsScore >= 80 ? <li>✅ Great, Perfect Match!</li> : <li>➖ No Missing Keywords Found</li> )}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <p>Your ATS score will appear here after analysis.</p>
          )}
          <button className="edit-btn" disabled={isCalculatingAts}><FaRegEdit />Edit Resume</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* --- Left Section - Resume Upload (Drag/Drop Enabled) --- */}
        <div className="upload-section">
          <div className="upload-area">
            <input
              type="file"
              name='file'
              id="resume-upload"
              hidden
              // Use handleResumeChange directly for click uploads
              onChange={(e) => handleResumeChange(e.target.files[0])}
              accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // Ensure accept matches validation
            />
            {/* --- Add Drag & Drop handlers to the label --- */}
            <label
              htmlFor="resume-upload"
              className={`upload-label ${isDraggingOver ? 'drag-over' : ''}`} // Add class when dragging over
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {resumeFile ? (
                <div className="resume-preview">
                  <img src={resumeImage} alt="CV Icon" className="resume-icon" />
                  <span className="resume-name">{resumeFile.name}</span>
                  {/* Button only triggers the API call */}
                  <button
                    className='upload-confirm-btn'
                    onClick={(e) => {
                        e.preventDefault(); // Prevent label click trigger if clicking button
                        handleResumeUpload(resumeFile);
                    }}
                  >
                    Upload Resume
                  </button>
                </div>
              ) : (
                 // Change text slightly based on drag state
                 isDraggingOver ? 'Drop Resume Here' : 'Drag & Drop or Click to Upload Resume'
              )}
            </label>
          </div>
        </div>

        {/* Right Section - Job Description */}
        <div className="jd-section">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the Job Description Here"
            className="jd-textarea"
            disabled={isCalculatingAts || isGeneratingCoverLetter}
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

/* --- Add this CSS to your Home.css file --- */
/*

*/