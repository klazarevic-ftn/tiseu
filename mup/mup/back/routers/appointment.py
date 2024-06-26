from fastapi import APIRouter

from dl.appointment import create_appointment, delete_appointment, get_appointment_by_id, get_appointments_by_user_id, \
    get_appointments_by_date
from dto import AppointmentDTO

router = APIRouter()


@router.post('/appointment')
async def create_appointment_(appointment: AppointmentDTO):
    create_appointment(appointment)


@router.post('/appointment/{id}')
async def delete_appointment_(appointment_id: int):
    delete_appointment(appointment_id)


@router.get('/appointment/{id}')
async def get_appointment_by_id_(appointment_id: int):
    return get_appointment_by_id(appointment_id)[0]


@router.get('/appointment/user/{id}')
async def get_appointments_by_user_id_(user_id: int):
    return get_appointments_by_user_id(user_id)


@router.get('/appointment/dates/')
async def get_appointments_by_dates_(from_date: str, to_date: str):
    return get_appointments_by_date(from_date, to_date)
