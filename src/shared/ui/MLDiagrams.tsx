import React from 'react';

export const MLDiagrams: Record<string, React.FC<{ className?: string }>> = {
  // Linear Models: Hyperplane separating two classes
  Hyperplane: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      <defs>
        <linearGradient id="planeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#818cf8" />
        </linearGradient>
      </defs>
      {/* Coordinate axes */}
      <line x1="40" y1="200" x2="360" y2="200" stroke="#475569" strokeWidth="1.5" />
      <line x1="40" y1="200" x2="40" y2="20" stroke="#475569" strokeWidth="1.5" />
      <text x="365" y="205" fill="#94a3b8" fontSize="12" fontFamily="monospace">x₁</text>
      <text x="35" y="15" fill="#94a3b8" fontSize="12" fontFamily="monospace">x₂</text>

      {/* Class +1 points (cyan) */}
      <circle cx="280" cy="60" r="6" fill="#38bdf8" />
      <circle cx="310" cy="80" r="6" fill="#38bdf8" />
      <circle cx="250" cy="90" r="6" fill="#38bdf8" />
      <circle cx="320" cy="40" r="6" fill="#38bdf8" />
      <circle cx="270" cy="110" r="6" fill="#38bdf8" />

      {/* Class -1 points (amber) */}
      <circle cx="90" cy="160" r="6" fill="#f59e0b" />
      <circle cx="120" cy="180" r="6" fill="#f59e0b" />
      <circle cx="140" cy="140" r="6" fill="#f59e0b" />
      <circle cx="80" cy="130" r="6" fill="#f59e0b" />
      <circle cx="160" cy="170" r="6" fill="#f59e0b" />

      {/* Hyperplane line w^T x + b = 0 */}
      <line x1="70" y1="70" x2="280" y2="210" stroke="url(#planeGrad)" strokeWidth="3" strokeDasharray="4 2" />
      <text x="180" y="115" fill="#38bdf8" fontSize="12" fontWeight="bold">wᵀx + b = 0</text>

      {/* Normal vector w */}
      <line x1="175" y1="140" x2="220" y2="95" stroke="#a855f7" strokeWidth="2.5" markerEnd="url(#arrow)" />
      <text x="228" y="95" fill="#c084fc" fontSize="12" fontWeight="bold">w (нормаль)</text>
    </svg>
  ),

  // SVM Margin
  SVMMargin: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      {/* Margins */}
      <polygon points="60,60 120,40 320,190 260,210" fill="rgba(56, 189, 248, 0.08)" />
      <line x1="60" y1="60" x2="260" y2="210" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="120" y1="40" x2="320" y2="190" stroke="#0ea5e9" strokeWidth="1.5" strokeDasharray="3 3" />
      <line x1="90" y1="50" x2="290" y2="200" stroke="#38bdf8" strokeWidth="3" />

      {/* Support vectors with halo */}
      <circle cx="165" cy="106" r="9" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2 2" />
      <circle cx="165" cy="106" r="5" fill="#38bdf8" />
      <circle cx="215" cy="144" r="9" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="2 2" />
      <circle cx="215" cy="144" r="5" fill="#f59e0b" />

      {/* Other points */}
      <circle cx="130" cy="70" r="5" fill="#38bdf8" />
      <circle cx="110" cy="100" r="5" fill="#38bdf8" />
      <circle cx="260" cy="170" r="5" fill="#f59e0b" />
      <circle cx="290" cy="150" r="5" fill="#f59e0b" />

      <text x="100" y="30" fill="#94a3b8" fontSize="11">wᵀx + b = +1</text>
      <text x="270" y="225" fill="#94a3b8" fontSize="11">wᵀx + b = -1</text>
      <text x="180" y="80" fill="#38bdf8" fontSize="12" fontWeight="bold">Опорные векторы (SV)</text>
      <text x="200" y="180" fill="#a855f7" fontSize="11">Зазор: 2 / ||w||</text>
    </svg>
  ),

  // Decision Tree Split
  DecisionTree: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      {/* Root */}
      <rect x="140" y="20" width="120" height="36" rx="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="200" y="42" fill="#f8fafc" fontSize="11" textAnchor="middle" fontWeight="bold">x₁ ≤ 3.5 ?</text>

      {/* Branches */}
      <line x1="170" y1="56" x2="90" y2="100" stroke="#64748b" strokeWidth="1.5" />
      <line x1="230" y1="56" x2="310" y2="100" stroke="#64748b" strokeWidth="1.5" />
      <text x="110" y="75" fill="#10b981" fontSize="10">Да</text>
      <text x="280" y="75" fill="#ef4444" fontSize="10">Нет</text>

      {/* Left Node */}
      <rect x="40" y="100" width="100" height="34" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="1.5" />
      <text x="90" y="121" fill="#ecfdf5" fontSize="10" textAnchor="middle" fontWeight="bold">Класс A (Лист)</text>

      {/* Right Subtree */}
      <rect x="250" y="100" width="120" height="34" rx="8" fill="#1e293b" stroke="#818cf8" strokeWidth="1.5" />
      <text x="310" y="121" fill="#f8fafc" fontSize="10" textAnchor="middle" fontWeight="bold">x₂ ≤ 12.0 ?</text>

      {/* Bottom leaves */}
      <line x1="280" y1="134" x2="230" y2="175" stroke="#64748b" strokeWidth="1.5" />
      <line x1="340" y1="134" x2="370" y2="175" stroke="#64748b" strokeWidth="1.5" />
      <rect x="180" y="175" width="100" height="32" rx="8" fill="#065f46" stroke="#10b981" strokeWidth="1" />
      <text x="230" y="195" fill="#ecfdf5" fontSize="10" textAnchor="middle">Класс B</text>
      <rect x="320" y="175" width="80" height="32" rx="8" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1" />
      <text x="360" y="195" fill="#fee2e2" fontSize="10" textAnchor="middle">Класс C</text>
    </svg>
  ),

  // Neural Network
  NeuralNet: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      {/* Input layer */}
      <circle cx="80" cy="60" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="80" cy="120" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      <circle cx="80" cy="180" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
      <text x="80" y="64" fill="#f8fafc" fontSize="10" textAnchor="middle">x₁</text>
      <text x="80" y="124" fill="#f8fafc" fontSize="10" textAnchor="middle">x₂</text>
      <text x="80" y="184" fill="#f8fafc" fontSize="10" textAnchor="middle">x₃</text>

      {/* Hidden layer */}
      <circle cx="200" cy="45" r="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
      <circle cx="200" cy="95" r="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
      <circle cx="200" cy="145" r="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
      <circle cx="200" cy="195" r="14" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />

      {/* Output layer */}
      <circle cx="320" cy="90" r="14" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
      <circle cx="320" cy="150" r="14" fill="#064e3b" stroke="#34d399" strokeWidth="2" />
      <text x="320" y="94" fill="#f8fafc" fontSize="10" textAnchor="middle">ŷ₁</text>
      <text x="320" y="154" fill="#f8fafc" fontSize="10" textAnchor="middle">ŷ₂</text>

      {/* Synapses connections (opacity) */}
      <g stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1">
        <line x1="94" y1="60" x2="186" y2="45" />
        <line x1="94" y1="60" x2="186" y2="95" />
        <line x1="94" y1="60" x2="186" y2="145" />
        <line x1="94" y1="120" x2="186" y2="45" />
        <line x1="94" y1="120" x2="186" y2="95" />
        <line x1="94" y1="120" x2="186" y2="145" />
        <line x1="94" y1="180" x2="186" y2="145" />
        <line x1="94" y1="180" x2="186" y2="195" />

        <line x1="214" y1="45" x2="306" y2="90" />
        <line x1="214" y1="95" x2="306" y2="90" />
        <line x1="214" y1="145" x2="306" y2="150" />
        <line x1="214" y1="195" x2="306" y2="150" />
      </g>
      <text x="80" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle">Вход</text>
      <text x="200" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle">Скрытый (W, b)</text>
      <text x="320" y="225" fill="#94a3b8" fontSize="10" textAnchor="middle">Выход σ(z)</text>
    </svg>
  ),

  // Convolutional Neural Network (Conv2d, Pooling, ResNet Skip-Connection)
  CNNFeatureMap: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      <defs>
        <linearGradient id="convGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      {/* Input Image (Channel 1) */}
      <rect x="25" y="60" width="70" height="70" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <rect x="35" y="70" width="24" height="24" rx="2" fill="rgba(56, 189, 248, 0.3)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="60" y="150" fill="#94a3b8" fontSize="10" textAnchor="middle">Вход [C, H, W]</text>

      {/* Conv Kernel projection lines */}
      <path d="M 59,70 L 140,55 M 59,94 L 140,75" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

      {/* Feature Map 1 (Conv2d) */}
      <rect x="140" y="45" width="60" height="60" rx="4" fill="#0f172a" stroke="url(#convGrad)" strokeWidth="1.5" />
      <rect x="150" y="55" width="16" height="16" rx="2" fill="rgba(129, 140, 248, 0.4)" stroke="#818cf8" strokeWidth="1.5" />
      <text x="170" y="125" fill="#38bdf8" fontSize="10" textAnchor="middle">Conv2d + BN</text>

      {/* Residual Skip Connection Arrow */}
      <path d="M 170,45 C 170,15 290,15 290,45" fill="none" stroke="#22d3ee" strokeWidth="2" strokeDasharray="3 2" />
      <text x="230" y="12" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">+ Skip Connection [x]</text>

      {/* Feature Map 2 (ResNet Block) */}
      <rect x="260" y="45" width="60" height="60" rx="4" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
      <text x="290" y="78" fill="#a7f3d0" fontSize="11" textAnchor="middle" fontWeight="bold">F(x) + x</text>
      <text x="290" y="125" fill="#34d399" fontSize="10" textAnchor="middle">ResNet Block</text>

      {/* Global Average Pooling & Dense */}
      <line x1="320" y1="75" x2="350" y2="75" stroke="#94a3b8" strokeWidth="1.5" markerEnd="url(#arrow)" />
      <rect x="350" y="60" width="25" height="30" rx="4" fill="#7c3aed" stroke="#c084fc" strokeWidth="1.5" />
      <text x="362" y="105" fill="#c084fc" fontSize="9" textAnchor="middle">Linear</text>

      <text x="200" y="210" fill="#94a3b8" fontSize="10" textAnchor="middle">
        Размерность: O = ⌊(W - K + 2P) / S⌋ + 1 | Сохранение градиента через тождественный путь
      </text>
    </svg>
  ),

  // Variational Autoencoder (ELBO & Reparameterization Trick)
  VAELatentSpace: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      {/* Input x */}
      <rect x="25" y="80" width="45" height="60" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="47" y="115" fill="#f8fafc" fontSize="12" textAnchor="middle" fontWeight="bold">x</text>
      <text x="47" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Вход</text>

      {/* Encoder */}
      <polygon points="75,70 145,90 145,130 75,150" fill="rgba(56, 189, 248, 0.15)" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="105" y="114" fill="#38bdf8" fontSize="10" textAnchor="middle">q_φ(z|x)</text>

      {/* Latent parameters mu and sigma */}
      <rect x="155" y="65" width="40" height="24" rx="4" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
      <text x="175" y="81" fill="#c7d2fe" fontSize="11" textAnchor="middle" fontWeight="bold">μ(x)</text>

      <rect x="155" y="130" width="40" height="24" rx="4" fill="#312e81" stroke="#818cf8" strokeWidth="1.5" />
      <text x="175" y="146" fill="#c7d2fe" fontSize="11" textAnchor="middle" fontWeight="bold">log σ²</text>

      {/* Reparameterization Trick Node */}
      <circle cx="235" cy="110" r="18" fill="#047857" stroke="#34d399" strokeWidth="2" />
      <text x="235" y="114" fill="#ffffff" fontSize="11" textAnchor="middle" fontWeight="bold">z</text>
      <text x="235" y="142" fill="#34d399" fontSize="9" textAnchor="middle">z = μ + σ⊙ε</text>

      {/* Random noise eps */}
      <circle cx="235" cy="45" r="10" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
      <text x="235" y="49" fill="#fbbf24" fontSize="9" textAnchor="middle">ε~N(0,I)</text>
      <line x1="235" y1="56" x2="235" y2="92" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />

      {/* Decoder */}
      <polygon points="265,90 335,70 335,150 265,130" fill="rgba(168, 85, 247, 0.15)" stroke="#a855f7" strokeWidth="1.5" />
      <text x="300" y="114" fill="#c084fc" fontSize="10" textAnchor="middle">p_θ(x|z)</text>

      {/* Reconstructed x_hat */}
      <rect x="345" y="80" width="45" height="60" rx="6" fill="#1e293b" stroke="#a855f7" strokeWidth="1.5" />
      <text x="367" y="115" fill="#f8fafc" fontSize="12" textAnchor="middle" fontWeight="bold">x̂</text>
      <text x="367" y="160" fill="#94a3b8" fontSize="10" textAnchor="middle">Выход</text>

      <text x="200" y="215" fill="#94a3b8" fontSize="10" textAnchor="middle">
        ELBO = E[log p(x|z)] - D_KL(q(z|x) || p(z)) | Сквозной градиент через ε
      </text>
    </svg>
  ),

  // Transformer Multi-Head Self-Attention
  TransformerAttention: ({ className = 'w-full max-h-56' }) => (
    <svg viewBox="0 0 400 240" className={`${className} rounded-xl bg-slate-900/60 border border-white/10 p-2`}>
      {/* Input embeddings X */}
      <rect x="30" y="180" width="340" height="24" rx="4" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" />
      <text x="200" y="196" fill="#94a3b8" fontSize="11" textAnchor="middle">
        Входной тензор X ∈ ℝ^(B × N × d_model) + Positional Encoding (RoPE)
      </text>

      {/* Linear Projections Q, K, V */}
      <rect x="60" y="115" width="65" height="30" rx="4" fill="#0369a1" stroke="#38bdf8" strokeWidth="1.5" />
      <text x="92" y="134" fill="#f0f9ff" fontSize="11" textAnchor="middle" fontWeight="bold">Query (Q)</text>

      <rect x="165" y="115" width="65" height="30" rx="4" fill="#4338ca" stroke="#818cf8" strokeWidth="1.5" />
      <text x="197" y="134" fill="#eef2ff" fontSize="11" textAnchor="middle" fontWeight="bold">Key (K)</text>

      <rect x="270" y="115" width="65" height="30" rx="4" fill="#701a75" stroke="#f472b6" strokeWidth="1.5" />
      <text x="302" y="134" fill="#fdf2f8" fontSize="11" textAnchor="middle" fontWeight="bold">Value (V)</text>

      {/* Arrows Q & K -> MatMul Softmax */}
      <line x1="92" y1="115" x2="160" y2="65" stroke="#38bdf8" strokeWidth="1.5" />
      <line x1="197" y1="115" x2="180" y2="65" stroke="#818cf8" strokeWidth="1.5" />

      {/* Attention Map / Softmax(QK^T / sqrt(d_k)) */}
      <rect x="135" y="35" width="130" height="32" rx="6" fill="#0f172a" stroke="#22d3ee" strokeWidth="2" />
      <text x="200" y="55" fill="#22d3ee" fontSize="10" textAnchor="middle" fontWeight="bold">
        softmax(Q Kᵀ / √d_k)
      </text>

      {/* Matmul with V */}
      <line x1="302" y1="115" x2="250" y2="65" stroke="#f472b6" strokeWidth="1.5" />
      <line x1="200" y1="35" x2="200" y2="15" stroke="#22d3ee" strokeWidth="2" markerEnd="url(#arrow)" />
      <text x="200" y="12" fill="#38bdf8" fontSize="10" textAnchor="middle" fontWeight="bold">
        Multi-Head Attention Output (MHA / GQA)
      </text>
    </svg>
  ),
};

