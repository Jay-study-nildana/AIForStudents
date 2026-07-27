# Model Evaluation Rubric - 1.2 

1. **Model**: Cohere: North Mini Code (free)
2. **URL**: https://openrouter.ai/cohere/north-mini-code:free

**Purpose**: Evaluate AI models across two independent axes:  
1. **Technical Capability** — how well the model builds software  
2. **Personality & Cognitive Profile** — how it behaves as an intelligence  

Use this combined rubric to compare models holistically while avoiding duplication.

> **Keep this document private** — do **not** feed it to the agent.

---

# 1. Evaluation Metadata

| Field              | Value                          |
|--------------------|--------------------------------|
| **Project**        | Cohere: North Mini Code (free)                               |
| **Model Tested**   | Cohere: North Mini Code (free)                               |
| **Context**          | 256K                                       |
| **Released**         | Jun 18, 2026                   |
| **Evaluation Dates** | June last week to July 1st week           |
| **Agent**            | Hermes Agent v0.16.0 (2026.6.5)            |
| **Attempt #**        | 1                                          |

Note: Sadly, the model was terrrible at working with dates, so, I don't have the exact dates as the tracker failed to work. more details below.
---

# 2. Technical Evaluation (0–10)

Score each category honestly based on the final output.

| # | Category                        | Description                                                                 | Score (0–10) | Comments / Evidence |
|---|---------------------------------|-----------------------------------------------------------------------------|--------------|---------------------|
| 1 | **Completeness**                | Implemented **all** requested features from the specification               |         1     |  Terrible At Everything                   |
| 2 | **Correctness / Functionality** | Project runs correctly; endpoints/pages behave as expected; tests pass      |         1     |  Terrible At Everything                   |
| 3 | **Code Quality & Structure**    | Clean architecture, separation of concerns, readable, consistent            |         1     |  Terrible At Everything                   |
| 4 | **Instruction Following**       | Followed tech stack, folder structure, constraints, mandatory requirements  |         1     |  Terrible At Everything                   |
| 5 | **Documentation Quality**       | README clarity, setup steps, Swagger/docs, component docs                   |         1     |  Terrible At Everything                   |
| 6 | **Testing & Coverage**          | Quality of tests, coverage of critical paths, ease of running tests         |         1     |  Terrible At Everything                   |
| 7 | **Agentic Behavior**            | Proactive problem‑solving, clarifying questions, ambiguity handling         |         1     |  Terrible At Everything                   |
| 8 | **Error Handling & Robustness** | Input validation, graceful failures, loading states (frontend)              |         1     |  Terrible At Everything                   |
| 9 | **Security & Best Practices**   | Secure auth, safe token storage, protected routes, no obvious vulnerabilities |         1     |  Terrible At Everything                   |
|10 | **Overall Polish & UX**         | Production‑readiness, responsiveness, API consistency, role‑based behavior  |         1     |  Terrible At Everything                   |

**Technical Score** = `SUM / 10`  
**Final Technical Score**: 10 / 100

Note: This is by far one of the worst models I have ever used in my current hobby as a model evaluator. There is a folder called Observations, which contains detailed notes of all the things that went wrong with this.

---

# 3. Personality & Cognitive Profile (0–10)

Score each category based on observed behavior during interaction.

| # | Category                           | Description                                                                 | Score (0–10) | Comments / Evidence |
|---|------------------------------------|-----------------------------------------------------------------------------|--------------|---------------------|
| 1 | **Communication Style**            | Tone, clarity, warmth, coherence, conversational flow                       |         1     |  Terrible At Everything                   |
| 2 | **Creativity & Divergence**        | Novel ideas, metaphors, alternatives, variations                            |         1     |  Terrible At Everything                   |
| 3 | **Confidence Calibration**         | Avoids overconfidence; admits uncertainty appropriately                     |         1     |  Terrible At Everything                   |
| 4 | **Emotional Intelligence**         | Sensitivity to tone, empathy, nuance, contextual awareness                  |         1     |  Terrible At Everything                   |
| 5 | **Instruction Interpretation**     | Ability to infer intent beyond literal instructions                         |         1     |  Terrible At Everything                   |
| 6 | **Ambiguity Handling**             | Grace under unclear prompts; asks clarifying questions                      |         1     |  Terrible At Everything                   |
| 7 | **Agentic Identity**               | Initiative, proactiveness, self‑directed reasoning                          |         1     |  Terrible At Everything                   |
| 8 | **Cognitive Style**                | Linear vs associative, concise vs verbose, literal vs abstract              |         1     |  Terrible At Everything                   |
| 9 | **Failure Mode Personality**       | Behavior when wrong: graceful, stubborn, evasive, chaotic                   |         1     |  Terrible At Everything                   |
|10 | **Overall Interaction Experience** | How it *feels* to collaborate with this model                               |         1     |  Terrible At Everything                   |

**Personality Score** = `SUM / 10`  
**Final Personality Score**: 10 / 100

Note: Since we are talking about personality here, I must add, the confidence, well, over confidence with which this model lies. It will do something absolutely wrong, like log the wrong date and time, and confidently tell me that the log has the correct time. It's like a kid who refuses to accept he is wrong.

---

# 4. Qualitative Assessment — Technical

### What worked well?
- The model simply does not work. It's useless.

### What was missing or weak?
- Everything. It's like, it cannot do anything. 
- It makese mistakes.
- Hallucinates a lot

### Major issues encountered
- It cannot do anything right. It cannot even tell time and date to do basic logging.
- Just look at the accompanying folder called 'Observations'
- Absolutely the bottom of the models I have used

### Would you use this model again for similar projects?
- [ ] **Yes** — Strong recommendation  
- [ ] **Maybe** — With supervision / iteration  
- [x] **No** — Too many issues  

---

# 5. Qualitative Assessment — Personality

### What stood out?
- How bad this model is.

### Cognitive Strengths
- None

### Cognitive Weaknesses
- It cannot seem to think at all. 
- Cannot even tell date and time.
- False Overconfidence. Lies a lot!

### Distinctive Behavioral Traits
- Over Confident about doing terrible things.
- Again, cannot even tell time and date.
- Cannot remember context. 

### Failure Mode Notes
- Just fails from the word go. It's just bad.
- Check the folder called "Observations"
- Just awful. 

### Would you enjoy working with this model again?
- [ ] **Yes** — Pleasant and effective  
- [ ] **Maybe** — Useful but inconsistent  
- [x] **No** — Draining or unreliable  

---

# 6. Summary Dashboard

| Axis          | Score (/100) | Notes |
|---------------|--------------|-------|
| **Technical** |      10/100        | Absolutely Terrible      |
| **Personality** |     10/100       | Just awful      |
| **Combined Impression** |   20/200|  One of the worst performing model I have ever used     |

---

# 7. Optional Metrics

1. Estimated tokens consumed  : 12M
2. Time taken from start to finish : It never finished. After multiple false starts, I just gave up. 
3. Estimated cost (if paid model)  : Free Model.
4. Additional notes : One of the worst models I have used. Please check the accompanying folder called Observations for more details. It's overconfident at lying. It's lies so much. It cannot even log a work tracker and cannot even tell time and date. Very Bad Model. 

---

# 8. How to Use This Unified Rubric

1. Let the model build the project using your specification.  
2. Evaluate the **Technical** section by running and testing the output.  
3. Evaluate the **Personality** section based on your interaction experience.  
4. Save each evaluation as a separate file (e.g., `Eval_Qwen2.5-Coder_Taskly_Frontend.md`).  
5. Over time, build a two‑axis profile of each model’s strengths and weaknesses.  

---

*This unified rubric keeps Technical and Personality evaluations independent while giving you a single, clean document for long‑term model comparison.*
