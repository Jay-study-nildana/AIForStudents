# Model Evaluation Rubric - 1.1
**Purpose**: Use this rubric to objectively score and compare different models when building projects via Hermes Agent (or any coding agent).  
This version is updated to work for both **Backend** and **Frontend** projects.

> **Keep this document private** — do **not** feed it to the agent.

---

## Evaluation Metadata

| Field              | Value                          |
|--------------------|--------------------------------|
| **Project**        |                                |
| **Model Tested**   |                                |
| **Date**           |                                |
| **Hermes Version** |                                |
| **Attempt #**      | 1 / 2 / 3                      |
| **Project Type**   | Backend / Frontend / Fullstack |

---

## Scoring Criteria (0–10)

Score each category honestly based on the final output. Use the descriptions as a guide.

| # | Category                        | Description                                                                 | Score (0-10) | Comments / Evidence |
|---|---------------------------------|-----------------------------------------------------------------------------|--------------|---------------------|
| 1 | **Completeness**                | Did the model implement **all** requested features from the specification? |              |                     |
| 2 | **Correctness / Functionality** | Does the project actually work? (Backend: server runs + endpoints correct. Frontend: app runs + features behave as expected. Tests pass.) |              |                     |
| 3 | **Code Quality & Structure**    | Clean architecture, proper separation of concerns, readable code, good naming conventions, consistent style |              |                     |
| 4 | **Instruction Following**       | Strictly followed the requested tech stack, folder structure, constraints, and mandatory requirements |              |                     |
| 5 | **Documentation Quality**       | README clarity, completeness, setup instructions, and any generated documentation (Swagger for backend / component docs for frontend) |              |                     |
| 6 | **Testing & Coverage**          | Quality and coverage of tests. Ease of running tests. Coverage of critical paths (including E2E where required). |              |                     |
| 7 | **Agentic Behavior**            | Proactive problem-solving, asked good clarifying questions, handled ambiguity well, iterated effectively when needed |              |                     |
| 8 | **Error Handling & Robustness** | Proper error responses/messages, input validation, graceful failure handling, loading states (frontend) |              |                     |
| 9 | **Security & Best Practices**   | Backend: Secure auth (hashed passwords, JWT handling). Frontend: Safe token storage, protected routes, no obvious client-side vulnerabilities. General best practices followed. |              |                     |
|10 | **Overall Polish & UX**         | How production-ready and professional does the project feel? (Backend: API consistency. Frontend: Responsiveness, usability, role-based UI behavior) |              |                     |

**Total Score** = `SUM of scores / 10` (Maximum 100)  
**Final Score**: ______ / 100

---

## Qualitative Assessment

### What worked well?
-
-
-

### What was missing or weak?
-
-
-

### Major issues encountered
-
-
-

### Would you use this model again for similar projects?
- [ ] **Yes** — Strong recommendation
- [ ] **Maybe** — With supervision / iteration
- [ ] **No** — Too many issues

### Additional Notes

1. (Optional) estimated tokens consumed?
1. (Optional) Time taken from start to finish?
1. (Optional) (Estimated cost in USD, if using a paid model) 
1. Anything else. 
```
```

---

## Quick Rating Guide

| Score | Meaning                                      |
|-------|----------------------------------------------|
| 9–10  | Excellent — Near production quality          |
| 7–8   | Good — Solid with minor issues               |
| 5–6   | Average — Works but needs significant fixes  |
| 3–4   | Poor — Major gaps or broken functionality    |
| 0–2   | Failed — Did not meet basic requirements     |

---

## How to Use This Rubric

1. Let the model build the project using your specification.
2. Spend 15–30 minutes testing the output:
   - **Backend**: Run server, test endpoints with different roles, run tests + coverage.
   - **Frontend**: Run the app, test all major pages and flows (especially role-based behavior), run unit + E2E tests.
3. Fill this rubric honestly.
4. Save the results for comparison across models (e.g., `Evaluation_Nex-N2-Pro_Taskly_Frontend.md`).
5. Over time, you’ll build a clear picture of which models perform best for agentic coding tasks.

---

**Tip**: Duplicate this file for each evaluation to maintain a history of model performance across different projects and project types (Backend vs Frontend).

---

*This rubric is designed to be reused across multiple projects and models (Backend, Frontend, or Fullstack).*