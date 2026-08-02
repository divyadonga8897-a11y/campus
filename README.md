# 🎓 CampusConnect AI  
## AI-Powered College Information System with RAG-Based Intelligent Assistant

CampusConnect AI is a full-stack AI-powered college information platform that provides students, parents, and visitors with instant access to college-related information through a modern web application and an intelligent RAG (Retrieval Augmented Generation) chatbot.

The main objective of this project is to reduce the time required to search college information and provide accurate answers using official institutional documents.

---

# 🚀 Project Overview

Traditional college websites contain information across multiple pages and documents, making it difficult for users to quickly find required details.

CampusConnect AI solves this problem by combining:

- Modern college website
- Admin content management system
- AI chatbot
- Document-based knowledge system
- WhatsApp AI assistant integration
- Retrieval Augmented Generation pipeline

---

# ✨ Key Features

## 🌐 College Information Portal

Users can access:

- College information
- Courses and departments
- Admission details
- Fee structures
- Academic information
- Campus facilities
- Placement details
- Contact information


## 🔐 Admin Dashboard

Secure administrator panel for managing college data.

Admin features:

- Admin authentication
- Content management
- Document upload
- Knowledge base management
- AI service monitoring


---

# 🤖 RAG-Based AI Assistant

CampusConnect AI uses Retrieval Augmented Generation to provide accurate answers from uploaded college documents.

Instead of generating random responses, the AI retrieves relevant information from the college knowledge base and generates responses based on official data.

### RAG Workflow

```
College Documents
        |
        ↓
Text Extraction
        |
        ↓
Document Chunking
        |
        ↓
Embedding Generation
        |
        ↓
Pinecone Vector Database
        |
        ↓
User Query
        |
        ↓
Similarity Search
        |
        ↓
Relevant Context Retrieval
        |
        ↓
Groq LLM
        |
        ↓
AI Response
```

---

# 📚 Knowledge Base Pipeline

Admin uploads documents such as:

- Fee Structure
- Admission Information
- Course Details
- Department Information
- Placement Reports
- Academic Documents


Processing:

```
PDF / Documents

        ↓

Text Extraction

        ↓

Recursive Chunking

        ↓

Embedding Creation

        ↓

Pinecone Storage

        ↓

Available for AI Retrieval
```

---

# 🧠 AI Technology Stack

## Large Language Model

**Groq**

Model:

```
llama-3.3-70b-versatile
```

Used for generating final AI responses.


## Vector Database

**Pinecone**

Index:

```
campusconnect-knowledge
```

Used for storing and searching document embeddings.


## Embedding Model

Pinecone Embedding Model

Used to convert document text into vector representations.

---

# 💬 WhatsApp AI Assistant

Integrated using:

**Wasender API**

Workflow:

```
User WhatsApp Message

        ↓

Wasender API

        ↓

CampusConnect Backend

        ↓

RAG Retrieval

        ↓

Groq AI Generation

        ↓

WhatsApp Response
```

Users can interact with the college AI assistant directly through WhatsApp.

---

# 🛠️ Tech Stack

## Frontend

- Next.js
- React.js
- TypeScript
- Tailwind CSS


## Backend

- FastAPI
- Python
- SQLAlchemy


## Database

- PostgreSQL
- Supabase


## AI Stack

- Groq LLM
- Pinecone Vector Database
- RAG Pipeline


## Deployment

Frontend:

```
Vercel
```

Backend:

```
Railway / Render
```

Database:

```
Supabase PostgreSQL
```

---

# 📂 System Architecture

```
                Users

                  |
                  ↓

          Next.js Frontend

                  |
                  ↓

          FastAPI Backend

                  |
        ---------------------

        |                   |

 PostgreSQL            RAG Pipeline

        |                   |

 Supabase          Pinecone + Groq

        |
        
  College Data
```

---

# 📁 Project Structure

```
CampusConnect-AI

├── frontend
│   ├── Next.js Application
│   ├── Components
│   └── Pages
│
├── backend
│   ├── FastAPI Application
│   ├── APIs
│   ├── Services
│   └── Database Models
│
└── README.md
```

---

# ⚙️ Local Setup

## Frontend

```bash
cd frontend

npm install

npm run dev
```


## Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 🔑 Environment Variables

Frontend:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_API_URL=
```


Backend:

```
DATABASE_URL=

SUPABASE_URL=
SUPABASE_KEY=

PINECONE_API_KEY=
PINECONE_INDEX_NAME=

GROQ_API_KEY=

WASENDER_API_KEY=
```

---

# 🎯 Project Objective

CampusConnect AI creates a smart digital campus assistant that improves accessibility, reduces information searching time, and provides reliable AI-powered answers using official college knowledge sources.

---

# 👩‍💻 Developer

**Divya Donga**  
B.Tech CSE - Artificial Intelligence

---

# 📌 Future Enhancements

- Voice-based AI assistant
- Mobile application
- Multi-language support
- AI admission counselor
- Student portal
- Advanced analytics dashboard
