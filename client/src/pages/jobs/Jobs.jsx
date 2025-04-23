import { useEffect, useState } from "react";
import "./Jobs.css";
import { apiClient } from "../../lib/api_client";
import { toast } from "react-hot-toast";
import { GET_JOBS_ROUTES } from "../../utils/constants.js";

const Jobs = ({ setJobDescription }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    field: "",
    geoid: "",
    page: 1,
    sortBy: "",
    jobType: "",
    expLevel: "",
    workType: "",
    filterByCompany: "",
  });
  const [totalPages, setTotalPages] = useState(1);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(
        GET_JOBS_ROUTES,
        filters,
        { withCredentials: true }
      );

      if (response.status === 200) {
        setJobs(response.data.jobs);
        setTotalPages(response.data.totalPages || 1);
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
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value, page: 1 });
  };

  return (
    <div className="jobs-container" id="jobs-section">
      <h2 className="jobs-header">🔍 Browse Jobs</h2>

      <div className="jobs-filters">
        <select name="field" onChange={handleFilterChange}>
          <option value="">Field</option>
          <option value="Data Analyst">Data Analyst</option>
          <option value="Web Developer">Web Developer</option>
        </select>

        <select name="geoid" onChange={handleFilterChange}>
          <option value="">Location</option>
          <option value="103644278">United States</option>
          <option value="102713980">India</option>
        </select>

        <select name="workType" onChange={handleFilterChange}>
          <option value="">Work Type</option>
          <option value="REMOTE">Remote</option>
          <option value="ONSITE">Onsite</option>
          <option value="HYBRID">Hybrid</option>
        </select>

        <select name="sortBy" onChange={handleFilterChange}>
          <option value="">Sort By</option>
          <option value="date">Newest</option>
          <option value="relevance">Relevance</option>
        </select>

        <select name="jobType" onChange={handleFilterChange}>
          <option value="">Job Type</option>
          <option value="FULLTIME">Full-Time</option>
          <option value="CONTRACT">Contract</option>
        </select>

        <select name="expLevel" onChange={handleFilterChange}>
          <option value="">Experience</option>
          <option value="ENTRY_LEVEL">Entry</option>
          <option value="MID_SENIOR">Mid</option>
        </select>
      </div>

      <div className="jobs-list">
        {loading ? (
          <p className="jobs-loading">Loading jobs...</p>
        ) : jobs.length > 0 ? (
          jobs.map((job, idx) => (
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
              <p>
                <strong>Location:</strong> {job.job_location}
              </p>
              <p>
                <strong>Posted On:</strong> {job.job_posting_date}
              </p>
              <button className="job-desc-btn" onClick={() => setJobDescription(job.job_position)}>
                Use this for ATS
              </button>
            </div>
          ))
        ) : (
          <p className="jobs-empty">No jobs found. Try changing filters.</p>
        )}
      </div>

      <div className="jobs-pagination">
        <button
          disabled={filters.page <= 1}
          onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
        >
          &lt;
        </button>
        <span>{filters.page} / {totalPages}</span>
        <button
          disabled={filters.page >= totalPages}
          onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Jobs;