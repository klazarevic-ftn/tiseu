def fill(html_doc, obj):
    filename = f'test_{html_doc.split('/')[1]}.html'
    with open(html_doc, 'r') as doc:
        with open(filename, 'w+') as dump:
            for line in doc:
                if '{' in line:
                    key = line.split('{')[1].split('}')[0]
                    if key in obj:
                        line = line.replace('{' + key + '}', obj[key])
                dump.write(line)


fill('./docs/nekaznjavanje.html', {'grad': 'Beograd', 'broj': 'test', 'datum': 'penis'})