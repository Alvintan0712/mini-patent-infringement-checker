from pydantic import BaseModel

class CheckPatentRequest(BaseModel):
    patent_id: str
    company_name: str