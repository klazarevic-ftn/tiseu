from pymysql import connect
from pymysql.cursors import DictCursor
from sqlalchemy import Table, create_engine, MetaData
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime

from model import Appointment


def connection():
    try:
        return connect(host='10.5.0.5', port=3306, user='root', password='root', charset='utf8', database='mup',
                       cursorclass=DictCursor)
    except:
        return connect(host='localhost', port=8888, user='root', password='root', charset='utf8', database='mup',
                       cursorclass=DictCursor)


engine = create_engine('mysql+pymysql://root:root@localhost:8888/mup')
# engine = create_engine('mysql+pymysql://root:root@10.5.0.5:3306/mup')
connection_obj = connection()
metadata = MetaData()


def get_table(table_name: str):
    return Table(table_name, metadata, autoload_with=engine)


def execute_statement(statement):
    with sessionmaker(bind=engine)() as session:
        try:
            session.execute(statement)
            session.commit()
        except Exception as err:
            print(err)


def execute_select(statement):
    with Session(engine) as session:
        try:
            result = session.execute(statement).mappings()
            return [Appointment(**dict(row)) for row in result]
        except Exception as err:
            print(err)


def convert_date(arg_date: str):
    date_dict = arg_date.split('T')
    date_dict[1] = date_dict[1][:-1]
    year, month, day = date_dict[0].split('-')
    hours, minutes, _ = date_dict[1].split(':')
    return datetime(int(year), int(month), int(day), int(hours), int(minutes))
