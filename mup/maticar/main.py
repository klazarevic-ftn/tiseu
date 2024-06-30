from json import loads, dumps
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = {}

with open('data.json', 'rb', ) as json_file:
    raw_data = loads(json_file.read())
    for person in raw_data:
        db[person['jmbg']] = person


@app.get("/api/osoba/{jmbg}")
async def check_one(jmbg: str, json: bool = False):
    if len(jmbg) == 13 and jmbg.isnumeric():
        if jmbg in db.keys():
            if json:
                return Response(content=dumps(db[jmbg], indent=4), status_code=200, media_type='application/json')
            else:
                return Response(content='Osoba postoji.', status_code=200, media_type='text')
        else:
            return Response(content='Osoba ne postoji.', status_code=404, media_type='text')
    else:
        return Response(content='Neispravan JMBG.', status_code=400, media_type='text')


@app.get('/api/all')
async def get_all():
    return Response(content=dumps(db, indent=4), status_code=200, media_type='application/json', )
