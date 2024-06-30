from pymysql import connect
from pymysql.cursors import DictCursor
from sqlalchemy import Table, create_engine, MetaData
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy_utils import drop_database, create_database, database_exists
from datetime import datetime
from sqlalchemy import delete, select

from config import get_config
from model import base

config = get_config()
engine = create_engine(f'mysql+pymysql://root:root@{config.DB_HOST}:{config.DB_PORT}/mup')
metadata = MetaData()


def get_db_connection():
    try:
        connection = connect(
            host=config.DB_HOST,
            port=config.DB_PORT,
            user='root',
            password='root',
            charset='utf8',
            database='mup',
            cursorclass=DictCursor
        )
        print(f'Connected to DB at "{config.DB_HOST}:{config.DB_PORT}" with user "{config.DB_USER}".')
        return connection
    except Exception as e:
        print(f'Failed to connect to the database: {e}')
        return None


def init_db():
    if database_exists(engine.url):
        drop_database(engine.url)
    create_database(engine.url)
    base.metadata.create_all(engine)


def get_table(table_name: str):
    return Table(table_name, metadata, autoload_with=engine)


def execute_statement(statement):
    with sessionmaker(bind=engine)() as session:
        try:
            session.execute(statement)
            session.commit()
        except Exception as err:
            print(err)


def execute_select(statement, class_to_select):
    with Session(engine) as session:
        try:
            result = session.execute(statement).mappings()
            return [class_to_select(**dict(row)) for row in result]
        except Exception as err:
            print(err)


def convert_date(arg_date: str):
    date_dict = arg_date.split('T')
    date_dict[1] = date_dict[1][:-1]
    year, month, day = date_dict[0].split('-')
    hours, minutes, _ = date_dict[1].split(':')
    return datetime(int(year), int(month), int(day), int(hours), int(minutes))


def delete_by_id(table: Table, entity_id: int):
    statement = delete(table).where(table.c.id == entity_id)
    execute_statement(statement)
