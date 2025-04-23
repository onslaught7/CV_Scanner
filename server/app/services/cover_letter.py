import openai
from server.config import settings
import time


OPENAI_API_KEY = settings.OPENAI_API_KEY
client = openai.OpenAI(api_key=OPENAI_API_KEY)


def call_gpt_with_retry(prompt: str, retries: int = 3, delay: int = 2) -> str:
    for attempt in range(retries):
        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {
                        "role": "system", 
                        "content": """You are a professional cover letter writer. 
                        who can tailor a brilliant cover letter by looking at the resume and job description"""
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
                max_tokens=2500
            )
            return response.choices[0].message.content
        except openai.RateLimitError:
            print(f"[Rate Limit] Attempt {attempt + 1}: retrying in {delay} seconds...")
            time.sleep(delay)
        except openai.OpenAIError as e:
            print(f"[OpenAI Error] Attempt {attempt + 1}: {e}")
            time.sleep(delay)
    raise RuntimeError("GPT API failed after multiple retries.")


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
    cover_letter = call_gpt_with_retry(prompt)
    return cover_letter
