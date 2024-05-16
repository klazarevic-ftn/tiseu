from fastapi import FastAPI, Depends
import uvicorn
from model import init_db
from routers.user import router as user_router
from routers.order import router as order_router
from utils.security_utils import valid_access_token
from fastapi.middleware.cors import CORSMiddleware

init_db()

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(order_router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)


@app.get('/', dependencies=[Depends(valid_access_token)])
async def read_root():
    return {'Hello': 'World'}
