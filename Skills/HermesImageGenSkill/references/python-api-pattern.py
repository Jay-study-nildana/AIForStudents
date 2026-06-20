#!/usr/bin/env python3
"""
OpenRouter Image Generation API Pattern
=========================================

Copy-paste this template into execute_code for making image generation API calls.
Avoids shell quoting issues with curl + complex JSON payloads.

usage:
  1. Set PROMPT, MODEL, ASPECT_RATIO, and PRICING variables
  2. Run via execute_code
  3. Image is saved to ~/Music/output/

Requirements:
  - Python 3.6+
  - OPENROUTER_API_KEY set in ~/.hermes/.env
"""

import json
import base64
import os
import subprocess
from datetime import datetime
import urllib.request
import urllib.error

# ============================================================
# CONFIGURATION — modify these for each generation
# ============================================================
PROMPT = "Your image prompt here"
MODEL = "sourceful/riverflow-v2.5-fast"  # e.g. google/gemini-3.1-flash-image-preview
ASPECT_RATIO = "9:16"  # 9:16 portrait, 1:1 square, 16:9 landscape
OUTPUT_DIR = "~/Music/output"  # absolute path to Music folder output directory

# Optional: token pricing for cost estimate. Set to None for per-image pricing.
INPUT_PRICE_PER_M = 0.00
OUTPUT_PRICE_PER_M = 0.00

# ============================================================
# API KEY — read from env file
# ============================================================
env_path = os.path.expanduser("~/.hermes/.env")
result = subprocess.run(["grep", "OPENROUTER_API_KEY", env_path], capture_output=True, text=True)
key_line = result.stdout.strip().split("\n")[-1]
key = key_line.split("=", 1)[1]

if len(key) < 20:
    print(f"ERROR: API key seems invalid (length: {len(key)}). Check ~/.hermes/.env")
    exit(1)

# ============================================================
# BUILD REQUEST
# ============================================================
# Image-only models: modalities ["image"]
# Text+image models: modalities ["image", "text"]
IMAGE_ONLY_PREFIXES = (
    "sourceful/",
    "black-forest-labs/flux.",
    "recraft/",
    "bytedance-seed/",
    "x-ai/grok-imagine-image-quality",
)
is_image_only = MODEL.startswith(IMAGE_ONLY_PREFIXES)
modalities = ["image"] if is_image_only else ["image", "text"]

payload = {
    "messages": [
        {
            "role": "user",
            "content": PROMPT,
        }
    ],
    "model": MODEL,
    "modalities": modalities,
    "image_config": {
        "aspect_ratio": ASPECT_RATIO,
    },
}

# For text+image models, also set image_size.
if not is_image_only:
    payload["image_config"]["image_size"] = "1K"

# ============================================================
# MAKE API CALL
# ============================================================
req = urllib.request.Request(
    "https://openrouter.ai/api/v1/chat/completions",
    data=json.dumps(payload).encode("utf-8"),
    headers={
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    },
    method="POST",
)

try:
    with urllib.request.urlopen(req, timeout=120) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    # Check for errors
    if "error" in data:
        error = data["error"]
        print(f"ERROR: HTTP {error.get('code', 'unknown')}")
        print(f"Message: {error.get('message', 'unknown')}")
        if "metadata" in error:
            meta = error["metadata"]
            print(f"Provider: {meta.get('provider_name', 'unknown')}")
            raw = meta.get("raw", "")
            if raw:
                print(f"Raw: {raw}")
        exit(1)

    # Extract image
    choices = data.get("choices", [])
    if not choices:
        print("ERROR: No choices in response")
        print(json.dumps(data, indent=2)[:1000])
        exit(1)

    message = choices[0].get("message", {})
    images = message.get("images", [])
    content = message.get("content", "")

    # Handle text refusals / explanations (e.g. GPT-5 Image Mini)
    if not images:
        print("No image returned — model may have refused or returned text only.")
        if content:
            print(f"Text response: {content[:1000]}")
        else:
            print(json.dumps(data, indent=2)[:1000])
        exit(1)

    img_url = images[0].get("image_url", {}).get("url", "")
    if not img_url.startswith("data:image/"):
        print(f"ERROR: Unexpected image format: {img_url[:100]}")
        exit(1)

    # Decode and save
    b64_data = img_url.split(",", 1)[1]
    img_bytes = base64.b64decode(b64_data)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    model_slug = MODEL.replace("/", "_")
    filename = f"{timestamp}_{model_slug}.png"
    output_dir_expanded = os.path.expanduser(OUTPUT_DIR)
    os.makedirs(output_dir_expanded, exist_ok=True)
    filepath = os.path.join(output_dir_expanded, filename)

    with open(filepath, "wb") as f:
        f.write(img_bytes)

    print("SUCCESS")
    print(f"Image saved: {filepath}")
    print(f"Image size: {len(img_bytes)} bytes")
    print(f"Filename: {filename}")

    # Report usage and estimated cost when available
    usage = data.get("usage", {})
    if usage:
        prompt_tokens = usage.get("prompt_tokens", 0)
        completion_tokens = usage.get("completion_tokens", 0)
        total_tokens = usage.get("total_tokens", 0)
        print(f"Usage: prompt_tokens={prompt_tokens}, completion_tokens={completion_tokens}, total_tokens={total_tokens}")
        if INPUT_PRICE_PER_M and OUTPUT_PRICE_PER_M:
            input_cost = (prompt_tokens / 1_000_000) * INPUT_PRICE_PER_M
            output_cost = (completion_tokens / 1_000_000) * OUTPUT_PRICE_PER_M
            total_cost = input_cost + output_cost
            print(f"Estimated cost: input=${input_cost:.6f}, output=${output_cost:.6f}, total=${total_cost:.6f}")

except urllib.error.HTTPError as e:
    error_body = e.read().decode("utf-8")
    print(f"HTTP_ERROR_{e.code}")
    print(error_body[:2000])
except Exception as e:
    print(f"ERROR: {e}")