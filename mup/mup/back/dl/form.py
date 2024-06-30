from datetime import timezone, datetime

from sqlalchemy import delete, insert, update, values, select
from dto import FormDTO
from utils.db_utils import get_table, execute_statement, execute_select, convert_date

TABLE_NAME = 'form'
table = get_table(TABLE_NAME)


def create_form(form_dto: FormDTO):
    form_dto.date_created = datetime.now()

    statement = (insert(table).
                 values(content=form_dto.content, date_created=form_dto.date_created, form_type=form_dto.form_type))

    execute_statement(statement)


def delete_form(form_id: id):
    statement = delete(table).where(table.c.id == form_id)
    execute_statement(statement)


def fulfill_form(form_dto: FormDTO):
    statement = (update(table).
                 where(table.c.id == form_dto.id).
                 values(date_fulfilled=form_dto.date_fulfilled))
    execute_statement(statement)


def get_form_by_id(form_id: int):
    statement = select(table).where(table.c.id == form_id)
    return execute_select(statement)


def get_forms_by_user_id(user_id: int):
    statement = select(table).where(table.c.user_id == user_id)
    return execute_select(statement)


def get_unfulfilled_forms():
    statement = select(table).where(table.c.date_fulfilled == None)
    return execute_select(statement)
