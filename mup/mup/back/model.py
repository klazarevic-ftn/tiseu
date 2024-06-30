from enum import Enum as PythonEnum
from sqlalchemy.orm import declarative_base
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Column, Integer, String, Text, DateTime, text

base = declarative_base()


class Role(PythonEnum):
    CIVILIAN = 'CIVILIAN'
    PERSONNEL = 'PERSONNEL'


class FormType(PythonEnum):
    REPORT = 'REPORT'
    ORDER = 'ORDER'
    REQUEST = 'REQUEST'


class AppointmentType(PythonEnum):
    ID = 'ID'
    PASSPORT = 'Passport'
    DRIVERS_LICENCE = 'Driver\'s licence'


class User(base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(36))
    last_name = Column(String(36))
    role = Column(SQLEnum(Role), name='role')


class Form(base):
    __tablename__ = 'forms'

    id = Column(Integer, primary_key=True, autoincrement=True)
    content = Column(Text)
    date_created = Column(DateTime, server_default=text('(NOW())'))
    date_fulfilled = Column(DateTime)
    form_type = Column(SQLEnum(FormType, length=10, name='form_type'))
    user_id = Column(Integer)


class Appointment(base):
    __tablename__ = 'appointments'
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime)
    length = Column(Integer)
    user_id = Column(Integer)  # TODO: Povezi
    type = Column(SQLEnum(AppointmentType, length=15))
