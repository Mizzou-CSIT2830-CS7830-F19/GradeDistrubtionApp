from bs4 import BeautifulSoup
from google.cloud import firestore
import requests
import datetime
import json

URL = "https://musis1.missouri.edu/gradedist/mu_grade_dist_intro.cfm"
DISTRIBUTION_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

# call
def update(request):
    # OPTIONS
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    request_body = request.get_json()
    url_params = request.args
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    }

    # check POST
    if request.method != "POST":
        return ('Resource not found', 404, headers)

    # validate
    if request_body and 'prof' in request_body and 'user_id' in request_body:
        prof_name = request_body['prof']
        user_id = request_body['user_id']

        form_data = {'vinstructor': prof_name}
        raw_html = requests.post(URL, data=form_data, headers=DISTRIBUTION_HEADERS).content
        soup = BeautifulSoup(raw_html, 'html.parser')
        dist_table = soup.find_all('table')[-2]
        rows = dist_table.find_all('tr')
        counter = 0
        for row in rows[1:]:
            tds = row.find_all('td')
            class_obj = {}
            class_obj['dept'] = str(tds[0].getText()).strip()
            class_obj['title'] = str(tds[1].getText()).strip()
            class_obj['number'] = str(tds[2].getText()).strip()
            class_obj['section'] = int(tds[3].getText())
            class_obj['term'] = str(tds[4].getText()).strip()
            class_obj['instructor'] = prof_name
            class_obj['a'] = int(tds[7].getText())
            class_obj['b'] = int(tds[8].getText())
            class_obj['c'] = int(tds[9].getText())
            class_obj['d'] = int(tds[10].getText())
            class_obj['f'] = int(tds[11].getText())
            class_obj['avg'] = float(tds[12].getText())
            class_obj['updatedAt'] = datetime.datetime.now()
            counter += 1

            for k, v in class_obj.items():
                print ('key', k, 'value', v)

            # data for caller
            data = {
                'classesAdded': counter,
            }
            return (json.dumps(data), 200, headers)


    # default
    return ('Bad request.', 400, headers)
