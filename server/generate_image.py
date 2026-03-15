"""
Persistent image generation subprocess for KiddoVerse.
Uses SDXL + Lightning LoRA for fast (~2-3s) local image generation on RTX 4060.

Protocol:
  - Prints "READY" to stdout when model is loaded
  - Reads JSON lines from stdin: { "prompt": "...", "negative_prompt": "...", "width": 704, "height": 1344, "output_path": "..." }
  - Prints JSON response to stdout: { "success": true, "path": "...", "time": 2.3 }
"""

import sys
import json
import time
import os
import uuid

# Ensure output is not buffered
os.environ["PYTHONUNBUFFERED"] = "1"

def log(msg):
    print(f"[ImageGen] {msg}", file=sys.stderr, flush=True)

def main():
    log("Loading SDXL Lightning pipeline...")
    
    import torch
    from diffusers import StableDiffusionXLPipeline, EulerDiscreteScheduler
    from safetensors.torch import load_file

    CHECKPOINT = r"D:\fyeshi\project\aivid\Fooocus\models\checkpoints\juggernautXL_v8Rundiffusion.safetensors"
    LORA = r"D:\fyeshi\project\aivid\Fooocus\models\loras\sdxl_lightning_4step_lora.safetensors"
    OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "generated_images")
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Set environment variable to avoid Windows symlink issues during HF hub downloads
    os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"
    os.environ["YACS_WARNINGS"] = "0"

    # Load pipeline from single safetensors file
    pipe = StableDiffusionXLPipeline.from_single_file(
        CHECKPOINT,
        torch_dtype=torch.float16,
        use_safetensors=True,
    ).to("cuda")

    # Use Euler scheduler for Lightning (required for 4-step generation)
    pipe.scheduler = EulerDiscreteScheduler.from_config(
        pipe.scheduler.config,
        timestep_spacing="trailing",
    )

    # Load and fuse Lightning LoRA
    pipe.load_lora_weights(LORA)
    pipe.fuse_lora()

    # Optimization: enable memory-efficient attention
    try:
        pipe.enable_xformers_memory_efficient_attention()
        log("xformers enabled")
    except Exception:
        log("xformers not available, using default attention")

    # Warmup: run a tiny generation to JIT-compile CUDA kernels
    log("Warming up GPU...")
    _ = pipe(
        prompt="test",
        num_inference_steps=1,
        width=64,
        height=64,
        guidance_scale=0.0,
    )
    torch.cuda.synchronize()

    log("Pipeline ready!")
    # Signal to Node.js that we're ready
    print("READY", flush=True)

    # Main loop: read JSON requests from stdin
    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        try:
            request = json.loads(line)
        except json.JSONDecodeError as e:
            print(json.dumps({"success": False, "error": f"Invalid JSON: {e}"}), flush=True)
            continue

        prompt = request.get("prompt", "a cute cat")
        negative_prompt = request.get("negative_prompt", "")
        width = request.get("width", 704)
        height = request.get("height", 1344)
        steps = request.get("steps", 4)
        guidance_scale = request.get("guidance_scale", 0.0)  # Lightning works best with 0
        output_path = request.get("output_path", None)

        if not output_path:
            filename = f"{uuid.uuid4().hex}.png"
            output_path = os.path.join(OUTPUT_DIR, filename)

        log(f"Generating: '{prompt[:60]}...' ({width}x{height}, {steps} steps)")
        start = time.time()

        try:
            with torch.inference_mode():
                image = pipe(
                    prompt=prompt,
                    negative_prompt=negative_prompt,
                    num_inference_steps=steps,
                    width=width,
                    height=height,
                    guidance_scale=guidance_scale,
                ).images[0]

            image.save(output_path, format="PNG")
            elapsed = time.time() - start
            log(f"Done in {elapsed:.1f}s -> {output_path}")

            print(json.dumps({
                "success": True,
                "path": output_path,
                "time": round(elapsed, 2),
            }), flush=True)

        except Exception as e:
            elapsed = time.time() - start
            log(f"Error after {elapsed:.1f}s: {e}")
            print(json.dumps({
                "success": False,
                "error": str(e),
                "time": round(elapsed, 2),
            }), flush=True)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        log("Shutting down.")
    except Exception as e:
        log(f"Fatal error: {e}")
        print(json.dumps({"success": False, "error": f"Fatal: {e}"}), flush=True)
        sys.exit(1)
