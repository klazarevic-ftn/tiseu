from pydantic import BaseModel


class OrderDTO(BaseModel):
    orderNo: str
    caseNo: str
    executed: bool = False
