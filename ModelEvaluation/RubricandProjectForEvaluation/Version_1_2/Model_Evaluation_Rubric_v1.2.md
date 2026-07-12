# Model Evaluation Rubric - 1.2 

**Purpose**: Evaluate AI models across two independent axes:  
1. **Technical Capability** — how well the model builds software  
2. **Personality & Cognitive Profile** — how it behaves as an intelligence  

Use this combined rubric to compare models holistically while avoiding duplication.

> **Keep this document private** — do **not** feed it to the agent.

---

# 1. Evaluation Metadata

| Field              | Value                          |
|--------------------|--------------------------------|
| **Project**        |                                |
| **Model Tested**   |                                |
| **Date**           |                                |
| **Hermes Version** |                                |
| **Attempt #**      | 1 / 2 / 3                      |
| **Project Type**   | Backend / Frontend / Fullstack |
| **Interaction Context** | Coding / Creative / General |

---

# 2. Technical Evaluation (0–10)

Score each category honestly based on the final output.

| # | Category                        | Description                                                                 | Score (0–10) | Comments / Evidence |
|---|---------------------------------|-----------------------------------------------------------------------------|--------------|---------------------|
| 1 | **Completeness**                | Implemented **all** requested features from the specification               |              |                     |
| 2 | **Correctness / Functionality** | Project runs correctly; endpoints/pages behave as expected; tests pass      |              |                     |
| 3 | **Code Quality & Structure**    | Clean architecture, separation of concerns, readable, consistent            |              |                     |
| 4 | **Instruction Following**       | Followed tech stack, folder structure, constraints, mandatory requirements  |              |                     |
| 5 | **Documentation Quality**       | README clarity, setup steps, Swagger/docs, component docs                   |              |                     |
| 6 | **Testing & Coverage**          | Quality of tests, coverage of critical paths, ease of running tests         |              |                     |
| 7 | **Agentic Behavior**            | Proactive problem‑solving, clarifying questions, ambiguity handling         |              |                     |
| 8 | **Error Handling & Robustness** | Input validation, graceful failures, loading states (frontend)              |              |                     |
| 9 | **Security & Best Practices**   | Secure auth, safe token storage, protected routes, no obvious vulnerabilities |            |                     |
|10 | **Overall Polish & UX**         | Production‑readiness, responsiveness, API consistency, role‑based behavior  |              |                     |

**Technical Score** = `SUM / 10`  
**Final Technical Score**: ______ / 100

---

# 3. Personality & Cognitive Profile (0–10)

Score each category based on observed behavior during interaction.

| # | Category                           | Description                                                                 | Score (0–10) | Comments / Evidence |
|---|------------------------------------|-----------------------------------------------------------------------------|--------------|---------------------|
| 1 | **Communication Style**            | Tone, clarity, warmth, coherence, conversational flow                       |              |                     |
| 2 | **Creativity & Divergence**        | Novel ideas, metaphors, alternatives, variations                            |              |                     |
| 3 | **Confidence Calibration**         | Avoids overconfidence; admits uncertainty appropriately                     |              |                     |
| 4 | **Emotional Intelligence**         | Sensitivity to tone, empathy, nuance, contextual awareness                  |              |                     |
| 5 | **Instruction Interpretation**     | Ability to infer intent beyond literal instructions                         |              |                     |
| 6 | **Ambiguity Handling**             | Grace under unclear prompts; asks clarifying questions                      |              |                     |
| 7 | **Agentic Identity**               | Initiative, proactiveness, self‑directed reasoning                          |              |                     |
| 8 | **Cognitive Style**                | Linear vs associative, concise vs verbose, literal vs abstract              |              |                     |
| 9 | **Failure Mode Personality**       | Behavior when wrong: graceful, stubborn, evasive, chaotic                   |              |                     |
|10 | **Overall Interaction Experience** | How it *feels* to collaborate with this model                               |              |                     |

**Personality Score** = `SUM / 10`  
**Final Personality Score**: ______ / 100

---

# 4. Qualitative Assessment — Technical

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

---

# 5. Qualitative Assessment — Personality

### What stood out?
-
-
-

### Cognitive Strengths
-
-
-

### Cognitive Weaknesses
-
-
-

### Distinctive Behavioral Traits
-
-
-

### Failure Mode Notes
-
-
-

### Would you enjoy working with this model again?
- [ ] **Yes** — Pleasant and effective  
- [ ] **Maybe** — Useful but inconsistent  
- [ ] **No** — Draining or unreliable  

---

# 6. Summary Dashboard

| Axis          | Score (/100) | Notes |
|---------------|--------------|-------|
| **Technical** |              |       |
| **Personality** |            |       |
| **Combined Impression** |   |       |

---

# 7. Optional Metrics

1. Estimated tokens consumed  
2. Time taken from start to finish  
3. Estimated cost (if paid model)  
4. Additional notes  

---

# 8. How to Use This Unified Rubric

1. Let the model build the project using your specification.  
2. Evaluate the **Technical** section by running and testing the output.  
3. Evaluate the **Personality** section based on your interaction experience.  
4. Save each evaluation as a separate file (e.g., `Eval_Qwen2.5-Coder_Taskly_Frontend.md`).  
5. Over time, build a two‑axis profile of each model’s strengths and weaknesses.  

---

*This unified rubric keeps Technical and Personality evaluations independent while giving you a single, clean document for long‑term model comparison.*
