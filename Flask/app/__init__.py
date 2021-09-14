from flask import Flask, url_for, request, redirect, render_template
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config.from_object("config")
app.config['SQLALCHEMY_POOL_TIMEOUT'] = 1800
db = SQLAlchemy(app)
metadata = MetaData(app.config["SQLALCHEMY_DATABASE_URI"])
metadata.reflect()

from app import views
