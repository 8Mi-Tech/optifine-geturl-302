export default {
    /**
     * @param {Request} request
     * @param {Env} env
     * @param {ExecutionContext} ctx
     * @returns {Promise<Response>}
     */
    async fetch(request, env, ctx) {
        const url = new URL(request.url),
            prefix = "/file/";
    
        if (!(url.pathname.includes("OptiFine_") || url.pathname.endsWith(".jar")) || !url.pathname.startsWith(prefix) || url.pathname.indexOf("/", prefix.length) !== -1) {
            return new Response(JSON.stringify({
                "code": 404,
                "message": "File not found."
            }), {
                "status": 404,
                "headers": {
                    "Content-Type": "application/json"
                }
            });
        }
    
        let cache = caches.default;
        let cachedResponse = await cache.match(request);
    
        if (cachedResponse) {
            return cachedResponse;
        }
    
        return fetch("https://optifine.net/adloadx?f=" + url.pathname.substring(prefix.length))
            .then(response => response.text())
            .then(text => {
                let start = text.indexOf("href='", text.indexOf("<div class=\"downloadButton\">")) + "href='".length;
                let redirectUrl = "https://optifine.net/" + text.substring(start, text.indexOf("'", start));
    
                return fetch(redirectUrl)
                    .then(async response => {
                        if (response.status !== 200 || !response.headers.has("Content-Disposition")) {
                            // Fetch information from BMCLAPI2 API
                            const bmclapiUrl = "https://bmclapi2.bangbang93.com/optifine/versionList";
                            const bmclApiResponse = await fetch(bmclapiUrl);
                            const bmclApiJson = await bmclApiResponse.json();
    
                            // Check if the requested file exists in the BMCLAPI2 response
                            const requestedFileName = url.pathname.substring(prefix.length);
                            const matchingModule = bmclApiJson.find(module => module.filename === requestedFileName);
    
                            if (!matchingModule) {
                                return new Response(JSON.stringify({
                                    "code": 404,
                                    "message": "File not found."
                                }), {
                                    "status": 404,
                                    "headers": {
                                        "Content-Type": "application/json"
                                    }
                                });
                            }
    
                            // Extract necessary information from BMCLAPI2 response
                            const { mcversion, patch, type } = matchingModule;
    
                            // Redirect to BMCLAPI2 URL
                            const bmclApiRedirectUrl = `https://bmclapi2.bangbang93.com/optifine/${mcversion}/${type}/${patch}`;
                            let cacheHeaders = {
                                "Cache-Control": "public, max-age=0, s-maxage=300"
                            };
                            let cachedResponse = new Response(response.body, {
                                "status": 302,
                                "headers": {
                                    ...response.headers,
                                    ...cacheHeaders,
                                    "Location": bmclApiRedirectUrl
                                }
                            });
                            cache.put(request, cachedResponse.clone());
                            return cachedResponse;
                        }
    
                        // Cache the response for 300 seconds
                        let cacheHeaders = {
                            "Cache-Control": "public, max-age=0, s-maxage=300"
                        };
                        let cachedResponse = new Response(response.body, {
                            "status": 302,
                            "headers": {
                                ...response.headers,
                                ...cacheHeaders,
                                "Location": redirectUrl
                            }
                        });
                        cache.put(request, cachedResponse.clone());
                        return cachedResponse;
                    });
            });
    }
};
