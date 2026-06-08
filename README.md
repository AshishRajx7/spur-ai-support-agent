# Spur AI Support Agent

AI powered customer support chat application built for the Spur Founding Full Stack Engineer take home assignment.

Users can ask support questions, receive AI generated responses grounded in a store knowledge base, and continue conversations across page refreshes through session persistence.

## Live Demo

**Frontend:** https://your-frontend-url](https://spur-ai-support-agent-murex.vercel.app/

**API Documentation:** https://spur-ai-support-agent-j07c.onrender.com/

⚠️ Important: The backend is hosted on Render's free tier and may take ~30 seconds to wake up after inactivity. If the chat appears slow on the first request, open:

https://spur-ai-support-agent-j07c.onrender.com/chat/health

Expected response:

```json
{
  "status": "ok",
  "uptime": 17.301784924
}

---
```
# Tech Stack

| Layer      | Technology                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | SvelteKit + TypeScript                                 |
| Backend    | NestJS + TypeScript                                    |
| Database   | PostgreSQL                                             |
| ORM        | TypeORM                                                |
| Cache      | Redis                                                  |
| AI         | NVIDIA NIM Inference API (OpenAI Compatible)           |
| Model      | Llama 3.1 8B Instruct                                  |
| Deployment | Render (Backend, PostgreSQL, Redis), Vercel (Frontend) |

---

# Running Locally

## Prerequisites

* Node.js 18+
* PostgreSQL
* Redis
* NVIDIA NIM API Key (or any OpenAI compatible provider)

---

## Clone Repository

```bash
git clone https://github.com/AshishRajx7/spur-ai-support-agent.git

cd spur-ai-support-agent
```

## Backend Setup

```bash
cd backend

npm install
```

Create `.env`

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=shopspur

REDIS_URL=redis://localhost:6379

LLM_API_KEY=your_api_key
LLM_API_URL=https://integrate.api.nvidia.com/v1
LLM_MODEL=meta/llama-3.1-8b-instruct

NODE_ENV=development
PORT=3000
```

Run migrations:

```bash
npm run migration:run
```

Seed knowledge base:

```bash
npm run seed
```

Start backend:

```bash
npm run start:dev
```

Backend:

```text
http://localhost:3000
```

Swagger:

```text
http://localhost:3000/api
```

---

## Frontend Setup

```bash
cd frontend

npm install
```

Create `.env`

```env
PUBLIC_API_URL=http://localhost:3000
```

Start frontend:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# Environment Variables

## Backend

| Variable          | Description                    |
| ----------------- | ------------------------------ |
| DATABASE_HOST     | PostgreSQL host                |
| DATABASE_PORT     | PostgreSQL port                |
| DATABASE_USER     | PostgreSQL username            |
| DATABASE_PASSWORD | PostgreSQL password            |
| DATABASE_NAME     | PostgreSQL database            |
| REDIS_URL         | Redis connection URL           |
| LLM_API_KEY       | LLM API key                    |
| LLM_API_URL       | OpenAI compatible API base URL |
| LLM_MODEL         | Model identifier               |
| NODE_ENV          | development / production       |
| PORT              | Backend port                   |

## Frontend

| Variable       | Description     |
| -------------- | --------------- |
| PUBLIC_API_URL | Backend API URL |

---

# Architecture Overview

## Backend Modules

```text
src/

chat/
conversations/
messages/
knowledge/
llm/
redis/
common/
```

### chat

Orchestrates the complete request lifecycle.

### conversations

Creates and retrieves conversation sessions.

### messages

Persists user and AI messages.

### knowledge

Loads FAQ entries used for grounding.

### llm

Provider abstraction and model integration.

### redis

Conversation history caching.

### common

Shared DTOs, filters, and utilities.

---

# Request Flow

```text
POST /chat/message

        │

        ▼

ChatController

        │

        ▼

ChatService

 ├── ConversationService
 ├── MessageService
 ├── KnowledgeService
 └── LlmService

        │

        ▼

Persist Messages

        │

        ▼

Invalidate Cache

        │

        ▼

Return Reply
```

---

# Key Design Decisions

## Provider Agnostic LLM Layer

The LLM implementation sits behind a dedicated service abstraction.

This allows switching from NVIDIA to GPT-4o, Claude, Gemini, or any OpenAI compatible provider without touching business logic.

Only environment variables need to change.

## Knowledge Stored In Database

Store policies are persisted in PostgreSQL rather than hardcoded into prompts.

This allows knowledge updates without code changes and creates a clear path toward merchant managed FAQs.

## Redis Used Selectively

Redis is used only for conversation history caching.

Cache key format:

```text
conversation:{conversationId}:history
```

TTL:

```text
1 hour
```

Keeping Redis focused prevents unnecessary complexity.

## Session Based Conversations

No authentication was required by the assignment.

A UUID conversation ID is persisted in localStorage and reused across refreshes.

---

# API Reference

## POST /chat/message

Request

```json
{
  "message": "What is your return policy?",
  "sessionId": "optional-session-id"
}
```

Response

```json
{
  "reply": "You can return items within 30 days...",
  "sessionId": "uuid"
}
```

---

## GET /chat/history/:sessionId

Response

```json
[
  {
    "sender": "USER",
    "text": "What is your return policy?"
  },
  {
    "sender": "AI",
    "text": "You can return items within 30 days..."
  }
]
```

---

# Database Schema

## conversations

| Column    | Type      |
| --------- | --------- |
| id        | UUID      |
| createdAt | Timestamp |
| updatedAt | Timestamp |

## messages

| Column         | Type      |
| -------------- | --------- |
| id             | UUID      |
| conversationId | UUID      |
| sender         | VARCHAR   |
| text           | TEXT      |
| createdAt      | Timestamp |

## knowledge

| Column   | Type    |
| -------- | ------- |
| id       | UUID    |
| category | VARCHAR |
| question | VARCHAR |
| answer   | TEXT    |
| isActive | BOOLEAN |

---

# LLM Design

## Provider

NVIDIA NIM Inference API (OpenAI Compatible)

## Model

Llama 3.1 8B Instruct

## Why NVIDIA?

NVIDIA's Inference API was chosen because it provides a generous free tier while exposing an OpenAI compatible interface.

Switching to GPT-4o, Claude, or another provider requires only changing the base URL and model configuration, not application code.

## Prompting Strategy

The prompt contains:

1. System instructions
2. Store knowledge base
3. Recent conversation history
4. Current user message

The model is instructed to:

* Answer using available store knowledge
* Avoid inventing policies
* Respond naturally to greetings
* Refuse unsupported questions

## Cost Control

Only recent conversation history is included.

Response length is capped through model configuration.

---

# Robustness

| Scenario                  | Behaviour                  |
| ------------------------- | -------------------------- |
| Empty message             | 400 validation error       |
| Message > 2000 characters | 400 validation error       |
| Invalid session ID        | New conversation created   |
| Redis unavailable         | Database fallback          |
| LLM provider failure      | Friendly fallback response |
| Database failure          | Structured error response  |

---

# Trade Offs

## PostgreSQL Over SQLite

PostgreSQL more closely reflects a production environment and integrates cleanly with Render managed services.

## Simplicity Over Premature Abstractions

Repositories are injected directly using TypeORM.

Additional abstraction layers would add complexity without meaningful value at this scale.

## Smaller Model Choice

Llama 3.1 8B was selected because it is free, fast, and sufficient for FAQ style customer support.

The provider abstraction makes upgrading straightforward.

## No Authentication

Authentication was intentionally omitted because it was outside assignment scope.

Session persistence is handled through conversation IDs.

---

# Challenges & How I Solved Them

## LLM Hallucination

Early versions occasionally invented store policies that did not exist in the knowledge base.

This was fixed by strengthening prompt grounding, adding an explicit fallback response for unknown information, and placing a final reminder near the end of the prompt.

Smaller models often weight later instructions more heavily, so prompt placement mattered as much as prompt wording.

## Redis And PostgreSQL Consistency

Conversation history is cached in Redis but persisted in PostgreSQL.

To avoid stale data, messages are always written to PostgreSQL first and only then is the Redis cache invalidated.

The reverse ordering could briefly serve outdated history during concurrent requests.

## Render Deployment Challenges

Running migrations in production required different migration paths for TypeScript and compiled JavaScript files.

The DataSource configuration was updated to load:

```text
src/database/migrations/*.ts
```

during development and:

```text
dist/database/migrations/*.js
```

in production.

This ensured migrations executed correctly on Render.

---

# If I Had More Time

* Streaming responses using WebSockets
* RAG powered semantic search over larger knowledge bases
* Merchant admin panel for managing FAQs
* Multi tenant support with authentication and workspace isolation

---

# Assignment Requirements Coverage

| Requirement                     | Status |
| ------------------------------- | ------ |
| Chat UI                         | ✅      |
| Scrollable conversation history | ✅      |
| User / AI message separation    | ✅      |
| Enter to send                   | ✅      |
| Auto scroll                     | ✅      |
| Loading state                   | ✅      |
| Suggestion chips                | ✅      |
| Health Check                    | ✅      |
| POST /chat/message              | ✅      |
| GET /chat/history/:sessionId    | ✅      |
| Real LLM integration            | ✅      |
| Environment variable secrets    | ✅      |
| Conversation persistence        | ✅      |
| Knowledge base support          | ✅      |
| Database storage                | ✅      |
| Session restore after refresh   | ✅      |
| Input validation                | ✅      |
| Error handling                  | ✅      |
| No hardcoded secrets            | ✅      |

---

# Author

Ashish Raj

GitHub: https://github.com/AshishRajx7
