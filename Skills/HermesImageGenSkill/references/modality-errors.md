# OpenRouter Image Generation — Modality Error Patterns

**Date captured**: 2026-06-17  
**Session**: Leonardo village landscape with Grok  

## Key Insight

Getting `404 No endpoints found that support the requested output modalities` means you used the **wrong modalities value** for the model, NOT that the model doesn't exist.

## Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `404 "No endpoints found that support the requested output modalities: image, text"` | Model is **image-only** but you sent `modalities: ["image", "text"]` | Change to `modalities: ["image"]` |
| `404 "No endpoints found that support the requested output modalities: text"` | Model is **text+image** but you sent `modalities: ["image"]` | Change to `modalities: ["image", "text"]` |

## Model Classification

**Image-only models (use `modalities: ["image"]`):**
- `sourceful/*` — Riverflow
- `black-forest-labs/flux.*` — Flux
- `recraft/*` — Recraft
- `bytedance-seed/*` — Seedream
- `x-ai/grok-imagine-image-quality` — Grok

**Text+image models (use `modalities: ["image", "text"]`):**
- `google/*` — Gemini Flash Image
- `openai/*` — GPT-5 Image variants

## Detection Approach

When a model fails with 404, check if the error message contains "endpoints found" and "output modalities". If so, try the opposite modalities value rather than switching models.

**Tip**: The python-api-pattern.py auto-detects this by checking if the model string starts with known image-only prefixes.