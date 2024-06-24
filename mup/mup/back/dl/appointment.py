from dto import AppointmentDTO
from model import Appointment
from utils.db_utils import connection as func_conn
from datetime import datetime
connection = func_conn()


def create_appointment(appointmentDTO: AppointmentDTO):
    appointment = Appointment()
    date_dict = appointmentDTO.date.split('T')
    date_dict[1] = date_dict[1][:-1]
    year, month, day = date_dict[0].split('-')
    hours, minutes, _ = date_dict[1].split(':')
    appointment.date = datetime(int(year), int(month), int(day), int(hours), int(minutes))
    appointment.length = appointmentDTO.length
    appointment.type = appointmentDTO.type

    keys = [attr for attr in appointment.__dict__ if attr[0] != '_' and attr != 'id']
    values = [getattr(appointment, attr) for attr in keys]
    values_string = ", ".join(["'%s'" for _ in values]) % tuple(values)
    query = f'INSERT INTO {appointment.__tablename__}({",".join(keys)}) VALUES ({values_string})'

    with connection.cursor() as cursor:
        try:
            cursor.execute(query)
            connection.commit()
        except Exception as err:
            print(err)
            connection.rollback()
