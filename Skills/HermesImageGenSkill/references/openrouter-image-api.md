# OpenRouter Image Generation — API Reference

## Endpoint

```
POST https://openrouter.ai/api/v1/chat/completions
```

> **CRITICAL**: `/api/v1/images/generations` does NOT exist on OpenRouter. All image generation uses the chat completions endpoint.

## Authentication

Read the key directly from `~/.hermes/.env` — do NOT rely on `source` (fails with special chars):

```bash
OPENR_KEY=$(grep OPENROUTER_API_KEY ~/.hermes/.env | tail -1 | cut -d= -f2-)
```

Validate: key must be 20+ chars and the line must NOT start with `#`.

## Request Format

### Image-only models (Sourceful, Flux)

```json
{
  "messages": [{"role": "user", "content": [{"type": "text", "text": "<prompt>"}]}],
  "model": "sourceful/riverflow-v2.5-fast",
  "modalities": ["image"],
  "image_config": {"aspect_ratio": "9:16"}
}

```

### Text+image models (Gemini)

```json
{
  "messages": [{"role": "user", "content": [{"type": "text", "text": "<prompt>"}]}],
  "model": "google/gemini-2.5-flash-image",
  "modalities": ["image", "text"],
  "image_config": {"aspect_ratio": "9:16", "image_size": "1K"}
}
```

## Aspect Ratios

| Ratio | Resolution | Use |
|-------|-----------|-----|
| 1:1 | 1024x1024 | Square (default) |
| 9:16 | 768x1344 | Portrait (lowest cost portrait) |
| 3:4 | 864x1184 | Portrait |
| 16:9 | 1344x768 | Landscape |

## Response Format

Image is a base64 data URL in `choices[0].message.images[0].image_url.url`:

```json
{
  "choices": [{
    "message": {
      "images": [{"image_url": {"url": "data:image/webp;base64,..."}]
    }
  }]
}
```

## Shell Gotchas

1. Never embed JSON in bash curl — double-quote nesting breaks. Use Python execute_code.
2. Never use `${VAR:0:10}` — fails in some shells. Use grep + cut + wc -c.
3. Never pipe curl to interpreter — triggers security gates. Save to temp file first.
4. `source ~/.hermes/.env` can fail — read key directly with grep + cut.

## Available Image Models (June 2026)

| Model | Pricing | Modalities | Notes |
|-------|---------|-----------|-------|
| sourceful/riverflow-v2.5-fast | ~$0.019/img | image-only | Production, reasoning-based |
| google/gemini-2.5-flash-image | $0.0000003/tok | text+image | Cheapest |
| google/gemini-3.1-flash-image-preview | $0.0000005/tok | text+image | Cheap, newer |
| openai/gpt-5-image-mini | $0.0000025/tok | text+image | Mid-range |
| openai/gpt-5-image | $0.00001/tok | text+image | Premium |