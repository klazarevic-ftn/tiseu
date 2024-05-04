from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse

from keycloak.keycloak_openid import KeycloakOpenID

import json

with open('./keycloak.json') as json_file:
    keycloak_json = json.load(json_file)

router = APIRouter()
keycloak_client = KeycloakOpenID(server_url='http://localhost:9000/',
                                 realm_name='tiseu',
                                 client_id=keycloak_json['clientId'],
                                 client_secret_key=keycloak_json['secret'])


@router.get('/login')
async def login(request: Request):
    try:
        token = keycloak_client.token(username='test', password='test')
        print(token)
    except Exception as ex:
        print('error', ex)
    # return RedirectResponse(url)
