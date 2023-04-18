from flask import Flask, render_template, url_for, request
from ast import literal_eval
from SecondGeniusSolver import *

app = Flask(__name__)

@app.route('/solver', methods = ['POST'])
def GetSolve():
    img = request.form['data']
    #dots = literal_eval(img)
    #0

    return {'ans': solver(img)}

@app.route('/')
def main():
    return render_template('index.html')



if __name__ == "__main__":
    app.run(debug=True)
