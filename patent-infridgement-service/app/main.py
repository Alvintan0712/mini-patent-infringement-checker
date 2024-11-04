from fastapi import FastAPI
from .models import CheckPatentRequest

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "FastAPI"}

@app.post("/check")
async def check_patent_infringement(check_patent_request: CheckPatentRequest):
    return {
        "patent_id": check_patent_request.patent_id, 
        "company_name": check_patent_request.company_name,
    }