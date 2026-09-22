# TestPilot ✈️ – AI-Powered Unit Test Generator for Developers

> **TestPilot** is a developer productivity platform that ingests code functions and automatically synthesizes a complete, production-grade unit test suite—including happy path, edge cases, boundary conditions, and error scenarios—so engineering teams can ship reliable software faster with zero boilerplate.

![TestPilot Application Overview](C:\Users\anish\.gemini\antigravity-ide\brain\7a2e9f1d-2bac-4672-a128-e57ff9848dcd\final_application_state_1790017934818.png)

---

## 🌟 Core Features

### 1. Multi-Language Code Input & Detection
- Interactive **Monaco Editor** with VS Code syntax highlighting, line numbers, and indentation.
- Supported languages: **JavaScript, TypeScript, Python, Java**.
- Real-time **heuristic language & framework auto-detection**.
- Built-in **Presets Library** with 6 real-world functions:
  - *JWT Token Validator & Claims Extractor* (TypeScript)
  - *E-Commerce Cart Total & Coupon Calculator* (JavaScript)
  - *LRU Cache with Capacity Eviction* (JavaScript)
  - *Binary Search with Edge Conditions* (Python)
  - *Sliding Window Rate Limiter* (Python)
  - *Bank Account Transfer Transaction* (Java)

### 2. AI Test Suite Synthesis
- Integrates **Google Gemini API** (`gemini-1.5-flash`, `gemini-2.0-flash`, `gemini-1.5-pro`) and OpenAI API support.
- Zero-config **intelligent fallback AST test generator** that runs 100% out of the box even without external API credentials.
- Rigorous structured output matching target test frameworks:
  - **Jest** & **Vitest**
  - **PyTest** & **unittest**
  - **JUnit 5**
- Deep test taxonomy:
  - **Happy Path** (normal operational values)
  - **Edge Cases** (null, undefined, 0, negative values, empty strings/arrays, NaN)
  - **Boundary Limits** (off-by-one errors, min/max length thresholds)
  - **Error Scenarios** (invalid arguments, thrown exceptions)
  - **Mocking Strategy** (mock external dependencies, timer/system clocks)

### 3. Bugs & Security Vulnerabilities Detector
- Critically audits the input function for unhandled exceptions, loose equality hazards (`==` vs `===`), and missing null-checks.
- Displays severity tags (`HIGH`, `MEDIUM`, `LOW`) with detailed diagnostic rationale and actionable patch suggestions.

### 4. In-Browser Sandboxed Live Test Runner
- Safely executes the generated unit test assertions against the user's function code in a sandbox.
- Reports real-time **Pass/Fail statuses**, execution duration in milliseconds, assertion differences, and console logs.

### 5. Test History & Management
- Automatically saves every generation to MongoDB (or persistent local JSON database fallback).
- Filter by language, search by function name or keywords, and star favorites.
- One-click restore to reload any past generation directly into the Monaco Editor.

### 6. Usage & Impact Analytics Dashboard
- Metrics on total test suites generated, total assertion cases synthesized, and potential production bugs caught.
- Estimates developer hours saved (~45 minutes per comprehensive test suite).
- Visual distribution breakdowns by programming language and test framework.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS | High-performance SPA with cyber-pilot glassmorphism dark aesthetic |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) | VS Code code editing experience |
| **Icons & Effects** | Lucide React, Canvas Confetti | Modern UI icons and celebratory completion animations |
| **Backend** | Node.js, Express | RESTful API service |
| **Database** | MongoDB Atlas / Local JSON DB | Dual-mode persistence layer with zero-crash fallback |
| **AI Integration** | Google Generative AI (`@google/generative-ai`) | Structured JSON prompts with schema enforcement |
| **Auth & Security** | JWT + bcryptjs, express-rate-limit | Secure sessions and per-user hourly rate limiting |
| **Test Runner** | Node.js Sandboxed VM (`vm`) | Isolated execution environment for real test verification |

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

Clone the repository and install all dependencies:

```bash
git clone https://github.com/your-username/TestPilot.git
cd TestPilot

# Install root, backend, and frontend packages with one command:
npm run install-all
```

### Running Locally

Start both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend Client**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Environment Configuration

In `server/.env` (or via the frontend **API Key** settings modal):

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_here

# Optional: MongoDB connection string (falls back to local storage if omitted)
MONGODB_URI=

# Optional: Google Gemini API Key (free from https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=
```

> **Note**: If `GEMINI_API_KEY` is not provided, TestPilot operates in **Zero-Config Demo Mode** using its built-in AST synthesizer, so you can test all features immediately.

---

## 💼 Interview Talking Points

### For SDE Roles
- **Dual-Mode Resilient Database Layer**: Designed an abstraction layer in `server/src/config/db.js` that connects to MongoDB Atlas in production while automatically falling back to an ACID-compliant local persistent store in development, eliminating database startup friction.
- **Isolated Execution Sandbox**: Built a sandboxed runner in `server/src/controllers/runController.js` using Node's `vm` module with custom assertion mock factories (`describe`, `test`, `expect`) to run test assertions safely and measure runtime duration.
- **API Protection & Quotas**: Implemented token-bucket rate limiting (20 generations/hour per user or IP) and payload size sanitization (max 25,000 characters) to protect downstream AI providers from abuse.

### For Generative AI Roles
- **Strict Structured JSON Schema**: Eliminated AI markdown formatting inconsistencies by enforcing Gemini's `responseMimeType: 'application/json'` paired with an exhaustive system prompt defining exact test taxonomy, boundary conditions, and severity ratings.
- **Defensive Hallucination Guard**: Built an AST verification pipeline in `server/src/services/codeValidator.js` that checks for declared function names, ensures assertions are present, and validates syntax before persisting or rendering.
- **Cost & Latency Optimization**: Defaulted to `gemini-1.5-flash` for sub-second generation latency, reserving `gemini-1.5-pro` for complex multi-class enterprise architectures.

---

## 📄 License
MIT © 2026 TestPilot Team
