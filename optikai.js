export default {
    /**
     * @param {Request} request
     * @param {Env} env
     * @param {ExecutionContext} ctx
     * @returns {Promise<Response>}
     */
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const prefix = "/kfile/";
        
        // Validate the file name
        const fileName = url.pathname.substring(prefix.length);
        if (!fileName.includes("OptiFine_") || !fileName.endsWith(".jar") || !url.pathname.startsWith(prefix) || url.pathname.indexOf("/", prefix.length) !== -1) {
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
        
        // Cache handling
        let cache = caches.default;
        let cachedResponse = await cache.match(request);
        
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const optifineUrl = `https://livzmc.net/optikai/downloadx?f=${fileName}`;
        try {
            const response = await fetch(optifineUrl);
            const text = await response.text();
            
            const downloadPattern = /<a rel="nofollow" href="([^"]+)" class="hover:underline text-lg">Download<\/a>/;
            const match = text.match(downloadPattern);
            
            if (!match) {
                // Fetch version list from BMCLAPI2 if no download link is found
                /*
                const bmclapiUrl = "https://bmclapi2.bangbang93.com/optifine/versionList";
                const bmclApiResponse = await fetch(bmclapiUrl);
                const bmclApiJson = await bmclApiResponse.json();
                
                const matchingModule = bmclApiJson.find(module => module.filename === fileName);
                
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
                const bmclApiRedirectUrl = `https://bmclapi2.bangbang93.com/optifine/${mcversion}/${type}/${patch}`;
                
                // Create and cache the response
                const cacheHeaders = {
                    "Cache-Control": "public, max-age=0, s-maxage=300"
                };
                const bmclApiRedirectResponse = new Response(null, {
                    "status": 302,
                    "headers": {
                        ...cacheHeaders,
                        "Location": bmclApiRedirectUrl
                    }
                });
                cache.put(request, bmclApiRedirectResponse.clone());
                return bmclApiRedirectResponse;
                */
                
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
            
            // Validate the download link
            const downloadLink = match[1];
            const downloadResponse = await fetch(downloadLink, { method: 'HEAD' });
            
            if (downloadResponse.status !== 200 || !downloadResponse.headers.has("Content-Disposition")) {
                // Redirect to BMCLAPI2 if the download link is not valid
                /*
                const bmclapiUrl = "https://bmclapi2.bangbang93.com/optifine/versionList";
                const bmclApiResponse = await fetch(bmclapiUrl);
                const bmclApiJson = await bmclApiResponse.json();
                
                const matchingModule = bmclApiJson.find(module => module.filename === fileName);
                
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
                const bmclApiRedirectUrl = `https://bmclapi2.bangbang93.com/optifine/${mcversion}/${type}/${patch}`;
                
                // Create and cache the response
                const cacheHeaders = {
                    "Cache-Control": "public, max-age=0, s-maxage=300"
                };
                const bmclApiRedirectResponse = new Response(null, {
                    "status": 302,
                    "headers": {
                        ...cacheHeaders,
                        "Location": bmclApiRedirectUrl
                    }
                });
                cache.put(request, bmclApiRedirectResponse.clone());
                return bmclApiRedirectResponse;
                */
                
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
            
            // If the download link is valid, redirect to it
            const cacheHeaders = {
                "Cache-Control": "public, max-age=0, s-maxage=300"
            };
            const redirectResponse = new Response(null, {
                "status": 302,
                "headers": {
                    ...cacheHeaders,
                    "Location": downloadLink
                }
            });
            cache.put(request, redirectResponse.clone());
            return redirectResponse;
            
        } catch (error) {
            return new Response(JSON.stringify({
                "code": 500,
                "message": "Internal server error."
            }), {
                "status": 500,
                "headers": {
                    "Content-Type": "application/json"
                }
            });
        }
    }
};
