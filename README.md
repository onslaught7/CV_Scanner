🔐 Security  
❗ Add rate limiting to prevent abuse of resume uploads.  
❗ Sanitize file uploads on backend (filenames, MIME type check).  

🧪 Testing  
Add unit and integration tests with something like:  
Backend: pytest, httpx, pytest-asyncio  
Frontend: Vitest, Jest, or React Testing Library  

- Add logic to handle cases where GPT fails to return a JSON response.  
- Implement a feature to automatically pull job descriptions after jobs are retrieved via the API, calculate ATS scores, and display them alongside each job.  

AI-Powered Resume Optimization Platform  
**Tech Stack:** FastAPI, Python, ReactJS, OpenAI API, AWS, PostgreSQL, Fitz, python-docx  
Built a cloud-native AI platform to simplify job applications by optimizing resume tailoring and job matching.  
- **OpenAI Integration:** Automated cover letter generation and ATS score calculation, reducing manual effort.  
- **Fitz and python-docx:** Used for parsing resumes and job descriptions, ensuring format compatibility and accurate data extraction.  
- **AWS Architecture:** Designed a secure 3-tier setup with EC2 for scalable compute, RDS for reliable database management, and a Load Balancer for traffic distribution and high availability.  
- **Automated Job Description Retrieval:** Implemented to save users time by fetching job descriptions and calculating ATS scores automatically.  
- **LinkedIn Job API Integration:** Enabled seamless job posting retrieval, reducing the need for manual job searches and improving user experience.  
- **JWT Authentication and Session Management:** Secured user sessions with JSON Web Tokens, ensuring stateless authentication and protecting sensitive user data.      
