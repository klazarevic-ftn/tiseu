from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
import json

app = FastAPI()


class Order(BaseModel):
    orderId: str
    caseNo: str
    executed: bool = False

    def to_json(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__,
            sort_keys=True)


@app.get('/')
async def read_root():
    return {"Hello": "World"}


@app.post('/order')
async def receive_order(order: Order):
    return


@app.patch('/order/{orderId}')
async def execute_order(order_id):
    return order_id
