from json import dumps, loads
from typing import Annotated

from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2AuthorizationCodeBearer
from model import init_db, Form, FormType
from dto import OrderDTO

from pymysql import connect
from pymysql.cursors import DictCursor

from routers import user

from jwt import PyJWKClient
import jwt

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


oauth_2_scheme = OAuth2AuthorizationCodeBearer(
    tokenUrl="http://localhost:9000/realms/tiseu/protocol/openid-connect/token",
    authorizationUrl="http://localhost:9000/realms/tiseu/protocol/openid-connect/auth",
    refreshUrl="http://localhost:9000/realms/tiseu/protocol/openid-connect/token",
)


async def valid_access_token(
        access_token: Annotated[str, Depends(oauth_2_scheme)]
):
    print('access_token: ', access_token)
    url = "http://localhost:9000/realms/tiseu/protocol/openid-connect/certs"
    optional_custom_headers = {"User-agent": "custom-user-agent"}
    jwks_client = PyJWKClient(url, headers=optional_custom_headers)
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(access_token)
        data = jwt.decode(
            access_token,
            signing_key.key,
            algorithms=["RS256"],
            audience="api",
            options={"verify_exp": True},
        )
        return data
    except jwt.exceptions.InvalidTokenError as error:
        print('error: ', error)
        raise HTTPException(status_code=401, detail="Not authenticated")


def has_role(role_name: str):
    async def check_role(
            token_data: Annotated[dict, Depends(valid_access_token)]
    ):
        roles = token_data["resource_access"]["api"]["roles"]
        print('roles: ', roles)
        if role_name not in roles:
            raise HTTPException(status_code=403, detail="Unauthorized access")

    return check_role


@app.get('/')
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
