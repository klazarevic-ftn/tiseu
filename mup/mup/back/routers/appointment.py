from fastapi import APIRouter

import dl.appointment as dl
from dto import AppointmentDTO

router = APIRouter()


@router.post('/appointment')
async def create_appointment_(appointment: AppointmentDTO):
    dl.create_appointment(appointment)


@router.delete('/appointment/')
async def delete_appointment_(appointment_id: int):
    dl.delete_appointment(appointment_id)


@router.get('/appointment/{id}')
async def get_appointment_by_id_(appointment_id: int):
    return dl.get_appointment_by_id(appointment_id)


@router.get('/appointment/user/')
async def get_appointments_by_user_id_(user_id: int):
    return dl.get_appointments_by_user_id(user_id)


@router.get('/appointment/dates/')
async def get_appointments_by_dates_(from_date: str, to_date: str):
    return dl.get_appointments_by_date(from_date, to_date)
