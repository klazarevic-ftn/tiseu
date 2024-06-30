from datetime import datetime

from sqlalchemy import delete, insert, update, select
from dto import FormDTO
import utils.db_utils as db

TABLE_NAME = 'forms'
table = db.get_table(TABLE_NAME)


def create_form(form_dto: FormDTO):
    form_dto.date_created = datetime.now()

    statement = (insert(table).
                 values(content=form_dto.content, date_created=form_dto.date_created, form_type=form_dto.form_type))

    db.execute_statement(statement)


def fulfill_form(form_dto: FormDTO):
    statement = (update(table).
                 where(table.c.id == form_dto.id).
                 values(date_fulfilled=form_dto.date_fulfilled))
    db.execute_statement(statement)


def get_form_by_id(form_id: int):
    statement = select(table).where(table.c.id == form_id)
    return db.execute_select(statement)


def get_forms_by_user_id(user_id: int):
    statement = select(table).where(table.c.user_id == user_id)
    return db.execute_select(statement)


def get_unfulfilled_forms():
    statement = select(table).where(table.c.date_fulfilled == None)
    return db.execute_select(statement)
