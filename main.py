from flask import Flask, jsonify, redirect, make_response
from flask_caching import Cache
import httpx

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple', 'CACHE_DEFAULT_TIMEOUT': 300})  # 300 seconds = 5 minutes

@app.route('/file/<path:file_name>')
@cache.cached(timeout=300)  # Cache the response for 5 minutes
def fetch_file(file_name):
    url = f"https://optifine.net/adloadx?f={file_name}"
    
    response = httpx.get(url)

    text = response.text
    
    start = text.find("href='", text.find("<div class=\"downloadButton\">")) + len("href='")
    download_link = "https://optifine.net/" + text[start:text.find("'", start)]

    # Check if the download link is valid
    download_response = httpx.head(download_link)
    if download_response.status_code != 200 or 'Content-Disposition' not in download_response.headers:
        error_response = {
            "code": 404,
            "message": "File not found."
        }
        return jsonify(error_response), 404

    redirect_response = redirect(download_link)
    redirect_response.headers['Cache-Control'] = 'max-age=0, s-maxage=300' # Add the Cache-Control header, https://vercel.com/docs/edge-network/headers#recommended-settings
    return redirect_response

if __name__ == "__main__":
    app.run()
