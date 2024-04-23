from pydantic import BaseModel


class OrderDTO(BaseModel):
    orderId: str
    caseNo: str
    executed: bool = False
