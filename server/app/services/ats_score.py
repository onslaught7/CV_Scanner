import fitz
import os
from docx import Document
from typing import List, Tuple
import openai
import json
import time
from server.config import settings

# Secure API key setup for OpenAI
OPENAI_API_KEY = settings.OPENAI_API_KEY
client = openai.OpenAI(api_key=OPENAI_API_KEY)


# ----------- Text Extraction -----------
def extract_text_from_resume(file_path: str) -> str:
    _, ext = os.path.splitext(file_path.lower())
    if ext == ".pdf":
        text = ""
        with fitz.open(file_path) as doc:
            for page in doc:
                text += page.get_text()
        return text
    elif ext == ".docx":
        doc = Document(file_path)
        return "\n".join([para.text for para in doc.paragraphs])
    else:
        raise ValueError("Unsupported file format: must be .pdf or .docx")


# ----------- GPT Retry Logic -----------
def call_gpt_with_retry(prompt: str, retries: int = 3, delay: int = 2) -> str:
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a smart, structured ATS resume analyzer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=1000
            )
            return response.choices[0].message.content
        except openai.RateLimitError:
            print(f"[Rate Limit] Attempt {attempt + 1}: retrying in {delay} seconds...")
            time.sleep(delay)
        except openai.OpenAIError as e:
            print(f"[OpenAI Error] Attempt {attempt + 1}: {e}")
            time.sleep(delay)
    raise RuntimeError("GPT API failed after multiple retries.")


# ----------- JSON Validation -----------
def validate_json_response(response_text: str) -> dict:
    try:
        parsed = json.loads(response_text)
        assert "ats_score" in parsed
        assert "matched_keywords" in parsed
        assert "missing_keywords" in parsed
        return parsed
    except (json.JSONDecodeError, AssertionError) as e:
        print("[Validation Error] Invalid JSON returned by GPT:", e)
        raise RuntimeError("GPT did not return valid JSON.")


# ----------- Main ATS Function -----------
def ats_score_and_keywords(resume_path: str, job_description: str) -> Tuple[int, List[str], List[str]]:
    resume_text = extract_text_from_resume(resume_path)

    prompt = f"""
    You are an ATS (Applicant Tracking System) engine. Analyze the following resume text and job description.
    Return a JSON object with the following format:

    {{
    "ats_score": <integer from 0 to 100>,
    "matched_keywords": [list of matched keywords],
    "missing_keywords": [list of missing keywords from the job description]
    }}

    Focus only on relevant skills, qualifications, technologies, and certifications.
    Ignore stop words, general English words, or formatting.

    Be sure to strictly return only the JSON Object and nothing else, since it is directly going to be used in code.
    Make sure to strictly adhere to returning a JSON object.

    Return only the JSON object nothing before and after it.

    Resume:
    \"\"\"
    {resume_text}
    \"\"\"

    Job Description:
    \"\"\"
    {job_description}
    \"\"\"
    """
    try:
        gpt_response = call_gpt_with_retry(prompt)
        ats_data = validate_json_response(gpt_response)
        return (
            int(ats_data["ats_score"]),
            ats_data["matched_keywords"],
            ats_data["missing_keywords"]
        )
    except Exception as e:
        print("GPT processing failed:", e)
        raise RuntimeError("Failed to generate ATS score using GPT.")
