import openai
from server.config import settings
from server.app.services.llm_service import call_gemini_with_retry, call_gpt_with_retry 


def cover_letter_service(jd: str, resume_text: str):
    prompt = f"""
            You are a professional and experienced cover letter writer.

            Given the following resume and job description, write a detailed, personalized, and industry-standard cover letter in plain text format.

            Guidelines:
            - Address it to "Hiring Manager"
            - Keep it professional but personalized and confident
            - Mention relevant skills and experience from the resume
            - Tailor the tone and wording to match the job description
            - Use standard cover letter formatting with line breaks (use \\n for new lines)
            - End with a thank-you and a signature placeholder ("Sincerely,\\n[Your Name]")
            - Must be concise and should not have more that 

            Output Format (Important):
            - Return only the complete well formatted cover letter in a format that goes well in a. .txt file
            - Do NOT include code blocks, JSON, markdown formatting, or commentary — just the letter

            Resume:
            \"\"\"
            {resume_text}
            \"\"\"

            Job Description:
            \"\"\"
            {jd}
            \"\"\"
        """
    # cover_letter = call_gpt_with_retry(prompt)
    cover_letter = call_gemini_with_retry(prompt)
    return cover_letter