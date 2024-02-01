from flask import Flask, jsonify, redirect
import httpx
import re

app = Flask(__name__)

@app.route('/file/<path:file_name>')
def fetch_file(file_name):
    url = f"https://optifine.net/adloadx?f={file_name}"
    
    response = httpx.get(url)

    text = response.text
    
    start = text.find("href='", text.find("<div class=\"downloadButton\">")) + len("href='")
    download_link = "https://optifine.net/" + text[start:text.find("'", start)]

    # Check if the download link is valid
    download_response = httpx.head(download_link)
    if download_response.status_code != 200 or 'Content-Disposition' not in download_response.headers:
        return jsonify(message="File not found"), 404

    return redirect(download_link)

if __name__ == "__main__":
    app.run()
