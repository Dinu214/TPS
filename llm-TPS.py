import streamlit as st

st.title("LLM TPS Estimator (Simple Formula)")

# Input: model & GPU
params_b = st.number_input("Model size (Billion parameters)", min_value=1.0, value=13.0)
quant = st.selectbox("Quantization", ["FP8", "FP4", "FP16"])
quant_factor = {"FP8": 1, "FP4": 2, "FP16": 0.5}[quant]
bandwidth = st.number_input("GPU Memory Bandwidth (GB/s)", min_value=100.0, value=600.0)

# Calculate model size
bytes_per_param = 1  # Assume 1 byte per param base, adjusted by quant_factor
model_size_gb = params_b * 1e9 * bytes_per_param / 1e9  # = params_b

# TPS Calculation
theoretical_tps = (bandwidth / model_size_gb) * quant_factor
real_tps = theoretical_tps * 0.5  # 50% real-world performance

# Output
st.markdown("### 📊 Results")
st.write(f"• Model Size: **{model_size_gb:.2f} GB**")
st.write(f"• Theoretical TPS: **{theoretical_tps:.2f} tokens/sec**")
st.write(f"• Estimated Real TPS (~50%): **{real_tps:.2f} tokens/sec**")

# Notes
st.markdown("""
---
### 📘 Formula
**TPS = (Bandwidth / Model Size) × Quantization Factor**

**Quantization Factors:**
- FP8 → 1  
- FP4 → 2  
- FP16 → 0.5

**Real-world TPS ≈ 50%** of theoretical due to overhead (batching, context length, I/O, etc).
""")
