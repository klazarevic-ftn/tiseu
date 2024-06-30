from fastapi import APIRouter

from dto import FormDTO
from dl.form import get_form_by_id, get_forms_by_user_id, create_form, delete_form
router = APIRouter()


@router.get('/form/')
async def get_form_(form_id: int):
    return get_form_by_id(form_id)


@router.get('/form/user')
async def get_forms_(user_id: int):
    return get_forms_by_user_id(user_id)


@router.post('/form/')
async def create_form_(form_dto: FormDTO):
    create_form(form_dto)


@router.delete('/form/')
async def delete_form_(form_id: int):
    delete_form(form_id)
