from pymysql import connect
from pymysql.cursors import DictCursor


def connection():
    try:
        return connect(host='10.5.0.2', port=3306, user='root', password='root', charset='utf8', database='mup',
                             cursorclass=DictCursor)
    except:
        return connect(host='localhost', port=8888, user='root', password='root', charset='utf8', database='mup',
                             cursorclass=DictCursor)

