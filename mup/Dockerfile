# 
FROM python:3.12

# 
WORKDIR /code

# 
COPY ./back/requirements.txt /code/requirements.txt

# 
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 
COPY ./app /code/app

# 
CMD ["uvicorn", "app.main:app", "--host", "localhost", "--port", "8777"]