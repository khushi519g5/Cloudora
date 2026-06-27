import fastapi # type: ignore
import fastapi.middleware.cors # type: ignore
import sentence_transformers # type: ignore
import pydantic # type: ignore
import os
import dotenv # type: ignore
import groq # type: ignore

# --------------------
# LOAD ENV
# --------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_PATH = os.path.join(BASE_DIR, ".env")

dotenv.load_dotenv(dotenv_path=ENV_PATH)


GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise Exception("GROQ_API_KEY missing in .env")

client = groq.Groq(api_key=GROQ_API_KEY)

# --------------------
# APP INIT
# --------------------
app = fastapi.FastAPI()

# CORS (important for React)
app.add_middleware(
    fastapi.middleware.cors.CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------
# MODEL LOAD
# --------------------
model = None

@app.on_event("startup")
def startup_event():
    global model
    print("Loading model...")
    model = sentence_transformers.SentenceTransformer("all-MiniLM-L6-v2")
    print("Model loaded")

# --------------------
# REQUEST SCHEMAS
# --------------------
class EmbedRequest(pydantic.BaseModel):
    text: str

class AskRequest(pydantic.BaseModel):
    question: str
    context: str

# --------------------
# EMBEDDING ENDPOINT
# --------------------
@app.post("/embed")
def embed(req: EmbedRequest):
    vector = model.encode(req.text).tolist()
    return {"embedding": vector}

# --------------------
# LLM ENDPOINT
# --------------------
