// Create web server
// Web server will serve static files
// Web server will serve comments
// Web server will serve comments from a file
// Web server will serve comments from a file and store new comments in the file
// Web server will serve comments from a file and store new comments in the file and store comments in a variable

// Load modules
var http = require('http');
var fs = require('fs');
var url = require('url');

// Variables
var comments = [];

// Create web server
http.createServer(function (req, res) {
  // Parse the URL
  var url_parts = url.parse(req.url);

  // Serve static files
  if (url_parts.pathname === '/' || url_parts.pathname === '/index.html') {
    fs.readFile('./index.html', function (err, data) {
      if (err) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Server Error');
        return;
      }
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(data);
    });
  }

  // Serve comments
  else if (url_parts.pathname === '/comments') {
    if (req.method === 'POST') {
      var comment = '';
      req.on('data', function (chunk) {
        comment += chunk;
      });
      req.on('end', function () {
        comments.push(comment);
        fs.appendFile('comments.txt', comment + '\n', function (err) {
          if (err) console.error(err);
        });
        res.writeHead(201, {'Content-Type': 'text/plain'});
        res.end('Comment added');
      });
    } else {
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(comments.join('\n'));
    }
  }

  // Serve 404
  else {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Not Found');
  }
}).listen(3000, 'localhost');

console.log('Server running at http://localhost:3000/');