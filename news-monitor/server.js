const express = require('express');
const https = require('https');
const http = require('http');
const { URL } = require('url');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files (index.html, css, js, assets)
app.use(express.static(path.join(__dirname)));

// Health check - frontend uses this to detect if proxy is available
app.get('/api/health', (req, res) => {
    res.json({ proxy: true });
});

// Proxy endpoint: strips X-Frame-Options and CSP so iframes work
app.get('/proxy', (req, res) => {
    const targetUrl = req.query.url;
    if (!targetUrl) {
        return res.status(400).send('Missing ?url= parameter');
    }

    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch {
        return res.status(400).send('Invalid URL');
    }

    // Only allow http(s)
    if (!['http:', 'https:'].includes(parsed.protocol)) {
        return res.status(400).send('Only HTTP(S) URLs allowed');
    }

    const client = parsed.protocol === 'https:' ? https : http;

    const proxyReq = client.get(targetUrl, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'nl-BE,nl;q=0.9,en;q=0.8',
        },
        timeout: 15000,
    }, (proxyRes) => {
        // Follow redirects
        if ([301, 302, 303, 307, 308].includes(proxyRes.statusCode)) {
            const location = proxyRes.headers['location'];
            if (location) {
                // Resolve relative redirects
                const redirectUrl = new URL(location, targetUrl).href;
                return res.redirect(`/proxy?url=${encodeURIComponent(redirectUrl)}`);
            }
        }

        // Copy headers but strip the ones that block iframe embedding
        const headersToStrip = [
            'x-frame-options',
            'content-security-policy',
            'content-security-policy-report-only',
        ];

        for (const [key, value] of Object.entries(proxyRes.headers)) {
            if (headersToStrip.includes(key.toLowerCase())) continue;
            // Rewrite cookies to work through proxy
            if (key.toLowerCase() === 'set-cookie') continue;
            try {
                res.setHeader(key, value);
            } catch {
                // Skip invalid headers
            }
        }

        res.status(proxyRes.statusCode);

        // For HTML responses, rewrite relative URLs to absolute
        const contentType = proxyRes.headers['content-type'] || '';
        if (contentType.includes('text/html')) {
            let body = '';
            proxyRes.setEncoding('utf8');
            proxyRes.on('data', (chunk) => { body += chunk; });
            proxyRes.on('end', () => {
                // Inject a <base> tag so relative URLs resolve to the original domain
                const baseTag = `<base href="${parsed.origin}${parsed.pathname}">`;
                if (body.includes('<head>')) {
                    body = body.replace('<head>', `<head>${baseTag}`);
                } else if (body.includes('<HEAD>')) {
                    body = body.replace('<HEAD>', `<HEAD>${baseTag}`);
                } else {
                    body = baseTag + body;
                }
                res.send(body);
            });
        } else {
            proxyRes.pipe(res);
        }
    });

    proxyReq.on('error', (err) => {
        console.error('Proxy error:', err.message);
        res.status(502).send('Proxy error: could not reach target site');
    });

    proxyReq.on('timeout', () => {
        proxyReq.destroy();
        res.status(504).send('Proxy timeout');
    });
});

app.listen(PORT, () => {
    console.log(`\n  HLN Nieuwsmonitor draait op http://localhost:${PORT}\n`);
});
