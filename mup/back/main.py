from json import dumps, loads

from fastapi import FastAPI, Depends
from model import init_db, Form, FormType
from dto import OrderDTO

from pymysql import connect
from pymysql.cursors import DictCursor

from routers import user
from security_utils import has_role, valid_access_token

init_db()
app = FastAPI()

app.include_router(user.router)
try:
    connection = connect(host='localhost', port=8888, user='root', password='root', charset='utf8', database='mup',
                         cursorclass=DictCursor)
    # connection = connect(host='10.5.0.2', port=3306, user='root', password='root', charset='utf8', database='mup',
    #                      cursorclass=DictCursor)
except Exception as ex:
    print('main: ', ex)


def to_json(obj):
    return dumps(obj, default=lambda o: o.__dict__, sort_keys=True)


@app.get('/', dependencies=[Depends(valid_access_token)])
async def read_root():
    return {'Hello': 'World'}


@app.post('/order')
async def receive_order(order: OrderDTO):
    form = Form()
    form.foreign_id = order.orderId
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


@app.patch('/order/{form_id}')
async def execute_order(form_id):
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


@app.get('/order/{order_id}', dependencies=[Depends(has_role('mup_zaposleni'))])
async def get_order_status(order_id):
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
