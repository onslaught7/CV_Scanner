Things to do 
🔐 Security
❗ Add rate limiting to prevent abuse of resume uploads.
❗ Sanitize file uploads on backend (filenames, MIME type check).
❗ Avoid printing secrets like ORIGIN in prod logs.

🧪 Testing
Add unit and integration tests with something like:
Backend: pytest, httpx, pytest-asyncio
Frontend: Vitest, Jest, or React Testing Library

- Add a logic to counter if gpt fails to return a JSON only return 
- I can also add features where after the jobs are pulled using the api, the job 
descriptions of those jobs will be pulled directly and the ats scores will be
automatically calcuated and displayed on the right of each job