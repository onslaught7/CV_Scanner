import { useEffect, useState } from "react"; 
import "./Jobs.css";
import { apiClient } from "../../lib/api_client";
import { toast } from "react-hot-toast";
import { GET_JOBS_ROUTES } from "../../utils/constants.js";

const Jobs = ({ setJobDescription }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState(0);
  const [filters, setFilters] = useState({
    field: "",
    geoid: "",
    page: 5,
    sortBy: "",
    jobType: "",
    expLevel: "",
    workType: "",
    filterByCompany: "",
  });
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1); // for frontend pagination
  const jobsPerPage = 10;

  const locationOptions = [
    { name: "United States", value: "103644278" },
    { name: "India", value: "102713980" },
    { name: "Canada", value: "101174742" },
    { name: "Germany", value: "101282230" },
    { name: "United Kingdom", value: "101165590" },
    { name: "Australia", value: "101452733" },
    { name: "France", value: "101501875" },
    { name: "Netherlands", value: "101620260" },
    { name: "Singapore", value: "102454443" },
    { name: "United Arab Emirates", value: "103239033" },
  ];

  const companyOptions = [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "Netflix", "Adobe", "IBM",
    "Intel", "Salesforce", "Oracle", "Cisco", "Uber", "Spotify", "Airbnb", "Snapchat",
    "LinkedIn", "Twitter", "Dropbox", "Zoom", "Stripe", "Coinbase", "Tesla", "Nvidia",
    "Accenture", "Capgemini", "Infosys", "TCS", "Wipro", "Zoho"
  ];

  const fetchJobs = async () => {
    if (!filters.field || !filters.geoid) {
      return; 
    }

    setLoading(true);
    try {
      console.log(filters);
      const response = await apiClient.post(
        GET_JOBS_ROUTES, 
        filters, 
        { withCredentials: true }
      );

      if (response.status === 200) {
        console.log(response.data.jobs)
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages || 1);
        setCurrentPage(1); // reset to first frontend page on new fetch
      }
    } catch (error) {
      console.error("Failed to fetch jobs.", error);
      toast.dismiss();
      toast.error("Failed to fetch jobs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (triggerSearch) fetchJobs();
  }, [filters, triggerSearch]);

  useEffect(() => {
    if (!loading) {
      document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [filters.page]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearchClick = () => {
    if (!filters.field || !filters.geoid) {
      toast.error("Please fill in both Field and Location to search.");
      return;
    }
    setFilters(prev => ({ ...prev, page: 5 }));
    setTriggerSearch(prev => prev + 1);
  };  

  const jobsToRender = jobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <div className="jobs-container" id="jobs-section">
      <h2 className="jobs-header">🔍 Browse Jobs</h2>

      <div className="jobs-filters">
        <input
          type="text"
          placeholder="Enter job field (e.g., Software Engineer)"
          name="field"
          value={filters.field}
          onChange={handleFilterChange}
          className="job-input"
        />

        <select name="geoid" onChange={handleFilterChange}>
          <option value="">Location</option>
          {locationOptions.map((loc, idx) => (
            <option key={idx} value={loc.value}>{loc.name}</option>
          ))}
        </select>

        <select name="workType" onChange={handleFilterChange}>
          <option value="">Work Type</option>
          <option value="Remote">Remote</option>
          <option value="At Work">At Work</option>
          <option value="Hybrid">Hybrid</option>
        </select>

        <select name="sortBy" onChange={handleFilterChange}>
          <option value="">Sort By</option>
          <option value="Day">Day</option>
          <option value="Week">Week</option>
          <option value="Month">Month</option>
        </select>

        <select name="jobType" onChange={handleFilterChange}>
          <option value="">Job Type</option>
          <option value="Temporary">Temporary</option>
          <option value="Full Time">Full Time</option>
          <option value="Contract">Contract</option>
          <option value="Part Time">Part Time</option>
        </select>

        <select name="expLevel" onChange={handleFilterChange}>
          <option value="">Experience</option>
          <option value="Internship">Internship</option>
          <option value="Entry Level">Entry Level</option>
          <option value="Associate Level">Associate Level</option>
          <option value="Mid Senior Level">Mid Senior Level</option>
        </select>

        <select name="filterByCompany" onChange={handleFilterChange}>
          <option value="">Company</option>
          {companyOptions.map((company, idx) => (
            <option key={idx} value={company}>{company}</option>
          ))}
        </select>

        <button className="search-btn" onClick={handleSearchClick}>
          🔎 Search Jobs
        </button>
      </div>

      <div className="jobs-list">
        {loading ? (
          <p className="jobs-loading">Loading jobs...</p>
        ) : jobs && jobs.length > 0 ? (
          jobsToRender.map((job, idx) => (
            <div key={idx} className="job-card">
              <h3>
                <a href={job.job_link} target="_blank" rel="noopener noreferrer">
                  {job.job_position}
                </a>
              </h3>
              <p>
                <strong>Company:</strong>{" "}
                <a href={job.company_profile} target="_blank" rel="noopener noreferrer">
                  {job.company_name}
                </a>
              </p>
              <p><strong>Location:</strong> {job.job_location}</p>
              <p><strong>Posted On:</strong> {job.job_posting_date}</p>
              <button
                className="job-desc-btn"
                onClick={() => setJobDescription(job.job_position)}
              >
                Use this for ATS
              </button>
            </div>
          ))
        ) : (
          triggerSearch && <p className="jobs-empty">No jobs found. Try changing filters.</p>
        )}
      </div>

      <div className="jobs-pagination">
        <button
          disabled={currentPage <= 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          &lt;
        </button>
        <span>{currentPage} / {Math.ceil(jobs.length / jobsPerPage)}</span>
        <button
          disabled={currentPage >= Math.ceil(jobs.length / jobsPerPage)}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Jobs;
