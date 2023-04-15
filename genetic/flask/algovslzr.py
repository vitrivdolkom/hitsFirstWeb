from flask import Flask, render_template, url_for, request, redirect, jsonify, Response
import json
from ast import literal_eval
from WorkSpace import *


app = Flask(__name__)

@app.route('/')
def main():
    return render_template('index.html')

@app.route('/GetDots', methods=['POST'])
def solve():

    coordinates = request.form['data']
    #print(type(coordinates))
    coordinates = literal_eval(coordinates)

    ans = solver(coordinates)

    #return {'length': ans[0], 'bestroot': ans[1]}
    return {'ans': [list(el) for el in ans]}
    #return jsonify({'result': solver(coordinates)[0]})

# не нужно в новой версии flask
# if __name__ == "__main__":
#     app.run(debug=True)

