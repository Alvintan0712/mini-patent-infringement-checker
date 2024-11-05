from fastapi import FastAPI
from .models import CheckPatentRequest
from .services import *
import json

app = FastAPI()

def process_document_data(document, type):
    for key in document.keys():
        if document[key] is None:
            document[key] = ""
        elif isinstance(document[key], list):
            document[key] = json.dumps(document[key])
        elif isinstance(document[key], dict):
            document[key] = json.dumps(document[key])
    document["type"] = type
    return document

@app.get("/")
def read_root():
    return { "Hello": "FastAPI" }

@app.get("/company")
async def get_companies_handler():
    companies = get_companies()
    return { "companies": companies }

@app.get("/company/{name}")
async def get_company_handler(name: str):
    company = get_company(name)
    return { "company": company }

@app.get("/patent")
async def get_patents_handler():
    patents = get_patents()
    return { "patents": patents }

@app.get("/patent/{publication_number}")
async def get_patent_handler(publication_number: str):
    patent = get_patent(publication_number)
    return { "patent": patent }

@app.post("/seed")
async def seed_handler():
    seed()
    return { "status": "success", "message": "database seeded" }

@app.post("/check")
async def check_patent_infringement(check_patent_request: CheckPatentRequest):
    return {
        "patent_id": check_patent_request.patent_id, 
        "company_name": check_patent_request.company_name,
    }