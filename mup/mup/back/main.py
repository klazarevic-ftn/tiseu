from fastapi import FastAPI, Depends
from utils.security_utils import valid_access_token
from fastapi.middleware.cors import CORSMiddleware


def create_app():
    import routers
    app_local = FastAPI()
    app_local.include_router(routers.user.router)
    app_local.include_router(routers.appointment.router)
    app_local.include_router(routers.form.router)

    app_local.add_middleware(
        CORSMiddleware,
        allow_origins=['*'],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    return app_local


app = create_app()


if __name__ == '__main__':
    import uvicorn
    from utils.db_utils import init_db

    init_db()

    uvicorn.run(app, host="0.0.0.0", port=8000)

#
# @app.get('/', dependencies=[Depends(valid_access_token)])
# async def read_root():
#     return {'Hello': 'World'}
