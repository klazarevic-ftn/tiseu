from fastapi import APIRouter

from dto import FormDTO
import dl.form as dl


router = APIRouter()


@router.get('/form/')
async def get_form_(form_id: int):
    return dl.get_form_by_id(form_id)


@router.get('/form/all/unfulfilled')
async def get_unfulfilled_forms_():
    return dl.get_unfulfilled_forms()


@router.get('/form/user')
async def get_forms_(user_id: int):
    return dl.get_forms_by_user_id(user_id)


@router.post('/form/')
async def create_form_(form_dto: FormDTO):
    dl.create_form(form_dto)


@router.delete('/form/')
async def delete_form_(form_id: int):
    dl.delete_form(form_id)
