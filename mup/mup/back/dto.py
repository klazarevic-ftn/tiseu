from pydantic import BaseModel


class OrderDTO(BaseModel):
    orderNo: str
    caseNo: str
    executed: bool = False


class AppointmentDTO(BaseModel):
    id: int = None
    date: str
    length: int
    user_id: int
    type: str
