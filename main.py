from flask import Flask
from flask import render_template, request

app = Flask('app')

@app.route('/', methods=['GET', 'POST'])
def index():
  return render_template('index.html') 

@app.route('/input', methods=['GET', 'POST'])
def input():
  return render_template('input.html')

@app.route('/output', methods=['GET', 'POST'])
def output():
  return render_template('output.html')

app.run(host='0.0.0.0', port=8080)