from pymysql import connect
from pymysql.cursors import DictCursor


connection = connect(host='localhost', port=8888, user='root', password='root', charset='utf8', database='mup',
                     cursorclass=DictCursor)