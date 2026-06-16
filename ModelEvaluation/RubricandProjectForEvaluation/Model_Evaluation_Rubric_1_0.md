# Model Evaluation Rubric - 1.0

**Purpose**: Use this rubric to objectively score and compare different models when building projects via Hermes Agent (or any coding agent).  
Keep this document private — do **not** feed it to the agent.

---

## Evaluation Metadata

| Field              | Value |
|--------------------|-------|
| **Project**        |       |
| **Model Tested**   |       |
| **Context**        |       |
| **Released**       |       |
| **Evaluation Dates** |     |
| **Agent**          |       |
| **Attempt #**      |       |

---

## Scoring Criteria (0–10)

Score each category honestly based on the final output. Use the descriptions as a guide.

| #  | Category                    | Description                                                                 | Score (0-10) | Comments / Evidence |
|----|-----------------------------|-----------------------------------------------------------------------------|--------------|---------------------|
| 1  | **Completeness**            | Did the model implement **all** requested features from the specification? |              |                     |
| 2  | **Correctness / Functionality** | Does the project actually work? (Server runs, endpoints respond correctly, tests pass) |              |                     |
| 3  | **Code Quality & Structure**| Clean architecture, proper separation of concerns, readable code, good naming |              |                     |
| 4  | **Instruction Following**   | Strictly followed the requested tech stack, folder structure, and constraints |              |                     |
| 5  | **Documentation Quality**   | Swagger/OpenAPI quality + README clarity and completeness                  |              |                     |
| 6  | **Testing & Coverage**      | Quality of tests, coverage of critical paths, and ease of running tests    |              |                     |
| 7  | **Agentic Behavior**        | Proactive problem-solving, asked good questions, handled ambiguity well, iterated effectively |              |                     |
| 8  | **Error Handling & Robustness** | Proper error responses, validation, graceful failures                     |              |                     |
| 9  | **Security & Best Practices** | Basic security (hashed passwords, JWT properly used, no obvious vulnerabilities) |              |                     |
| 10 | **Overall Polish**          | How production-ready / professional does the final project feel?           |              |                     |

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

### Would you use this model again for similar projects?
- [ ] Yes — Strong recommendation
- [ ] Maybe — With supervision / iteration
- [ ] No — Too many issues

### Additional Notes
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

1. Let the model build the project using your outline.
2. Spend 10–20 minutes testing the output (run server, test endpoints with different roles, run tests).
3. Fill this rubric honestly.
4. Save the results for comparison across models.
5. Over time, you’ll build a clear picture of which models perform best for agentic coding tasks.

---

**Tip**: You can duplicate this file for each evaluation (e.g., `Evaluation_Nex-N2-Pro_Taskly.md`) to keep a history of model performance.

---

*This rubric is designed to be reused across multiple projects and models.*