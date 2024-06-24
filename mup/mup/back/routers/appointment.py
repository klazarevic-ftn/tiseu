from fastapi import APIRouter

from dl.appointment import create_appointment
from dto import AppointmentDTO

router = APIRouter()


@router.post('/appointment')
async def make_appointment(appointment: AppointmentDTO):
    create_appointment(appointment)
