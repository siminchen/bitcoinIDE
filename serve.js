#!/usr/bin/env node
// Minimal dependency-free static file server for the Bitcoin Script IDE.
// Serves the repo root over HTTP. No npm dependencies (built-ins only).
// Usage: node serve.js   (PORT env var overrides the default 8000)

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = __dirname;
const PORT = process.env.PORT || 8000;

const TYPES = {
	".html": "text/html; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".map": "application/json; charset=utf-8",
	".svg": "image/svg+xml",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".ico": "image/x-icon",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
	".eot": "application/vnd.ms-fontobject",
	".txt": "text/plain; charset=utf-8",
	".md": "text/plain; charset=utf-8"
};

const server = http.createServer(function (req, res) {
	var pathname = decodeURIComponent(url.parse(req.url).pathname);
	var filePath = path.join(ROOT, pathname);

	// Guard against path traversal outside the repo root.
	if (path.relative(ROOT, filePath).split(path.sep)[0] === "..") {
		res.writeHead(403); res.end("403 Forbidden"); return;
	}

	fs.stat(filePath, function (err, stat) {
		if (err) { res.writeHead(404); res.end("404 Not Found"); return; }
		if (stat.isDirectory()) filePath = path.join(filePath, "index.html");
		fs.readFile(filePath, function (err2, data) {
			if (err2) { res.writeHead(404); res.end("404 Not Found"); return; }
			var type = TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
			res.writeHead(200, { "Content-Type": type });
			res.end(data);
		});
	});
});

server.listen(PORT, function () {
	console.log("Bitcoin Script IDE → http://localhost:" + PORT + "/build/editor.html");
});
