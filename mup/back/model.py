from enum import Enum as PythonEnum
from sqlalchemy.orm import declarative_base
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Column, Integer, String, Text, DateTime, text, DDL, create_engine

Base = declarative_base()


class Role(PythonEnum):
    CIVILIAN = 'CIVILIAN'
    PERSONNEL = 'PERSONNEL'


class FormType(PythonEnum):
    REPORT = 0
    ORDER = 1
    REQUEST = 2


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(36))
    last_name = Column(String(36))
    role = Column(SQLEnum(Role), name='role')


class Form(Base):
    __tablename__ = 'forms'

    id = Column(Integer, primary_key=True, autoincrement=True)
    foreign_id = Column(String(36))
    content = Column(Text)
    date_created = Column(DateTime, server_default=text('(NOW())'))
    date_fulfilled = Column(DateTime)
    form_type = Column(SQLEnum(FormType), name='form_type')


ENGINE_URL = 'mysql+pymysql://root:root@localhost'
DATABASE_NAME = 'mup'
CREATE_DB_DDL = DDL(f'CREATE DATABASE IF NOT EXISTS `{DATABASE_NAME}`')
DROP_DB_DDL = DDL(f'DROP DATABASE IF EXISTS `{DATABASE_NAME}`')


def init_db():
    engine_with_no_db = create_engine(ENGINE_URL, future=True)

    with engine_with_no_db.connect() as conn:
        with conn.begin():
            conn.execute(DROP_DB_DDL)
            conn.execute(CREATE_DB_DDL)
        conn.close()

    engine = create_engine(f'{ENGINE_URL}/{DATABASE_NAME}', future=True)

    Base.metadata.create_all(engine)