import torch
from sentence_transformers import SentenceTransformer

device = torch.device("cuda" if torch.cuda.is_available() else "mps" if torch.mps.is_available() else "cpu")
threshold = 0.5

def get_top_2_results(patent, company):
    claims = patent["claims"]
    products = company["products"]

    similarities = get_similarities(claims, products)
    sorted_indices = get_similarities_sorted_indices(similarities)
    
    results = []
    for i in range(2):
        product =  products[sorted_indices[i]]
        relevant_claims_indices = get_relevant_claim_indices(similarities[i])
        infringement_likelihood = get_infringement_likelihood(similarities[i])

        result = {
            "product_name": product["name"],
            "description": product["description"],
            "relevant_claims": [i + 1 for i in relevant_claims_indices],
            "infringement_likelihood": infringement_likelihood,
            "explaination": "",
            "specific_features": [],
        }

        results.append(result)
    return results

def get_similarities(claims, products):
    model = SentenceTransformer("all-MiniLM-L6-v2")

    claim_texts = [claim["text"] for claim in claims]
    claim_embeddings = model.encode(claim_texts, convert_to_tensor=True, device=device)

    description_texts = [product["description"] for product in products]
    description_embeddings = model.encode(description_texts, convert_to_tensor=True, device=device)

    similarities = model.similarity(description_embeddings, claim_embeddings)
    return similarities

def get_similarities_sorted_indices(similarities):
    # Get every product max value of the claim similarities
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
    value, length = 0.0, 0
    for i, product_similarity in enumerate(product_similarities):
        if product_similarity > threshold:
            value += product_similarity.item()
            length += 1
    if length == 0:
        return 0.0
    res = value / length
    return res
    # return "High" if res >= 0.75 else "Medium" if res >= 0.5 else "Low"
