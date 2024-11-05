import json
from .redis_service import redis_client

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

def seed():
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
