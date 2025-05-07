
# 📄 CV Scanner

A full-stack **AI-powered Resume and Job Assistant** that streamlines the job application process. Users can upload their resume, paste job descriptions, and instantly receive ATS scores, tailored cover letters, and relevant job listings — all in one place.

Built with a **Vite + React frontend**, a **FastAPI backend**, and **PostgreSQL** as the database. Features OAuth2 login, JWT session management, and intelligent resume parsing to reduce manual labor during job applications.

---

## 🚀 Features

- 🔐 **OAuth2 Authentication**: Secure user login powered by Google OAuth.
- 🔐 **Session Management**: Managed via JWT tokens for secure communication.
- 📄 **Resume Upload**: Upload PDFs in either pdf/docx format and parse key information.
- 💼 **Job Description Match (ATS Score)**: Paste a job description and instantly get an ATS score based on keyword matching.
- ✍️ **Cover Letter Generator**: AI-generated personalized cover letters.
- 🔍 **Job Finder**: Uses the [ScrapingDog API](https://www.scrapingdog.com/) to fetch real-time jobs from LinkedIn based on user preferences.
- 🧠 **Mock Interview Tool (Planned)**: Simulate job interviews with AI-based Q&A.
- 🧮 **Similarity & Fit Analysis**: Quantifies how well a resume matches a job description.

---

## 🧰 Tech Stack

| Layer        | Tech                              |
|--------------|-----------------------------------|
| **Frontend** | React (Vite), Tailwind CSS, Axios |
| **Backend**  | FastAPI, Python 3.12              |
| **Database** | PostgreSQL                        |
| **Auth**     | OAuth2 with JWT sessions          |
| **Other APIs** | ScrapingDog API (Job scraping)  |

---

## 📁 Project Structure

```
CV_SCANNER/
├── client/             # Frontend (React + Vite)
│   ├── src/            # React components and logic
│   ├── .env            # React environment variables
├── server/             # Backend (FastAPI)
│   ├── app/            # Application logic (routes, services)
│   ├── uploads/        # Uploaded resumes
│   ├── .env            # FastAPI environment variables
│   ├── main.py         # App entrypoint
│   ├── config.py       # DB + settings config
│   └── requirements.txt
└── README.md
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js (v18+)
- Python (v3.12)
- PostgreSQL15

### 1. Clone the Repo

```bash
git clone https://github.com/onslaught7/CV_Scanner.git
cd CV_Scanner
```

### 2. Backend Setup

```bash
cd server
python -m venv .venv
source .venv/bin/activate   # or .venv\Scripts\activate on Windows
pip install -r requirements.txt
```

Add your environment variables in `server/.env`:
Do not omit any environment variable, if not using put a dummy value
```
ENV=development
UPLOAD_DIR=server/uploads/resumes
UPLOAD_MOUNT_PATH=/uploads/resumes
OPENAI_API_KEY=openai-api-key # place a dummy key string but do not omit all together
GEMINI_API_KEY=gemini-api-key # Use gemini-api-key it's free 
SECRET_KEY=use-your-own-rndom-secret-key
ALGORITHM=HS256
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/CV_Scanner_DB
ORIGIN=http://localhost:5173
SCRAPINGDOG_API_KEY=api-key # requires you to create a scrapping dog account and start free tier for 2000 free credits
SCRAPINGDOG_URL=https://api.scrapingdog.com/linkedinjobs
```

Run the FastAPI server at root level:
Example if you have client and server in a folder named project
then /project :

```bash
uvicorn server.main:app --reload
```

### 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```
VITE_API_BASE_URL=http://localhost:8000
```

Run the React app:

```bash
npm run dev
```

---


---

## 🧪 Future Roadmap

- 🤖 Mock Interview Simulator
- 📊 Analytics Dashboard for job search performance
- 🧩 Resume optimizer based on job roles

---

## 🤝 Contributing

We welcome contributions! Please open issues or pull requests for bug fixes, enhancements, or new features.