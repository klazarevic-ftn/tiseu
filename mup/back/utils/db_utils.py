from pymysql import connect
from pymysql.cursors import DictCursor

connection = None
try:
    connection = connect(host='10.5.0.2', port=3306, user='root', password='root', charset='utf8', database='mup',
                     cursorclass=DictCursor)
except:
    connection = connect(host='localhost', port=8888, user='root', password='root', charset='utf8', database='mup',
                     cursorclass=DictCursor)
