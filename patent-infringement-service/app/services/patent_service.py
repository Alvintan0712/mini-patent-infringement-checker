import json
from .company_service import get_company
from .redis_service import redis_client
from .analyse_sentence_service import *

def parse_json(json_str):
    try:
        return json.loads(json_str)
    except:
        return None

def process_patent_data(patent):
    patent["inventors"] = parse_json(patent["inventors"])
    patent["claims"] = parse_json(patent["claims"])
    patent["classifications"] = parse_json(patent["classifications"])
    patent["citations"] = parse_json(patent["citations"])
    return patent

def get_patents():
    keys = redis_client.keys("*")

    patents = []
    for key in keys:
        data = redis_client.hgetall(key)
        if data["type"] == "patent":
            patents.append(process_patent_data(data))
    
    return patents

def get_patent(publication_number: str):
    patent = redis_client.hgetall(publication_number)
    if len(patent) == 0:
        return None
    return process_patent_data(patent)

def check_patent_infringement(patent_id: str, company_name: str):
    patent = get_patent(patent_id)
    if patent is None:
        return None

    company = get_company(company_name)
    if company is None:
        return None
    
    return get_top_2_results(patent, company)

