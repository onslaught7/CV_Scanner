import fitz
import os
from docx import Document
from typing import List, Tuple
import json
from server.config import settings
import re
from server.app.services.llm_service import call_gpt_with_retry, call_gemini_with_retry


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


# ----------- JSON Cleaning and Validation -----------
def validate_json_response(response_text: str) -> dict:
    """
    Cleans potential markdown fences and whitespace from the response
    before validating and parsing the JSON.
    """
    if not response_text:
        print("[Validation Error] Received empty response text.")
        raise RuntimeError("LLM did not return any text.")

    # Use regex to find the JSON object ({...})
    # This looks for the first '{' followed by anything until the last '}'
    # It handles nested braces and multi-line JSON.
    match = re.search(r"\{[\s\S]*\}", response_text) # Find text between { and }

    if not match:
        # Log the problematic response for debugging
        print(f"[Validation Error] No JSON object found in the response text:\n---\n{response_text}\n---")
        raise RuntimeError("LLM did not return a valid JSON object structure.")

    json_string = match.group(0) # Extract the matched JSON part

    try:
        # Attempt to parse the extracted string
        parsed = json.loads(json_string)

        # --- Your original assertions ---
        assert "ats_score" in parsed, "Missing 'ats_score' key"
        assert "matched_keywords" in parsed, "Missing 'matched_keywords' key"
        assert "missing_keywords" in parsed, "Missing 'missing_keywords' key"
        # --- End of original assertions ---

        # Add type checks for robustness
        if not isinstance(parsed.get("ats_score"), (int, float)):
             raise ValueError("'ats_score' must be a number")
        if not isinstance(parsed.get("matched_keywords"), list):
             raise ValueError("'matched_keywords' must be a list")
        if not isinstance(parsed.get("missing_keywords"), list):
             raise ValueError("'missing_keywords' must be a list")

        # Ensure score is returned as int
        parsed["ats_score"] = int(parsed["ats_score"])

        return parsed
    except json.JSONDecodeError as e:
        print(f"[Validation Error] Failed to decode JSON after cleaning: {e}")
        print(f"Attempted to parse: {json_string}") # Log what was parsed
        raise RuntimeError("LLM response contained invalid JSON structure after cleaning.")
    except (AssertionError, ValueError) as e:
        print(f"[Validation Error] Invalid JSON structure or types: {e}")
        print(f"Parsed data structure: {parsed}") # Log the structure that failed validation
        raise RuntimeError("LLM returned JSON with incorrect structure or types.")
    except Exception as e:
        # Catch any other unexpected error during parsing/validation
        print(f"[Validation Error] Unexpected error during validation: {e}")
        print(f"Problematic JSON string: {json_string}")
        raise RuntimeError("Unexpected error processing the JSON response.")


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

    You are not allowed to wrap using ```json ``` as well. Just strictly JSON with beginning and ending curly braces.

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
        # response = call_gpt_with_retry(prompt)
        response = call_gemini_with_retry(prompt)
        ats_data = validate_json_response(response)
        return (
            int(ats_data["ats_score"]),
            ats_data["matched_keywords"],
            ats_data["missing_keywords"]
        )
    except Exception as e:
        print("GPT processing failed:", e)
        raise RuntimeError("Failed to generate ATS score using GPT.")