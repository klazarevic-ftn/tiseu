from enum import Enum as PythonEnum
from sqlalchemy.orm import declarative_base
from sqlalchemy import Enum as SQLEnum
from sqlalchemy import Column, Integer, String, Text, DateTime, text, DDL, create_engine

Base = declarative_base()


class Role(PythonEnum):
    CIVILIAN = 'CIVILIAN'
    PERSONNEL = 'PERSONNEL'


class FormType(PythonEnum):
    REPORT = 'REPORT'
    ORDER = 'ORDER'
    REQUEST = 'REQUEST'


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, autoincrement=True)
    first_name = Column(String(36))
    last_name = Column(String(36))
    role = Column(SQLEnum(Role), name='role')


class Form(Base):
    __tablename__ = 'forms'

    id = Column(Integer, primary_key=True, autoincrement=True)
    foreign_id = Column(String(36), unique=True)
    content = Column(Text)
    date_created = Column(DateTime, server_default=text('(NOW())'))
    date_fulfilled = Column(DateTime)
    form_type = Column(SQLEnum(FormType, length=10), name='form_type')


LOCAL_ENGINE_URL = 'mysql+pymysql://root:root@localhost:8888'
DOCKER_ENGINE_URL = 'mysql+pymysql://root:root@10.5.0.2:3306'
DATABASE_NAME = 'mup'
CREATE_DB_DDL = DDL(f'CREATE DATABASE IF NOT EXISTS `{DATABASE_NAME}`')
DROP_DB_DDL = DDL(f'DROP DATABASE IF EXISTS `{DATABASE_NAME}`')
QUERY_DB = DDL('SHOW DATABASES LIKE \'mup\'')


def init_db():
    ENGINE_URL = ''

    try:
        engine_with_no_db = create_engine(LOCAL_ENGINE_URL, future=True)
        ENGINE_URL = f'{LOCAL_ENGINE_URL}/mup'
        with engine_with_no_db.connect() as conn:
            with conn.begin():
                if not conn.execute(QUERY_DB).rowcount:
                    conn.execute(CREATE_DB_DDL)
                    engine = create_engine(ENGINE_URL, future=True)
                    Base.metadata.create_all(engine)
                # conn.execute(DROP_DB_DDL)
            conn.close()

    except:
        engine_with_no_db = create_engine(DOCKER_ENGINE_URL, future=True)
        ENGINE_URL = f'{DOCKER_ENGINE_URL}/mup'
        with engine_with_no_db.connect() as conn:
            with conn.begin():
                if not conn.execute(QUERY_DB).rowcount:
                    conn.execute(CREATE_DB_DDL)
                    engine = create_engine(ENGINE_URL, future=True)
                    Base.metadata.create_all(engine)
                # conn.execute(DROP_DB_DDL)
            conn.close()

