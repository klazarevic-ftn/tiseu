from dto import OrderDTO
from model import Form, FormType
from utils.db_utils import connection
from utils.json_utils import to_json
from json import loads, dumps


def get_order_by_foreign_id(order_id):
    query = f'SELECT content, date_created, date_fulfilled FROM forms WHERE foreign_id=\'{order_id}\''
    with connection.cursor() as cursor:
        try:
            cursor.execute(query)
            obj = cursor.fetchone()
            obj['content'] = loads(obj['content'])
            return obj
        except Exception as err:
            print(err)
            connection.rollback()


def get_order_by_form_id(form_id):
    query = f'SELECT order_id FROM forms WHERE id=\'{form_id}\''
    with connection.cursor() as cursor:
        try:
            cursor.execute(query)
            obj = cursor.fetchone()
            return obj
        except Exception as err:
            print(err)
            connection.rollback()


def create_order(order: OrderDTO):
    form = Form()
    form.foreign_id = order.orderNo
    form.content = to_json(order)
    form.form_type = FormType.ORDER.value

    keys = [attr for attr in form.__dict__ if attr[0] != '_' and attr != 'id']
    values = [getattr(form, attr) for attr in keys]
    values_string = ", ".join(["'%s'" for _ in values]) % tuple(values)
    query = f'INSERT INTO {form.__tablename__}({",".join(keys)}) VALUES ({values_string})'

    with connection.cursor() as cursor:
        try:
            cursor.execute(query)
            connection.commit()
        except Exception as err:
            print(err)
            connection.rollback()


def exec_order(form_id):
    query = f'SELECT content FROM forms WHERE id={form_id}'
    obj = None
    with connection.cursor() as cursor:
        try:
            cursor.execute(query)
            obj = cursor.fetchone()
        except Exception as err:
            print(err)
            connection.rollback()

    if obj:
        content_obj = loads(obj['content'])
        content_obj['executed'] = True
        update_query = f'UPDATE forms SET content=\'{dumps(content_obj)}\', date_fulfilled=NOW() WHERE id=\'{form_id}\''
        with connection.cursor() as cursor:
            try:
                cursor.execute(update_query)
                connection.commit()
            except Exception as err:
                print(err)
                connection.rollback()