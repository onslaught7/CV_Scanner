from server.app.models.database import engine
from server.app.models.models import Base
from server.app.models import models
import sys


def create_tables():
    try:
        models.Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully.")
    except Exception as e:
        print("❌ Failed to create tables.", e)
        sys.exit(1)

if __name__ == "__main__":
    create_tables()
