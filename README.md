Things to do 
🔐 Security
❗ Add rate limiting to prevent abuse of resume uploads.
❗ Sanitize file uploads on backend (filenames, MIME type check).
❗ Avoid printing secrets like ORIGIN in prod logs.

🧪 Testing
Add unit and integration tests with something like:
Backend: pytest, httpx, pytest-asyncio
Frontend: Vitest, Jest, or React Testing Library