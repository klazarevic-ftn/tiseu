from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

import json

with open('./keycloak.json') as json_file:
    keycloak_json = json.load(json_file)

router = APIRouter()


@router.get('/login')
async def login(request: Request):
    return
