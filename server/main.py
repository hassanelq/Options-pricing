from fastapi import FastAPI
from routes.option import router as option_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Options Pricing API", version="1.0")

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the option pricing route
app.include_router(option_router)


@app.get("/")
def root():
    return {"message": "Options Pricing API is running!"}
