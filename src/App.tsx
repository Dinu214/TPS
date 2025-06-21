import React, { useState, useMemo } from 'react';
import { Calculator, Cpu, Zap, Info, TrendingUp } from 'lucide-react';

function App() {
  const [paramsB, setParamsB] = useState<string>('13.0');
  const [quantization, setQuantization] = useState<string>('FP8');
  const [bandwidth, setBandwidth] = useState<string>('600.0');

  const quantFactors: Record<string, number> = {
    'FP8': 1,
    'FP4': 2,
    'FP16': 0.5
  };

  const calculations = useMemo(() => {
    const paramsBNum = parseFloat(paramsB) || 0;
    const bandwidthNum = parseFloat(bandwidth) || 0;
    
    const bytesPerParam = 1;
    const modelSizeGb = paramsBNum * 1e9 * bytesPerParam / 1e9; // = paramsBNum
    const quantFactor = quantFactors[quantization];
    const theoreticalTps = bandwidthNum > 0 && paramsBNum > 0 ? (bandwidthNum / modelSizeGb) * quantFactor : 0;
    const realTps = theoreticalTps * 0.5;

    return {
      modelSizeGb,
      theoreticalTps,
      realTps,
      quantFactor
    };
  }, [paramsB, quantization, bandwidth]);

  const handleParamsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setParamsB(value);
    }
  };

  const handleBandwidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty string, numbers, and decimal points
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setBandwidth(value);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            LLM TPS Estimator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate tokens per second for large language models
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <Zap className="w-6 h-6 text-blue-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Configuration</h2>
            </div>

            <div className="space-y-6">
              {/* Model Size Input */}
              <div>
                <label htmlFor="params" className="block text-sm font-medium text-gray-700 mb-2">
                  Model Size (Billion Parameters)
                </label>
                <input
                  id="params"
                  type="text"
                  value={paramsB}
                  onChange={handleParamsChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Enter model size (e.g., 13.0, 70, 405)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Examples: 7, 13, 70, 175, 405
                </p>
              </div>

              {/* Quantization Select */}
              <div>
                <label htmlFor="quantization" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantization
                </label>
                <select
                  id="quantization"
                  value={quantization}
                  onChange={(e) => setQuantization(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                >
                  <option value="FP8">FP8 (8-bit floating point)</option>
                  <option value="FP4">FP4 (4-bit floating point)</option>
                  <option value="FP16">FP16 (16-bit floating point)</option>
                </select>
              </div>

              {/* Bandwidth Input */}
              <div>
                <label htmlFor="bandwidth" className="block text-sm font-medium text-gray-700 mb-2">
                  GPU Memory Bandwidth (GB/s)
                </label>
                <input
                  id="bandwidth"
                  type="text"
                  value={bandwidth}
                  onChange={handleBandwidthChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Enter bandwidth (e.g., 600, 900, 1200)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Common values: H100 (3350), A100 (1935), V100 (900), RTX 4090 (1008)
                </p>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-green-500 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-900">Results</h2>
            </div>

            <div className="space-y-6">
              {/* Model Size */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Model Size</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {calculations.modelSizeGb.toFixed(2)} GB
                  </span>
                </div>
              </div>

              {/* Theoretical TPS */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-600">Theoretical TPS</span>
                  <span className="text-2xl font-bold text-blue-700">
                    {calculations.theoreticalTps.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-blue-500 mt-1">tokens/second</div>
              </div>

              {/* Real TPS */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-600">Estimated Real TPS (~50%)</span>
                  <span className="text-2xl font-bold text-green-700">
                    {calculations.realTps.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-green-500 mt-1">tokens/second</div>
              </div>

              {/* Performance Indicator */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Cpu className="w-5 h-5 text-purple-500 mr-2" />
                  <span className="text-sm font-medium text-purple-700">
                    Quantization Factor: {calculations.quantFactor}x
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Documentation */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <Info className="w-6 h-6 text-amber-500 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Formula & Notes</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Calculation Formula</h3>
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                TPS = (Bandwidth / Model Size) × Quantization Factor
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantization Factors</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-medium">FP8 (8-bit)</span>
                  <span className="text-gray-600">1x</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-medium">FP4 (4-bit)</span>
                  <span className="text-gray-600">2x</span>
                </div>
                <div className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-medium">FP16 (16-bit)</span>
                  <span className="text-gray-600">0.5x</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Real-world TPS is approximately 50% of theoretical due to overhead 
              from batching, context length, I/O operations, and other system factors.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;