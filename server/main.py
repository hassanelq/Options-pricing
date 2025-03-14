from fastapi import FastAPI
from routes.options_bulk import router as bulk_option_router
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

# Include routes
app.include_router(bulk_option_router)


@app.get("/")
def root():
    return {"message": "Options Pricing API is running!"}
