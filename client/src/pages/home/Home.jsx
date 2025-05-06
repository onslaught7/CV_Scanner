import { useRef, useState, useEffect } from 'react';
import './Home.css';
import Navbar from '../../components/Navbar';
import resumeImage from '../../assets/resume.png';
import { useAppStore } from '../../store/index.js';
import toast, { Toaster } from 'react-hot-toast';
import { UPLOAD_RESUME_ROUTE, CALCULATE_ATS_ROUTE, GENERATE_COVERLETTER_ROUTE } from '../../utils/constants.js';
import { FaDownload } from "react-icons/fa6";
import { apiClient } from '../../lib/api_client.js';
import { MdOutlineCalculate } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
// Removed flushSync as it's not needed for this state-based approach
import Jobs from '../jobs/Jobs.jsx';
// Optional: If you want a visual spinner, import it here
// import { ClipLoader } from "react-spinners";

const Home = () => {
  const { showJobs, userInfo, toastMessage, clearToastMessage } = useAppStore();
  const [jobDescription, setJobDescription] = useState('');
  const [resumeFile, setResumeFile] = useState();
  const [atsScore, setAtsScore] = useState();
  const [matchingKeyWords, setMatchingKeyWords] = useState([]);
  const [missingKeyWords, setMissingKeywords] = useState([]);

  // --- State for Loading Indicators ---
  const [isCalculatingAts, setIsCalculatingAts] = useState(false);
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
  // Keep resume upload logic separate for now as requested, but ideally it would use a similar state
  // const [isUploadingResume, setIsUploadingResume] = useState(false);

  const hasShownToast = useRef(false);

  useEffect(() => {
    if (toastMessage && !hasShownToast.current) {
      toast.success(toastMessage);
      clearToastMessage();
      hasShownToast.current = true;
    }
  }, [toastMessage, clearToastMessage]);

  const handleResumeChange = (file) => {
    if (file) {
      setAtsScore(undefined);
      setMatchingKeyWords([]);
      setMissingKeywords([]);
      setResumeFile(file);
      console.log("Resume selected: ", file);
    } else {
      toast.error("No file selected or unsupported format");
    }
  };

  // --- Resume Upload Handler (Unchanged as requested, still uses toast for loading) ---
  const handleResumeUpload = async (file) => {
    if (!file) {
        toast.error("No resume file selected to upload.");
        return;
    }
    const formData = new FormData();
    formData.append("resume", file);
    const toastId = toast.loading("Uploading Resume..."); // Start loading toast

    try {
      const response = await apiClient.post(
        UPLOAD_RESUME_ROUTE,
        formData,
        { withCredentials: true },
      );

      if (response.status === 200) {
        toast.dismiss(toastId); // Dismiss loading toast
        toast.success("Resume uploaded successfully");
      } else {
        toast.dismiss(toastId); // Dismiss loading toast
        toast.error(`Resume upload failed (Status: ${response.status})`);
        setResumeFile(undefined); // Clear state on failure
      }
    } catch (error) {
      toast.dismiss(toastId); // Dismiss loading toast on error
      toast.error("Unexpected error uploading resume");
      console.error("Unexpected error", error);
      setResumeFile(undefined); // Clear state on error
    }
  };

  // --- Calculate ATS Handler (Using State for Loading) ---
  const handleCalculateAts = async () => {
    if (!resumeFile || !jobDescription) {
      toast.error("Both Resume and Job Description required for ATS Score");
      return;
    }
    if (isCalculatingAts || isGeneratingCoverLetter) return; // Prevent overlap

    setIsCalculatingAts(true); // <<< SET LOADING STATE TO TRUE
    setAtsScore(undefined); // Clear previous score visually immediately

    try {
      const response = await apiClient.post(
        CALCULATE_ATS_ROUTE,
        { jobDescription },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const { atsScore, keyWordsMatching, keyWordsMissing } = response.data;
        // Update state with results
        setAtsScore(atsScore);
        setMatchingKeyWords(keyWordsMatching);
        setMissingKeywords(keyWordsMissing);
        // Show final success notification toast
        toast.success("Score Calculated");
      } else {
         // Show final error notification toast
         toast.error(`Failed to calculate score (Status: ${response.status})`);
         // Score remains undefined
      }
    } catch (error) {
      // Show final error notification toast
      toast.error("Error analysing resume, try again");
      console.error("Error analysing resume", error);
      // Score remains undefined
    } finally {
      setIsCalculatingAts(false); // <<< SET LOADING STATE TO FALSE (always runs)
    }
  };

  // --- Generate Cover Letter Handler (Using State for Loading) ---
  const handleGenerateCoverLetter = async () => {
    if (!resumeFile || !jobDescription) {
      toast.error("Include both the resume and the job description");
      return;
    }
     if (isCalculatingAts || isGeneratingCoverLetter) return; // Prevent overlap

    setIsGeneratingCoverLetter(true); // <<< SET LOADING STATE TO TRUE

    try {
      const response = await apiClient.post(
        GENERATE_COVERLETTER_ROUTE,
        { jobDescription },
        { withCredentials: true, responseType: 'blob' }
      );

      if (response.status === 200) {
        // Trigger download
        const blob = new Blob([response.data], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'cover_letter.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);

        // Show final success notification toast
        toast.success("Cover Letter Generated & Downloaded");
      } else {
        let errorMsg = `Failed to generate cover letter (Status: ${response.status})`;
        try {
            const errorText = await response.data.text();
            const errorJson = JSON.parse(errorText);
            errorMsg = errorJson.message || errorMsg;
        } catch (parseError) {}
        // Show final error notification toast
        toast.error(errorMsg);
      }
    } catch (error) {
      // Show final error notification toast
      toast.error("Error generating cover letter, try again");
      console.error("Error generating cover letter", error);
    } finally {
      setIsGeneratingCoverLetter(false); // <<< SET LOADING STATE TO FALSE (always runs)
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
          // No loading style needed in Toaster config for this approach
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
            {/* ... guide content ... */}
            <p>Upload your resume (PDF or DOCX)</p>
            <p>Paste the job description</p>
            <p>Click on Calculate Score</p>
            <p>Get instant ATS score analysis</p>
            <p>Generate optimized cover letter</p>
          </div>
          <div className="guide-buttons">
            {/* --- Calculate Score Button --- */}
            <button
              className="guide-btn"
              onClick={handleCalculateAts}
              // Disable button if inputs missing OR if EITHER action is loading
              disabled={!resumeFile || !jobDescription || isCalculatingAts || isGeneratingCoverLetter}
            >
              {isCalculatingAts ? (
                'Calculating...' // <<< Show loading text
              ) : (
                <><MdOutlineCalculate /> Calculate Score</> // Show normal text/icon
              )}
            </button>
            {/* --- Generate Cover Letter Button --- */}
            <button className="guide-btn"
              onClick={handleGenerateCoverLetter}
              // Disable button if inputs missing OR if EITHER action is loading
              disabled={!resumeFile || !jobDescription || isCalculatingAts || isGeneratingCoverLetter}
            >
              {isGeneratingCoverLetter ? (
                'Generating...' // <<< Show loading text
              ) : (
                <><FaDownload /> Generate Cover Letter</> // Show normal text/icon
              )}
            </button>
          </div>
        </section>

        {/* --- ATS Score Box --- */}
        <div className="ats-score-box">
          {isCalculatingAts ? ( // <<< Check loading state FIRST
            <div className="loading-indicator">
              {/* You can add a spinner icon here if you like */}
              {/* <ClipLoader size={35} color={"#123abc"} loading={true} /> */}
              <p>Calculating Score...</p> {/* <<< Show loading indicator */}
            </div>
          ) : atsScore !== undefined ? ( // If not loading, check if score exists
            <>
              {/* ... existing score display logic ... */}
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
          ) : ( // If not loading and no score, show default text
            <p>Your ATS score will appear here after analysis.</p>
          )}
          {/* Disable edit button while calculating */}
          <button className="edit-btn" disabled={isCalculatingAts}><FaRegEdit />Edit Resume</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-grid">
        {/* Left Section - Resume Upload (Unchanged as requested) */}
        <div className="upload-section">
          <div className="upload-area">
            <input
              type="file" name='file' id="resume-upload" hidden
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
                    onClick={(e) => { e.preventDefault(); handleResumeUpload(resumeFile); }}
                  >
                    Upload Resume
                  </button>
                </div>
              ) : ( 'Drag & Drop or Click to Upload Resume' )}
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
            // Optionally disable textarea while actions are running
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