from fastapi import APIRouter, Request

router = APIRouter()


@router.get('/login')
async def login(request: Request):
    return
