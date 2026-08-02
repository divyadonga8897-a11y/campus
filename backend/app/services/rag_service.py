"""
Unified RAG Service — Central intelligence layer for CampusConnect AI.
Both Website Chat and WhatsApp Chat share this single service.

Functions:
  retrieve_context(question)     — Embeds query, searches Pinecone, returns ranked chunks
  generate_answer(question, ctx) — Builds hallucination-proof prompt, calls Groq LLM
  query_assistant(prompt, history, db) — Full pipeline: retrieve → generate → log
  process_document(...)          — Extract text, chunk, embed, upsert to Pinecone
"""
import os
import datetime
from sqlalchemy.orm import Session
from app.models.models import (
    College, Department, Course, FeeStructure, Scholarship, Facility, PlacementStatistics, Alumni
)

# Optional third-party imports
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

try:
    from groq import Groq
except ImportError:
    Groq = None


class RagService:
    def __init__(self):
        from app.core.config import settings
        self.openai_key = settings.OPENAI_API_KEY or os.getenv("OPENAI_API_KEY", "")
        self.groq_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        self.pinecone_key = settings.PINECONE_API_KEY or os.getenv("PINECONE_API_KEY", "")
        self.pinecone_index = getattr(settings, 'PINECONE_INDEX_NAME', '') or os.getenv("PINECONE_INDEX_NAME", "campusconnect-ai")

        self.openai_client = OpenAI(api_key=self.openai_key) if (OpenAI and self.openai_key) else None
        self.groq_client = Groq(api_key=self.groq_key) if (Groq and self.groq_key) else None

    # ================================================================
    #  PUBLIC API — used by both Website Chat and WhatsApp Chat
    # ================================================================

    def query_assistant(self, prompt: str, history: list, db: Session) -> str:
        """
        Full RAG pipeline entry point.
        Called by /api/v1/chat (website) and /api/v1/whatsapp/webhook (WhatsApp).
        """
        response = ""

        # Try RAG pipeline first if credentials exist
        if (self.groq_client or self.openai_client) and self.pinecone_key:
            retrieval = self.retrieve_context(prompt)
            if retrieval["context"]:
                response = self.generate_answer(
                    question=prompt,
                    context=retrieval["context"],
                    sources=retrieval["sources"],
                    history=history
                )

        # Fallback to local semantic router if RAG returns nothing
        if not response:
            response = self._query_local_semantic_router(prompt, db)

        # Log search to database history
        try:
            from app.models.models import SearchHistory
            now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            log_item = SearchHistory(
                query=prompt,
                response=response,
                timestamp=now_str
            )
            db.add(log_item)
            db.commit()
        except Exception as log_err:
            print(f"[RAG-Log] Error writing search history: {log_err}")

        return response

    def retrieve_context(self, question: str) -> dict:
        """
        Embeds the question and queries Pinecone for relevant document chunks.
        Returns: {
            "context": str,
            "sources": [str],
            "matches": [{"text", "filename", "score", "chunk_number", "document_id"}],
            "total_matches": int
        }
        """
        result = {"context": "", "sources": [], "matches": [], "total_matches": 0}

        try:
            from pinecone import Pinecone
            pc = Pinecone(api_key=self.pinecone_key)
            index = pc.Index(self.pinecone_index)

            # Generate query embedding
            embeddings = pc.inference.embed(
                model="multilingual-e5-large",
                inputs=[question],
                parameters={"input_type": "query", "truncate": "END"}
            )
            query_vector = embeddings[0].values

            # Query Pinecone for top 5 matches
            search_results = index.query(
                vector=query_vector,
                top_k=5,
                include_metadata=True
            )

            context_parts = []
            sources = set()
            matches_detail = []

            for match in search_results.get("matches", []):
                if match.score >= 0.5:  # Relevance threshold
                    meta = match.get("metadata", {})
                    text = meta.get("text", "")
                    filename = meta.get("filename", "")
                    chunk_number = meta.get("chunk_number", 0)
                    document_id = meta.get("document_id", "")

                    if text:
                        context_parts.append(text)
                    if filename:
                        sources.add(filename)

                    matches_detail.append({
                        "text": text[:200] + "..." if len(text) > 200 else text,
                        "filename": filename,
                        "score": round(match.score * 100, 1),
                        "chunk_number": chunk_number,
                        "document_id": document_id
                    })

            result["context"] = "\n---\n".join(context_parts)
            result["sources"] = list(sources)
            result["matches"] = matches_detail
            result["total_matches"] = len(matches_detail)

        except Exception as e:
            print(f"[RAG] Error in retrieve_context: {e}")

        return result

    def generate_answer(self, question: str, context: str, sources: list = None, history: list = None) -> str:
        """
        Sends the retrieved context + question to Groq LLM with hallucination-proof prompting.
        """
        sources = sources or []
        history = history or []

        sources_suffix = f"\n\n**Sources:** {', '.join(sources)}" if sources else ""

        system_instruction = (
            "You are the CampusConnect AI Assistant for Sri Satya Institute of Engineering and Technology.\n\n"
            "STRICT RULES:\n"
            "1. Answer ONLY using the provided context below. Do NOT generate information from your training data.\n"
            "2. If the answer cannot be found in the context, respond with: "
            "\"I couldn't find this information in the college knowledge base. Please contact the college office for details.\"\n"
            "3. Never invent fees, dates, names, percentages, or statistics that are not in the context.\n"
            "4. Be professional, structured, and concise. Use bullet points and bold formatting when listing data.\n"
            "5. Always cite which document the information comes from when possible.\n\n"
            f"CONTEXT FROM COLLEGE DOCUMENTS:\n{context}"
        )

        messages = [{"role": "system", "content": system_instruction}]
        # Add conversation history for multi-turn context
        for h in history:
            messages.append({"role": h.get("role", "user"), "content": h.get("content", "")})
        messages.append({"role": "user", "content": question})

        try:
            if self.groq_client:
                completion = self.groq_client.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=messages,
                    temperature=0.3,  # Low temperature for factual accuracy
                    max_tokens=2048
                )
                return completion.choices[0].message.content + sources_suffix
            elif self.openai_client:
                completion = self.openai_client.chat.completions.create(
                    model="gpt-4o-mini",
                    messages=messages,
                    temperature=0.3,
                    max_tokens=2048
                )
                return completion.choices[0].message.content + sources_suffix
        except Exception as e:
            print(f"[RAG] Error in generate_answer: {e}")

        return ""

    def rag_playground(self, question: str) -> dict:
        """
        Admin-facing RAG test endpoint.
        Returns retrieval details + generated answer for debugging/monitoring.
        """
        retrieval = self.retrieve_context(question)

        answer = ""
        if retrieval["context"]:
            answer = self.generate_answer(
                question=question,
                context=retrieval["context"],
                sources=retrieval["sources"]
            )
        else:
            answer = "No relevant documents found in the knowledge base for this query."

        return {
            "question": question,
            "answer": answer,
            "retrieved_documents": retrieval["sources"],
            "chunks_retrieved": retrieval["total_matches"],
            "matches": retrieval["matches"],
            "context_length": len(retrieval["context"]),
            "has_context": bool(retrieval["context"])
        }

    # ================================================================
    #  DOCUMENT INGESTION — used by admin_kb.py upload/reindex
    # ================================================================

    def process_and_index_document(self, doc_id: str, file_path: str, filename: str, category: str, file_type: str, db: Session = None):
        """
        Background task: extracts text, recursively chunks it, generates embeddings,
        and upserts to Pinecone index with full metadata.
        """
        from app.database.connection import SessionLocal
        local_db = db if db is not None else SessionLocal()
        
        print(f"\n--- [RAG Ingestion Startup] ---")
        print(f"File received: {filename}")
        print(f"Document ID: {doc_id}")
        print(f"File path: {file_path}")
        print(f"Category: {category}")
        
        try:
            # 1. Text Extraction
            print(f"[RAG-Index] Step 1: Text extraction started...")
            text = self._extract_text(file_path, file_type)
            if not text.strip():
                print(f"[RAG-Index] Step 1: Text extraction FAILED (empty text).")
                raise ValueError("Extracted text is empty or blank")
            
            char_count = len(text)
            print(f"[RAG-Index] Step 1: Text extraction SUCCESS. Characters extracted: {char_count}")

            # 2. Recursive Chunking
            print(f"[RAG-Index] Step 2: Chunk generation started...")
            chunks = self._split_text_recursive(text, max_chunk_size=1000, overlap=200)
            chunk_count = len(chunks)
            print(f"[RAG-Index] Step 2: Chunk generation SUCCESS. Chunks generated: {chunk_count}")

            # 3. Connect to Pinecone and check dimension
            print(f"[RAG-Index] Step 3: Checking Pinecone configuration...")
            if not self.pinecone_key:
                raise ValueError("Pinecone API Key (PINECONE_API_KEY) is not set.")
                
            from pinecone import Pinecone
            pc = Pinecone(api_key=self.pinecone_key)
            index = pc.Index(self.pinecone_index)
            
            desc = pc.describe_index(self.pinecone_index)
            dimension = desc.dimension
            print(f"[RAG-Index] Step 3: Pinecone index found: '{self.pinecone_index}' (Dimension: {dimension})")
            
            # Select embedding model & provider based on dimension compatibility
            if dimension == 1024:
                embed_model = "multilingual-e5-large"
                provider = "pinecone"
                print(f"[RAG-Index] Selected embedding provider: Pinecone Inference API (Model: {embed_model})")
            elif dimension == 1536:
                if not self.openai_key:
                    raise ValueError(f"Pinecone index expects 1536 dimensions but OpenAI API Key (OPENAI_API_KEY) is not configured.")
                embed_model = "text-embedding-3-small"
                provider = "openai"
                print(f"[RAG-Index] Selected embedding provider: OpenAI API (Model: {embed_model})")
            else:
                raise ValueError(f"Unsupported Pinecone index dimension: {dimension}. Expected 1024 or 1536.")

            # 4. Generate Embeddings & Upsert
            print(f"[RAG-Index] Step 4: Generating embeddings & uploading to Pinecone...")
            now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
            batch_size = 32
            vectors = []

            for i in range(0, len(chunks), batch_size):
                batch_chunks = chunks[i:i + batch_size]
                
                if provider == "pinecone":
                    embeddings_res = pc.inference.embed(
                        model=embed_model,
                        inputs=batch_chunks,
                        parameters={"input_type": "passage", "truncate": "END"}
                    )
                    batch_vectors = [emb.values for emb in embeddings_res]
                else:  # openai
                    from openai import OpenAI
                    client = OpenAI(api_key=self.openai_key)
                    res = client.embeddings.create(input=batch_chunks, model=embed_model)
                    batch_vectors = [emb.embedding for emb in res.data]

                for idx, vector_values in enumerate(batch_vectors):
                    chunk_idx = i + idx
                    vector_id = f"{doc_id}_{chunk_idx}"
                    vectors.append({
                        "id": vector_id,
                        "values": vector_values,
                        "metadata": {
                            "document_id": doc_id,
                            "document_name": filename,
                            "filename": filename,
                            "category": category,
                            "chunk_number": chunk_idx,
                            "upload_date": now_str,
                            "source": f"knowledge_base/{category}/{filename}",
                            "text": batch_chunks[idx]
                        }
                    })

            print(f"[RAG-Index] Embedding generation: SUCCESS. Upserting {len(vectors)} vectors to Pinecone...")
            
            # Upsert in batches of 100
            for i in range(0, len(vectors), 100):
                batch = vectors[i:i + 100]
                index.upsert(vectors=batch)
            print(f"[RAG-Index] Pinecone upload: SUCCESS.")

            # 5. Update Database Record
            print(f"[RAG-Index] Step 5: Updating Database...")
            from app.models.models import KnowledgeDocument
            doc = local_db.query(KnowledgeDocument).filter(KnowledgeDocument.id == doc_id).first()
            if doc:
                doc.status = "Indexed"
                doc.chunk_count = chunk_count
                doc.indexed_status = True
                doc.error_message = None
                doc.updated_at = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
                local_db.commit()
                print(f"[RAG-Index] Final status: INDEXED for document '{filename}'")
            print(f"--- [RAG Ingestion Finished SUCCESS] ---\n")

        except Exception as e:
            err_msg = str(e)
            print(f"[RAG-Index] Pipeline FAILED for document '{filename}': {err_msg}")
            print(f"--- [RAG Ingestion Finished FAILED] ---\n")
            
            try:
                from app.models.models import KnowledgeDocument
                doc = local_db.query(KnowledgeDocument).filter(KnowledgeDocument.id == doc_id).first()
                if doc:
                    doc.status = "Failed"
                    doc.error_message = err_msg[:500]
                    doc.updated_at = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
                    local_db.commit()
            except Exception as db_err:
                print(f"[RAG-Index] Could not update failure state in DB: {db_err}")
                
        finally:
            if db is None:
                local_db.close()

    def delete_document_vectors(self, doc_id: str):
        """
        Delete all vector embeddings for a given document from the Pinecone index.
        """
        try:
            from pinecone import Pinecone
            pc = Pinecone(api_key=self.pinecone_key)
            index = pc.Index(self.pinecone_index)
            print(f"[RAG-Index] Deleting vectors for document {doc_id} from Pinecone...")
            index.delete(filter={"document_id": doc_id})
        except Exception as e:
            print(f"[RAG-Index] Error deleting vectors for document {doc_id} from Pinecone: {e}")

    # ================================================================
    #  INTERNAL HELPERS
    # ================================================================

    def _extract_text(self, file_path: str, file_type: str) -> str:
        """Extract raw text from PDF, DOCX, TXT, or MD files."""
        text = ""
        if file_type == "pdf":
            import pypdf
            reader = pypdf.PdfReader(file_path)
            for page in reader.pages:
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
        elif file_type == "docx":
            import docx
            doc = docx.Document(file_path)
            text = "\n".join([para.text for para in doc.paragraphs])
        else:  # txt or md
            with open(file_path, "r", encoding="utf-8") as f:
                text = f.read()
        return text

    def _split_text_recursive(self, text: str, max_chunk_size: int = 1000, overlap: int = 200) -> list:
        """Recursively split text using paragraph, line, and word boundaries."""
        separators = ["\n\n", "\n", " ", ""]
        chunks = []

        def split_helper(current_text: str, current_separator_idx: int):
            if len(current_text) <= max_chunk_size:
                chunks.append(current_text.strip())
                return

            if current_separator_idx >= len(separators):
                # Hard slice if no separators left
                start = 0
                while start < len(current_text):
                    chunks.append(current_text[start:start + max_chunk_size].strip())
                    start += max_chunk_size - overlap
                return

            sep = separators[current_separator_idx]
            parts = current_text.split(sep) if sep else list(current_text)
            current_chunk = ""

            for part in parts:
                if len(current_chunk) + len(part) + (len(sep) if current_chunk else 0) <= max_chunk_size:
                    if current_chunk:
                        current_chunk += sep + part
                    else:
                        current_chunk = part
                else:
                    if current_chunk:
                        chunks.append(current_chunk.strip())
                        overlap_len = min(overlap, len(current_chunk))
                        current_chunk = current_chunk[-overlap_len:] + sep + part
                    else:
                        split_helper(part, current_separator_idx + 1)

            if current_chunk:
                chunks.append(current_chunk.strip())

        split_helper(text, 0)
        return [c for c in chunks if c]

    def _query_local_semantic_router(self, prompt: str, db: Session) -> str:
        """Fallback: keyword-matched responses from the database when RAG/Pinecone is unavailable."""
        query = prompt.lower()

        # 1. Fees Intent
        if any(w in query for w in ["fee", "fees", "cost", "charge", "tuition"]):
            fees = db.query(FeeStructure).all()
            if not fees:
                return "The college fee structure varies between B.Tech departments. Generally, annual tuition fees are around 75,000 to 90,000 INR. Optional hostel charges are 55,000 INR annually."

            fee_lines = []
            for f in fees:
                fee_lines.append(f"- **{f.course_id.replace('b-tech-', '').upper()}** ({f.fee_type}): Tuition Fee: {f.tuition_fee} INR/Yr | Hostel: {f.hostel_fee} INR/Yr")
            return (
                "Here is the fee structure for B.Tech programs at Sri Satya Institute of Engineering and Technology (A.Y. 2024-25):\n\n"
                + "\n".join(fee_lines) +
                "\n\n*Note: Transport fees are optional (18,000 INR/year). Standard examination and lab fees are charged at the beginning of semesters.*"
            )

        # 2. Scholarship Intent
        if any(w in query for w in ["scholarship", "scholarships", "concession", "reimbursement", "financial aid"]):
            schol = db.query(Scholarship).all()
            if not schol:
                return "Sri Satya Institute offers Merit Excellence Scholarships (up to 50% tuition waiver for 90%+ marks) and SC/ST Government fee reimbursements. Please contact the administrative office for details."

            sch_lines = []
            for s in schol:
                sch_lines.append(f"- **{s.title}**: Benefits include {', '.join(s.benefits)}. Eligibility: {', '.join(s.eligibility)}.")
            return (
                "Sri Satya Institute supports students through various financial aid programs:\n\n"
                + "\n".join(sch_lines) +
                "\n\n*You can apply for these during admission counseling by submitting caste, income, or 10+2 mark sheets.*"
            )

        # 3. Placements & Recruiters Intent
        if any(w in query for w in ["placement", "placements", "recruit", "recruiter", "recruiters", "salary", "package", "lpa"]):
            stats = db.query(PlacementStatistics).order_by(PlacementStatistics.year.desc()).first()
            alumni_count = db.query(Alumni).count()
            if stats:
                return (
                    f"Sri Satya Institute has an excellent placement record. In the recent **{stats.year} graduating batch**:\n\n"
                    f"- **Placement Percentage**: {stats.placement_percentage}%\n"
                    f"- **Highest Package Offered**: {stats.highest_package}\n"
                    f"- **Average Package**: {stats.average_package}\n"
                    f"- **Participating Companies**: {stats.companies_count}+\n\n"
                    f"Our graduates are placed at leading companies like TCS, Wipro, Infosys, Accenture, Amazon, and Qualcomm."
                )
            return "SSIET maintains a 90%+ placement rate. Our highest package reaches 14.5 LPA, with an average package of 5.1 LPA. Partner recruiters include TCS, Wipro, Infosys, and Tech Mahindra."

        # 4. Department / Course details
        if any(w in query for w in ["course", "courses", "department", "departments", "programs", "b.tech", "cse", "aids", "ece", "civil", "mech"]):
            depts = db.query(Department).all()
            dept_lines = [f"- **{d.department_name} ({d.short_name})** - HOD: {d.head_of_department}." for d in depts]
            return (
                "Sri Satya Institute of Engineering and Technology offers 5 specialized B.Tech programs:\n\n"
                + "\n".join(dept_lines) +
                "\n\nEach course is 4 years (8 semesters) in duration and requires 10+2 / intermediate MPC stream eligibility with EAMCET/JEE ranks."
            )

        # 5. Hostel Intent
        if any(w in query for w in ["hostel", "hostels", "mess", "dining", "room", "accommodation"]):
            return (
                "Sri Satya Institute provides separate residential hostels for boys and girls inside the college boundary walls:\n\n"
                "- **Accommodations**: Double & Triple sharing rooms fully furnished with tables, cupboards, and bedding.\n"
                "- **Food & Dining**: Clean dining halls serving nutritious vegetarian and non-vegetarian food mapped by student mess committees.\n"
                "- **Security**: 24/7 gate security, biometric logs, wardens resident on-site, and full CCTV coverage.\n"
                "- **Amenities**: High-speed campus Wi-Fi, late-hour reading rooms, and indoor sports zones."
            )

        # 6. Default Fallback Response
        college = db.query(College).first()
        college_name = college.name if college else "Sri Satya Institute of Engineering and Technology"
        return (
            f"Hello! I am the **CampusConnect AI Assistant** for {college_name}.\n\n"
            "I can help you explore:\n"
            "- 📚 **B.Tech Programs** & Engineering Departments\n"
            "- 💰 **Fee Structures** & Annual Tuition/Hostel costs\n"
            "- 🎓 **Scholarships** & Government Fee Reimbursements\n"
            "- 🏢 **Campus Facilities**, AI labs, and central libraries\n"
            "- 💼 **Placement Records** & Recruiting Partners\n"
            "- 🏠 **Hostel Life** and dining facilities\n\n"
            "What would you like to explore today? Try asking: *'What are the fees for B.Tech CSE?'* or *'What is the highest package offered?'*"
        )
