# 📄 Document Upload & Parsing — Green Spin Task  
**By Dev Verma**

This project is a simple full-stack application that allows users to upload **PDF** or **DOCX** files and automatically extract:
- **Filename**
- **Total pages**  
  - PDF → ✔ accurate  
  - DOCX → ✔ estimated using word count  
- **Headings** from the document

The system consists of:
- **Backend — Node.js + Express**
- **Frontend — React (Vite)**

---

## 🚀 Live Demo (Loom video)
👉 *Add your Loom link here after recording*  
`[ Loom video link here ]`

---

# 📁 Project Structure

```
Green-spin-task/
│
├── backend/                 # Express API
│   ├── index.js             # Upload + parsing logic
│   ├── package.json
│   └── uploads/ (ignored)
│
├── doc-preview-frontend/    # React frontend (Vite)
│   ├── src/App.jsx
│   ├── src/main.jsx
│   └── package.json
│
└── README.md
```

---

# ⚙️ Backend Setup (Node.js + Express)

### 1️⃣ Go into backend folder
```bash
cd backend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Run server
```bash
npm run dev
```

The backend runs at:

👉 **http://localhost:4000**

### 📌 API Endpoint

#### POST `/upload`

**Body:**  
`form-data` → field name: **file**

**Example Response**
```json
{
  "filename": "sample.docx",
  "pages": 3,
  "headings": ["Introduction", "Methodology", "Conclusion"]
}
```

---

# 💻 Frontend Setup (React + Vite)

### 1️⃣ Go into frontend folder
```bash
cd doc-preview-frontend
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Start development server
```bash
npm run dev
```

Frontend runs at:

👉 **http://localhost:5173**  
(or whatever URL Vite prints)

---

# 🔧 How It Works

### 📘 **PDF Parsing**
- Uses **pdf-parse**
- Extracts:
  - text  
  - accurate page count  
  - headings (uppercase or large text heuristics)

### 📗 **DOCX Parsing**
- Converted to HTML using **mammoth**
- Parsed using **JSDOM**
- Headings extracted from `<h1>` → `<h6>`
- Page count ≈ **word count / 400**.
