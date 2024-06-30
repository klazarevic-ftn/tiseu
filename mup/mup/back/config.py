import os


class Config:
    DB_HOST = 'localhost'
    DB_PORT = 8888


class DockerConfig(Config):
    DB_HOST = '10.5.0.5'
    DB_PORT = 3306


def get_config():
    if os.getenv('IS_DOCKER'):
        return DockerConfig
    return Config
