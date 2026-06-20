# Hermes ImageGen Skill

**Version**: 1.11.0  
**Author**: OWL (for Hermes Agent)  
**License**: MIT  
**Platforms**: macOS, Linux, Windows

A complete skill for generating images via the OpenRouter API through conversational interaction.

---

## What This Skill Does

- **Text-to-image generation** via OpenRouter API
- **Configurable aspect ratios**: 1:1, 9:16, 16:9, 3:4, 2:3
- **Batch generation**: Generate multiple variations of the same prompt
- **Output**: Images saved to `~/Music/output/` (absolute path)

---

## Quick Start

1. **Set your OpenRouter API key** in `~/.hermes/.env`:
   ```
   OPENROUTER_API_KEY=your-api-key-here
   ```

2. **Ask Hermes to generate an image** with a description, model preference, and aspect ratio.

3. **Hermes handles the rest**: API call, base64 decoding, saving, and reporting.

---

## Included Files

| File | Description |
|------|-------------|
| `SKILL.md` | Complete skill documentation and workflow |
| `references/python-api-pattern.py` | Python script template for API calls |
| `references/openrouter-image-api.md` | API reference guide |
| `references/moderation-notes.md` | Content moderation boundary study (7 models, 7+ tests) |
| `references/provider-moderation-matrix.md` | Quick lookup matrix for moderation behavior |
| `references/modality-errors.md` | Troubleshooting guide for modality errors |

---

## Available Models

| Model | Pricing | Notes |
|-------|---------|-------|
| `sourceful/riverflow-v2.5-fast` | ~$0.019/image | Reasoning-based, cheapest per-image option |
| `black-forest-labs/flux.2-klein-4b` | $0.014/MP | Per-megapixel pricing |
| `x-ai/grok-imagine-image-quality` | ~$0.05/image | Allows "sexy lingerie" at age 18/25 |
| `recraft/recraft-v4.1` | $0.04/image | Allows "sexy lingerie" at age 18/25 |
| `bytedance-seed/seedream-4.5` | $0.04/image | Allows "sexy lingerie" at age 18/25, private (no logs) |
| `google/gemini-3.1-flash-image-preview` | Token-based | Cheapest successful option in testing (~$0.0042) |
| `openai/gpt-5-image-mini` | Token-based | Has age-aware + content-aware moderation |

---

## Using with Hermes Agent

Each recipient needs:
1. Their own OpenRouter API key
2. Hermes Agent installed with the skill loaded

Load the skill in Hermes:
```
/imagetime
/skill imagegen
```

Then request image generation with:
- Model preference (e.g., "use gemini-3.1-flash-image-preview")
- Prompt description
- Aspect ratio (e.g., "9:16 portrait")

---

## Key Workflow Rules

- Always confirm with the user before making API calls that cost money
- Read API key directly from `~/.hermes/.env` (don't rely on shell sourcing)
- Use `/api/v1/chat/completions` endpoint (NOT `/api/v1/images/generations`)
- Image-only models: `modalities: ["image"]`
- Text+image models: `modalities: ["image", "text"]`

---

## Moderation Notes

Different providers have different moderation policies:
- Pre-generation blocks (Sourceful, Flux, Recraft, Seedream): Cost $0
- Text refusals (OpenAI): May incur token costs
- Post-generation rejection (Grok): May incur costs, check dashboard

See `references/moderation-notes.md` for detailed testing results.

---

*Prepared 2026-06-20 for educational sharing*