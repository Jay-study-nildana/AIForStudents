# Model Evaluation Rubric - 1.0

1. **Model**: Nex AGI: Nex-N2-Pro (free)
2. **URL**: https://openrouter.ai/nex-agi/Nex-N2-Pro:free

---

## Evaluation Metadata

| Field                | Value                                      |
|----------------------|--------------------------------------------|
| **Project**          | Nex AGI: Nex-N2-Pro (free)                 |
| **Model Tested**     | Nex AGI: Nex-N2-Pro (free)                 |
| **Context**          | 262K                                       |
| **Released**         | June 8, 2026                               |
| **Evaluation Dates** | June 10th 2026 to June 16th 2026           |
| **Agent**            | Hermes Agent v0.16.0 (2026.6.5)            |
| **Attempt #**        | 1                                          |

---

## Scoring Criteria (0–10)

**Project**: Taskly_API_Project_Outline_1_0.md  
Score each category honestly based on the final output. Use the descriptions as a guide.

| #  | Category                      | Description                                                                 | Score (0-10) | Comments / Evidence                          |
|----|-------------------------------|-----------------------------------------------------------------------------|--------------|----------------------------------------------|
| 1  | **Completeness**              | Did the model implement **all** requested features from the specification?   | 10           | N/A                                          |
| 2  | **Correctness / Functionality** | Does the project actually work? (Server runs, endpoints respond correctly, tests pass) | 10     | N/A                                          |
| 3  | **Code Quality & Structure**  | Clean architecture, proper separation of concerns, readable code, good naming | 10         | N/A                                          |
| 4  | **Instruction Following**     | Strictly followed the requested tech stack, folder structure, and constraints | 10       | N/A                                          |
| 5  | **Documentation Quality**     | Swagger/OpenAPI quality + README clarity and completeness                   | 10           | N/A                                          |
| 6  | **Testing & Coverage**        | Quality of tests, coverage of critical paths, and ease of running tests     | 10           | N/A                                          |
| 7  | **Agentic Behavior**          | Proactive problem-solving, asked good questions, handled ambiguity well, iterated effectively | 8 | It kept running out of context and had to do compression, twice. |
| 8  | **Error Handling & Robustness** | Proper error responses, validation, graceful failures                      | 10           | N/A                                          |
| 9  | **Security & Best Practices** | Basic security (hashed passwords, JWT properly used, no obvious vulnerabilities) | 10     | N/A                                          |
| 10 | **Overall Polish**            | How production-ready / professional does the final project feel?            | 10           | N/A                                          |

**Total Score** = `98 / 100` (Maximum 100)  
**Final Score**: 98/100

---

## Qualitative Assessment

### What worked well?

- The project **Taskly_API_Project_Outline_1_0** was built as expected.
- Model was able to work with Hermes just fine. No surprises.
- Memory management worked well. The project was built over many days and multiple sessions. The usual Hermes memory system and my own 'tracker' markdown document ensured work happened without any problems across multiple sessions, despite the small context.
- There was no lag or latency issues. Responses were super fast.

### What was missing or weak?

- The context is small. I ran into the following situation twice:  
  > "Preflight compression: ~133,188 tokens >= 131,072 threshold. This may take a moment."
- In the later parts of the project development, the time between compaction actions increased. Total of 2 compact events.
- I was weak in documentation. In the excitement of doing this, I did not make detailed notes. I will maintain more accurate data next time.
- Need to integrate more standardized tests and mix them with my own additions.
- Occasionally it would create files in the wrong folder, but then realize it and try to correct it. Most of the time it would correct on its own, but I manually deleted a few files.

### Major issues encountered

- The context compression events mentioned above.

### Would you use this model again for similar projects?

- [X] **Yes** — Strong recommendation
- [ ] Maybe — With supervision / iteration
- [ ] No — Too many issues

### Additional Notes

```
This was my first evaluation, although, I have been informally tested out many models via OpenRouter and other provides (Grok, OpenAI, Claude) for some time now. I am hoping that as I keep doing more of this, I will improve so will my evaluation knowlege.

Also, the project that is being used, is very simple. So, I will probably have to add another project outline, that is slightly larger and more complex, because the current one, is clearly too easy for the model, especially since it only has 262K context.
```

