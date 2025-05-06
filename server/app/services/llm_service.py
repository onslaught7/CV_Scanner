import openai
from server.config import settings
from google import genai
from google.genai import types
import time


# Secure API key setup for OpenAI
OPENAI_API_KEY = settings.OPENAI_API_KEY
client = openai.OpenAI(api_key=OPENAI_API_KEY)


# secure API key setup for GEMINI
GEMINI_API_KEY=settings.GEMINI_API_KEY
llm = "models/gemini-2.5-pro-exp-03-25"


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


# ----------- GEMINI Retry Logic -----------
def call_gemini_with_retry(prompt: str, retries: int = 3, delay: int = 2) -> str:
    for attempt in range(retries):
        try:
            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                # model="models/gemini-2.5-pro-exp-03-25",
                model=llm,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.1
                )
            )
            return response.text
        except Exception as e:
            print(f"An unexpected error occured {attempt + 1}: {e}")
            time.sleep(delay)