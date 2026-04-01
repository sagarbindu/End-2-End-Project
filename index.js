const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();   // ✅ THIS WAS MISSING

const PDF_DIR = path.join(__dirname, "public");

// Serve static files
app.use(express.static("public"));


// 🏠 Homepage (Blog UI)
app.get("/", (req, res) => {
  fs.readdir(PDF_DIR, (err, files) => {
    if (err) return res.send("Error loading files");

    const pdfs = files.filter(file => file.endsWith(".pdf"));

    let cards = "";

    pdfs.forEach(file => {
      const name = file.replace(".pdf", "").replace(/-/g, " ");

      cards += `
        <div class="card">
          <h2>${name}</h2>
          <p>DevOps Guide</p>
          <div class="buttons">
            <a href="/docs/${file}" target="_blank">Read</a>
            <a href="/download/${file}">Download</a>
          </div>
        </div>
      `;
    });

    res.send(`
      <html>
      <head>
        <title>DevOps Blog</title>
        <style>
          body {
            margin: 0;
            font-family: 'Segoe UI', sans-serif;
            background: #0f172a;
            color: white;
          }
          header {
            text-align: center;
            padding: 30px;
            background: #020617;
          }
          .container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            padding: 40px;
          }
          .card {
            background: #1e293b;
            padding: 20px;
            border-radius: 12px;
          }
          .buttons a {
            margin-right: 10px;
            padding: 8px 14px;
            border-radius: 6px;
            text-decoration: none;
          }
          .buttons a:first-child {
            background: #22c55e;
            color: black;
          }
          .buttons a:last-child {
            background: #3b82f6;
            color: white;
          }
        </style>
      </head>

      <body>
        <header>
          <h1>DevOps Learning Blog 🚀</h1>
          <p>By Sagar Dash</p>
        </header>

        <div class="container">
          ${cards}
        </div>
      </body>
      </html>
    `);
  });
});


// 📖 View PDF
app.get("/docs/:file", (req, res) => {
  const file = req.params.file;

  res.send(`
    <html>
      <body style="margin:0">
        <iframe src="/${file}" width="100%" height="100%"></iframe>
      </body>
    </html>
  `);
});


// ⬇️ Download
app.get("/download/:file", (req, res) => {
  const file = req.params.file;
  res.download(path.join(PDF_DIR, file));
});


// ❤️ Health
app.get("/health", (req, res) => {
  res.send("OK");
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});