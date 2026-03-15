
const payload = {
  fn_index: 67,
  data: [
    false, // 0: Generate Image Grid
    "a friendly robot in a sunny garden", // 1: parameter_12 (Prompt)
    "nsfw, low quality", // 2: Negative Prompt
    ["Fooocus V2"], // 3: Selected Styles
    "Lightning", // 4: Performance
    "704*1344", // 5: Aspect Ratios
    1, // 6: Image Number
    "png", // 7: Output Format
    -1, // 8: Seed
    true, // 9: Read wildcards
    2, // 10: Image Sharpness
    1, // 11: Guidance Scale
    "juggernautXL_v8Rundiffusion.safetensors", // 12: Base Model
    "None", // 13: Refiner
    0.5, // 14: Refiner Switch At
    true, // 15: Enable LoRA 1
    "sdxl_lightning_4step_lora.safetensors", // 16: LoRA 1
    1, // 17: Weight
    false, // 18: Enable LoRA 2
    "None", // 19: LoRA 2
    1, // 20: Weight
    false, // 21: Enable LoRA 3
    "None", // 22: LoRA 3
    1, // 23: Weight
    false, // 24: Enable LoRA 4
    "None", // 25: LoRA 4
    1, // 26: Weight
    false, // 27: Enable LoRA 5
    "None", // 28: LoRA 5
    1, // 29: Weight
    false, // 30: Input Image
    "Howdy!", // 31: parameter_212
    "Disabled", // 32: Upscale or Variation
    null, // 33: Image
    [], // 34: Outpaint Direction
    null, // 35: Image
    "", // 36: Inpaint Additional Prompt
    null, // 37: Mask Upload
    false, // 38: Disable Preview
    true, // 39: Disable Intermediate Results
    false, // 40: Disable seed increment
    false, // 41: Black Out NSFW
    1.15, // 42: Positive ADM Guidance Scaler
    0.85, // 43: Negative ADM Guidance Scaler
    0, // 44: ADM Guidance End At Step
    7, // 45: CFG Mimicking from TSNR
    1, // 46: CLIP Skip
    "dpmpp_sde", // 47: Sampler
    "karras", // 48: Scheduler
    "Default (model)", // 49: VAE
    4, // 50: Forced Overwrite of Sampling Step
    -1, // 51: Forced Overwrite of Refiner Switch Step
    -1, // 52: Forced Overwrite of Generating Width
    -1, // 53: Forced Overwrite of Generating Height
    -1, // 54: Forced Overwrite of Denoising Strength of "Vary"
    -1, // 55: Forced Overwrite of Denoising Strength of "Upscale"
    false, // 56: Mixing Image Prompt and Vary/Upscale
    false, // 57: Mixing Image Prompt and Inpaint
    false, // 58: Debug Preprocessors
    false, // 59: Skip Preprocessors
    64, // 60: Canny Low Threshold
    128, // 61: Canny High Threshold
    "joint", // 62: Refiner swap method
    0.25, // 63: Softness of ControlNet
    false, // 64: Enabled (FreeU)
    1.01, // 65: B1
    1.02, // 66: B2
    0.99, // 67: S1
    0.95, // 68: S2
    false, // 69: Debug Inpaint Preprocessing
    false, // 70: Disable initial latent in inpaint
    "None", // 71: Inpaint Engine
    0.5, // 72: Inpaint Denoising Strength
    0.5, // 73: Inpaint Respective Field
    false, // 74: Enable Advanced Masking Features
    false, // 75: Invert Mask When Generating
    -1, // 76: Mask Erode or Dilate
    true, // 77: Save only final enhanced image
    true, // 78: Save Metadata to Images
    "fooocus", // 79: Metadata Scheme
    null, // 80: Image
    0, // 81: Stop At
    0, // 82: Weight
    "ImagePrompt", // 83: Type
    null, // 84: Image
    0, // 85: Stop At
    0, // 86: Weight
    "ImagePrompt", // 87: Type
    null, // 88: Image
    0, // 89: Stop At
    0, // 90: Weight
    "ImagePrompt", // 91: Type
    null, // 92: Image
    0, // 93: Stop At
    0, // 94: Weight
    "ImagePrompt", // 95: Type
    false, // 96: Debug GroundingDINO
    -1, // 97: GroundingDINO Box Erode or Dilate
    false, // 98: Debug Enhance Masks
    null, // 99: Use with Enhance, skips image generation
    false, // 100: Enhance
    "Disabled", // 101: Upscale or Variation
    "Before First Enhancement", // 102: Order of Processing
    "Original Prompts", // 103: Prompt
    false, // 104: Enable
    "", // 105: Detection prompt
    "", // 106: Enhancement positive prompt
    "", // 107: Enhancement negative prompt
    "u2net", // 108: Mask generation model
    "full", // 109: Cloth category
    "vit_b", // 110: SAM model
    0.25, // 111: Text Threshold
    0.3, // 112: Box Threshold
    0, // 113: Maximum number of detections
    false, // 114: Disable initial latent in inpaint
    "None", // 115: Inpaint Engine
    0.5, // 116: Inpaint Denoising Strength
    0.5, // 117: Inpaint Respective Field
    -1, // 118: Mask Erode or Dilate
    false, // 119: Invert Mask
    false, // 120: Enable
    "", // 121: Detection prompt
    "", // 122: Enhancement positive prompt
    "", // 123: Enhancement negative prompt
    "u2net", // 124: Mask generation model
    "full", // 125: Cloth category
    "vit_b", // 126: SAM model
    0.25, // 127: Text Threshold
    0.3, // 128: Box Threshold
    0, // 129: Maximum number of detections
    false, // 130: Disable initial latent in inpaint
    "None", // 131: Inpaint Engine
    0.5, // 132: Inpaint Denoising Strength
    0.5, // 133: Inpaint Respective Field
    -1, // 134: Mask Erode or Dilate
    false, // 135: Invert Mask
    false, // 136: Enable
    "", // 137: Detection prompt
    "", // 138: Enhancement positive prompt
    "", // 139: Enhancement negative prompt
    "u2net", // 140: Mask generation model
    "full", // 141: Cloth category
    "vit_b", // 142: SAM model
    0.25, // 143: Text Threshold
    0.3, // 144: Box Threshold
    0, // 145: Maximum number of detections
    false, // 146: Disable initial latent in inpaint
    "None", // 147: Inpaint Engine
    0.5, // 148: Inpaint Denoising Strength
    0.5, // 149: Inpaint Respective Field
    -1, // 150: Mask Erode or Dilate
    false // 151: Invert Mask
  ],
  session_hash: "test_" + Date.now()
};

async function test() {
  console.log('Testing Fooocus API with 152 parameters...');
  try {
    const res = await fetch('http://localhost:7865/api/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
