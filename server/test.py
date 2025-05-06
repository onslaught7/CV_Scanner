from config import settings
from google import genai
from google.genai import types

GEMINI_API_KEY=settings.GEMINI_API_KEY
llm = "models/gemini-2.5-pro-exp-03-25"

client = genai.Client(api_key=GEMINI_API_KEY)

response = client.models.generate_content(
    # model="models/gemini-2.5-pro-exp-03-25",
    model=llm,
    contents="""
        give me only the python code, which would create an interactive 2d snake game
        the points should increase when the snake eats something and the game would end when
        the snake hits a wall or it's own tail.

        You have to give me the code only, fully functional that can be copied and pasted and made to run.
    """,
    config=types.GenerateContentConfig(
        temperature=0.1
    )
)

print(response)
print()
print(response.text)
