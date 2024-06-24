from json import dumps


def to_json(obj):
    return dumps(obj, default=lambda o: o.__dict__, sort_keys=True)
