
from fastapi import FastAPI
from model import init_db

from routers.user import router as user_router
from routers.order import router as order_router

init_db()

app = FastAPI()

app.include_router(user_router)
app.include_router(order_router)


# @app.get('/', dependencies=[Depends(valid_access_token)])
# async def read_root():
#     return {'Hello': 'World'}
