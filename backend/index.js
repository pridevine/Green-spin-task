const express = require('express');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { JSDOM } = require('jsdom');
const cors = require('cors');

const app = express();
app.use(cors());

const uploadDir = path.join(__dirname, 'uploads');
const upload = multer({ dest: uploadDir });

// Ensure uploads folder exists
async function ensureUploadsDir() {
  try {
    await fs.mkdir(uploadDir, { recursive: true });
  } catch (e) {}
}
ensureUploadsDir();

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const origName = req.file.originalname;
    const ext = path.extname(origName).toLowerCase();
    const filePath = req.file.path;

    let result = {
      filename: origName,
      pages: null,
      headings: []
    };

    if (ext === '.pdf') {
      const buffer = await fs.readFile(filePath);
      const data = await pdfParse(buffer);

      result.pages = data.numpages || null;

      const lines = data.text
        .split(/\r?\n/)
        .map(l => l.trim())
        .filter(Boolean);

      const headings = [];
      for (let line of lines) {
        if (
          line.length <= 120 &&
          (line === line.toUpperCase() ||
            (/^[A-Z][a-z].{0,80}$/.test(line) && line.split(' ').length <= 10))
        ) {
          headings.push(line);
        }
      }

      result.headings = [...new Set(headings)];

    } else if (ext === '.docx') {
      const buffer = await fs.readFile(filePath);
      const { value: html } = await mammoth.convertToHtml({ buffer });

      const dom = new JSDOM(html);
      const doc = dom.window.document;

      const headings = [];
      for (let i = 1; i <= 6; i++) {
        doc.querySelectorAll(`h${i}`).forEach(h => {
          const txt = h.textContent.trim();
          if (txt) headings.push(txt);
        });
      }

      if (headings.length === 0) {
        const paragraphs = [...doc.querySelectorAll('p')].map(p =>
          p.textContent.trim()
        );
        paragraphs.forEach(p => {
          if (
            p.length <= 120 &&
            (p === p.toUpperCase() || p.split(' ').length <= 10)
          ) {
            headings.push(p);
          }
        });
      }

      result.headings = [...new Set(headings)];

      const textContent = doc.body.textContent || '';
      const words = textContent.trim().split(/\s+/).filter(Boolean).length;

      result.pages = Math.max(1, Math.ceil(words / 400));
    } else {
      return res.status(400).json({ error: 'Only PDF or DOCX supported' });
    }

    await fs.unlink(filePath).catch(() => {});

    return res.json(result);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error', details: String(err) });
  }
});
const PORT = 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
