from pydantic import BaseModel

class ProductInfringementFeature(BaseModel):
    product_features: list[str]
    explaination: str
