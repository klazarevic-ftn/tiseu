from sqlalchemy import delete, insert, update, values, select

from dto import AppointmentDTO
from utils.db_utils import get_table, execute_statement, execute_select, convert_date
from datetime import datetime

TABLE_NAME = 'appointments'
table = get_table(TABLE_NAME)


def create_appointment(appointment_dto: AppointmentDTO):
    date = convert_date(appointment_dto.date)

    statement = (insert(table).
                 values(date=date, length=15, user_id=appointment_dto.user_id,type=appointment_dto.type))  # TODO: Add user

    execute_statement(statement)


def delete_appointment(appointment_id: int):
    statement = delete(table).where(table.c.id == appointment_id)
    execute_statement(statement)


def update_appointment(appointment_dto: AppointmentDTO):
    statement = (update(table).
                 where(table.columns.id == appointment_dto.id).
                 values(date=appointment_dto.date))
    execute_statement(statement)


def get_appointment_by_id(appointment_id: int):
    statement = select(table).where(table.c.id == appointment_id)
    return execute_select(statement)


def get_appointments_by_user_id(user_id: int):
    statement = select(table).where(table.c.user_id == user_id)
    return execute_select(statement)


def get_appointments_by_date(from_date: str, to_date: str):
    from_date_obj = convert_date(from_date)
    to_date_obj = convert_date(to_date)
    statement = (select(table).where(table.c.date.between(from_date_obj, to_date_obj)))
    return execute_select(statement)