import json
from .redis_service import redis_client

def process_company_data(company):
    company["products"] = json.loads(company["products"])
    return company

def get_company_data(company_name: str):
    company = redis_client.hgetall(company_name)
    if len(company) == 0:
        return None

    return process_company_data(company)

def get_companies_data():
    keys = redis_client.keys("*")

    companies = []
    for key in keys:
        data = redis_client.hgetall(key)
        if data["type"] == "company":
            companies.append(process_company_data(data))

    return companies