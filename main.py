from flask import Flask, jsonify, redirect
import httpx
import semver
import re

app = Flask(__name__)

@app.route('/file/<path:file_name>')
def fetch_file(file_name):
    url = f"https://optifine.net/adloadx?f={file_name}"
    
    response = httpx.get(url)

    text = response.text
    
    start = text.find("href='", text.find("<div class=\"downloadButton\">")) + len("href='")
    download_link = text[start:text.find("'", start)]

    return redirect(f"https://optifine.net/{download_link}")

if __name__ == "__main__":
    app.run()
