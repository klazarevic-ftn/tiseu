from fastapi import APIRouter, Depends, Response
from starlette import status
import requests

from dto import OrderDTO
from utils.security_utils import has_role
from dl.order import create_order, exec_order, get_order_by_foreign_id, get_order_by_form_id, get_all

router = APIRouter()


@router.post('/order')
async def receive_order(order_dto: OrderDTO):
    create_order(order_dto)
    return Response(status_code=status.HTTP_201_CREATED)


@router.patch('/order/{form_id}')
async def execute_order(form_id):
    exec_order(form_id)
    order = get_order_by_form_id(form_id)
    try:
        requests.patch(f'http://localhost:8010/orders/order/{order['foreign_id']}/execute')
    except Exception as e:
        return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, content=str(e))

    return Response(status_code=status.HTTP_200_OK)


@router.get('/order/{order_id}', dependencies=[Depends(has_role('mup_zaposleni'))])
async def get_order_status(order_id):
    order_obj = get_order_by_foreign_id(order_id)
    return Response(status_code=status.HTTP_200_OK, content=order_obj)


@router.get('/order')
async def get_all_orders():
    return get_all()