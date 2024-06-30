from pydantic import BaseModel


class AppointmentDTO(BaseModel):
    id: int = None
    date: str
    length: int
    user_id: int
    type: str


class FormDTO(BaseModel):
    id: int = None
    content: str
    date_created: str = None
    date_fulfilled: str = None
    form_type: str
    user_id: int = None
