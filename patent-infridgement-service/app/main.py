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
    return {"Hello": "FastAPI"}

@app.get("/company")
async def get_companies():
    companies = get_companies_data()
    return {
        "companies": companies,
    }

@app.get("/company/{name}")
async def get_company(name: str):
    company = get_company_data(name)
    return {
        "company": company,
    }

@app.get("/patent")
async def get_patents():
    patents = get_patents_data()
    return {
        "patents": patents,
    }

@app.get("/patent/{publication_number}")
async def get_patent(publication_number: str):
    patent = get_patent_data(publication_number)
    return { "patent": patent }

@app.post("/seed")
async def seed():
    with open("data/patents.json", "r") as file:
        patents = json.load(file)
        for patent in patents:
            patent = process_document_data(patent, "patent")
            redis_client.hset(patent["publication_number"], mapping=patent)

    with open("data/company_products.json", "r") as file:
        companies_data = json.load(file)
        for company in companies_data["companies"]:
            company = process_document_data(company, "company")
            redis_client.hset(company["name"], mapping=company)
    
    return { "status": "success", "message": "database seeded" }

@app.post("/check")
async def check_patent_infringement(check_patent_request: CheckPatentRequest):
    return {
        "patent_id": check_patent_request.patent_id, 
        "company_name": check_patent_request.company_name,
    }