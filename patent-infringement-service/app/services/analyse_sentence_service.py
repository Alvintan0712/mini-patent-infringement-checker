import uuid
import torch
from sentence_transformers import SentenceTransformer, util
from openai import OpenAI
from ..models import ProductInfringementFeature

device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.mps.is_available() else "cpu")
threshold = 0.5
openAI_client = OpenAI()

def get_analyse_results(patent, company):
    product_results = get_top_2_results(patent, company)
    return {
        "analysis_id": uuid.uuid4(),
        "patent_id": patent["publication_number"],
        "company_name": company["name"],
        "top_infringing_products": product_results,
        "overall_risk_assessment": get_overall_risk(product_results),
    }

def get_top_2_results(patent, company):
    claims = patent["claims"]
    products = company["products"]

    similarities = get_similarities(claims, products)
    sorted_indices = get_similarities_sorted_indices(similarities)
    
    results = []
    for i in range(2):
        product =  products[sorted_indices[i]]
        relevant_claims_indices = get_relevant_claim_indices(similarities[sorted_indices[i]])
        infringement_likelihood = get_infringement_likelihood(similarities[sorted_indices[i]])
        relevant_claim_texts = [claims[i]["text"] for i in relevant_claims_indices]

        result = {
            "product_name": product["name"],
            "description": product["description"],
            "relevant_claims": [i + 1 for i in relevant_claims_indices],
            "infringement_likelihood": infringement_likelihood,
            "infringing_features": get_infringing_features(product, patent, relevant_claim_texts),
        }

        results.append(result)
    return results

def get_results(patent, company):
    claims = patent["claims"]
    products = company["products"]

    similarities = get_similarities(claims, products)
    sorted_indices = get_similarities_sorted_indices(similarities)

    results = []
    for i, product in enumerate(products):
        product =  products[sorted_indices[i]]
        relevant_claims_indices = get_relevant_claim_indices(similarities[sorted_indices[i]])
        infringement_likelihood = get_infringement_likelihood(similarities[sorted_indices[i]])
        relevant_claim_texts = [claims[i]["text"] for i in relevant_claims_indices]

        result = {
            "product_name": product["name"],
            "description": product["description"],
            "relevant_claims": [i + 1 for i in relevant_claims_indices],
            "infringement_likelihood": infringement_likelihood,
            "infringing_features": get_infringing_features(product, patent, relevant_claim_texts),
        }

        results.append(result)
    return results

def get_similarities_by_sentence_transformer(claim_texts, description_texts):
    max_seq_length = 0
    for claim in claim_texts:
        max_seq_length = max(max_seq_length, len(claim))
    for description in description_texts:
        max_seq_length = max(max_seq_length, len(description))

    model = SentenceTransformer("all-MiniLM-L6-v2", device=device)
    model.max_seq_length = min(2048, max_seq_length)

    claim_embeddings = model.encode(claim_texts, convert_to_tensor=True, device=device)
    description_embeddings = model.encode(description_texts, convert_to_tensor=True, device=device)

    similarities = util.cos_sim(description_embeddings, claim_embeddings)
    return similarities

def get_similarities_by_openai(claim_texts, description_texts):
    response = openAI_client.embeddings.create(
        input=claim_texts,
        model="text-embedding-3-small"
    )
    claim_embeddings = [data.embedding for data in response.data]
    claim_embeddings = torch.tensor(claim_embeddings, device=device)
    
    response = openAI_client.embeddings.create(
        input=description_texts,
        model="text-embedding-3-small"
    )
    description_embeddings = [data.embedding for data in response.data]
    description_embeddings = torch.tensor(description_embeddings, device=device)

    similarities = util.cos_sim(description_embeddings, claim_embeddings)
    return similarities

def get_similarities(claims, products):
    claim_texts = [claim["text"] for claim in claims]
    description_texts = [product["description"] for product in products]

    return get_similarities_by_openai(claim_texts, description_texts)

def get_similarities_sorted_indices(similarities):
    similarities_claim_max_value = torch.amax(similarities, dim=1)
    sorted_indices = torch.argsort(similarities_claim_max_value, descending=True)

    return sorted_indices

def get_relevant_claim_indices(product_similarities):
    claims = []
    for i, product_similarity in enumerate(product_similarities):
        if product_similarity > threshold:
            claims.append(i)
    return claims

def get_infringement_likelihood(product_similarities):
    res = torch.amax(product_similarities).item()
    return "High" if res >= 0.75 else "Medium" if res >= 0.5 else "Low"

def get_overall_risk(results):
    prompt_template = "Provide this company overall risk in one paragraph, based on these results:\n{}"
    prompt = prompt_template.format(results)

    response = openAI_client.chat.completions.create(
        model="gpt-4o-mini",
        max_tokens=2048,
        messages=[
            {
                "role": "system", 
                "content": "You are a helpful assistant to summarize the results of the patent infringement",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
    )

    return response.choices[0].message.content

def get_infringing_features(product, patent, claims):
    claims_text = "\n".join(claims)
    prompt_template = """
        Provide the product '{}' potentially infringes the patent '{}'.
        patent's id: {}\n
        product's description:{}\n
        patent's claims:\n{}\n
        Provide the features that infringing the patent claims based on the product's description and provide the explaination.
    """
    prompt = prompt_template.format(product["name"], patent["publication_number"], product["description"], patent["title"], claims_text)

    response = openAI_client.beta.chat.completions.parse(
        model="gpt-4o-mini",
        max_tokens=2048,
        messages=[
            {
                "role": "system", 
                "content": "You are an expert at structured data extraction. You will be given list of unstructured text from a patent's claims text and product's description convert it into the given structure.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        response_format=ProductInfringementFeature,
    )

    return response.choices[0].message.parsed