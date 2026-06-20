# Provider Moderation Matrix — OpenRouter Image Generation

**Scope**: Concise matrix for image-generation moderation behavior observed in the ImageGen workflow.

## Age 18 + "sexy lingerie"

| Provider | Model | Result | Timing / Behavior | Cost |
|---|---|---:|---|---:|
| Sourceful | `sourceful/riverflow-v2.5-fast` | Blocked | Pre-generation 422, generic error | $0 |
| Black Forest Labs | `black-forest-labs/flux.2-klein-4b` | Blocked | Pre-generation 400, "Sexual Content" | $0 |
| xAI | `x-ai/grok-imagine-image-quality` | Allowed | Image generated | $0.05 |
| Recraft | `recraft/recraft-v4.1` | Allowed | Image generated | $0.04 |
| ByteDance Seed | `bytedance-seed/seedream-4.5` | Allowed | Image generated | $0.04 |
| OpenAI | `openai/gpt-5-image-mini` | Refused | Text refusal: under-21 sexualization | Token cost possible |
| Google | `google/gemini-3.1-flash-image-preview` | Allowed | Image generated | ~$0.0042 in test |

## Age 25 + "sexy lingerie"

| Provider | Model | Result | Notes |
|---|---|---:|---|
| xAI | `x-ai/grok-imagine-image-quality` | Allowed | Confirmed age change does not affect Grok for this prompt |
| Recraft | `recraft/recraft-v4.1` | Allowed | Confirmed age change does not affect Recraft for this prompt |
| ByteDance Seed | `bytedance-seed/seedream-4.5` | Allowed | Confirmed age change does not affect Seedream for this prompt |
| Google | `google/gemini-3.1-flash-image-preview` | Allowed | Cheapest successful option in testing |
| OpenAI | `openai/gpt-5-image-mini` | Refused | Still refused due to "sexualized clothing" |

## "nude"

| Provider | Model | Result | Timing / Behavior |
|---|---|---:|---|
| xAI | `x-ai/grok-imagine-image-quality` | Blocked | Post-generation rejection suspected; usage ticks present |
| Recraft | `recraft/recraft-v4.1` | Blocked | Pre-generation 400, `prompt_is_improper` |
| ByteDance Seed | `bytedance-seed/seedream-4.5` | Blocked | Pre-generation 400, `InputTextSensitiveContentDetected` |

## Durable lessons

- Moderation is provider-specific, not OpenRouter-wide.
- Age changes can matter for OpenAI, but do not make all sexualized clothing acceptable.
- "Sexy lingerie" is allowed by some providers and blocked/refused by others.
- "Nude" is a universal boundary across tested providers.
- Ethnicity descriptors did not trigger moderation; clothing terms did.
- Always check the response for an `images` array: HTTP 200 without images means text refusal, not success.
- Always check usage/cost after moderation events, especially post-generation rejections.