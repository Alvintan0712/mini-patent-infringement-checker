from fastapi import FastAPI
from .models import CheckPatentRequest
from redis import Redis
import os
import json

app = FastAPI()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = os.getenv("REDIS_PORT", "6379")
REDIS_PASSWORD = os.getenv("REDIS_PASSWORD", "my-redis-password")

redis_client = Redis(
    host=REDIS_HOST,
    port=REDIS_PORT,
    # password=REDIS_PASSWORD,
    decode_responses=True  # Ensures responses are decoded to strings
)

def parse_json(json_str):
    try:
        return json.loads(json_str)
    except:
        return None

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

def process_patent_data(patent):
    patent["inventors"] = parse_json(patent["inventors"])
    patent["claims"] = parse_json(patent["claims"])
    patent["classifications"] = parse_json(patent["classifications"])
    patent["citations"] = parse_json(patent["citations"])
    return patent

def process_company_data(company):
    company["products"] = json.loads(company["products"])
    return company

@app.get("/")
def read_root():
    return {"Hello": "FastAPI"}

@app.get("/company")
async def get_companies():
    keys = redis_client.keys("*")

    companies = []
    for key in keys:
        data = redis_client.hgetall(key)
        if data["type"] == "company":
            companies.append(process_company_data(data))

    return {
        "companies": companies,
    }

@app.get("/company/{name}")
async def get_companies(name: str):
    company = redis_client.hgetall(name)
    return {
        "company": process_company_data(company),
    }

@app.get("/patent")
async def get_patents():
    keys = redis_client.keys("*")

    patents = []
    for key in keys:
        data = redis_client.hgetall(key)
        if data["type"] == "patent":
            patents.append(process_patent_data(data))

    return {
        "patents": patents,
    }

@app.get("/patent/{publication_number}")
async def get_patent(publication_number: str):
    patent = redis_client.hgetall(publication_number)
    return { "patent": process_patent_data(patent) }

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