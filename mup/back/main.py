from json import dumps

from fastapi import FastAPI, HTTPException
from model import init_db, Form
from dto import OrderDTO


init_db()
app = FastAPI()


def to_json(obj):
    return dumps(obj, default=lambda o: o.__dict__, sort_keys=True)


@app.get('/')
async def read_root():
    return {'Hello': 'World'}


@app.post('/order')
async def receive_order(order: OrderDTO, fif: str | None = None):
    try:
        if fif is not None:
            foreign_id_field = getattr(order, fif)
            print('foreign id: ', foreign_id_field)
            form = Form()
            form.foreign_id = foreign_id_field
            form.content = to_json(order)
            print('form: ', form)
        else:
            raise HTTPException(status_code=422, detail='Missing \'foreign_id_field\' parameter.')
    except AttributeError:
        raise HTTPException(status_code=422, detail='Foreign id parameter not found in JSON payload.')


@app.patch('/order/{orderId}')
async def execute_order(order_id):
    return order_id
