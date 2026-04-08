import { useState } from 'react';

export const PhotoAnalysisResults = ({ analysis, onUploadDNA }) => {
  const [activeTab, setActiveTab] = useState('visual');
  
  const { visual_traits, genetic_correlation, recommendations, confidence } = analysis;
  
  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'bg-green-500';
    if (conf >= 0.6) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span>🧬</span> Photo Analysis Results
              </h2>
              <p className="text-indigo-100 mt-2">
                Visual traits correlated with genetic markers
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-indigo-200">Confidence</div>
              <div className="text-2xl font-bold">{Math.round(confidence * 100)}%</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {[
              { id: 'visual', label: 'Visual Traits', icon: '👁️' },
              { id: 'genetics', label: 'Genetic Correlations', icon: '🧬' },
              { id: 'recommendations', label: 'Next Steps', icon: '✓' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex-1 py-4 px-6 text-sm font-medium flex items-center justify-center gap-2
                  ${activeTab === tab.id 
                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50' 
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Visual Traits Tab */}
          {activeTab === 'visual' && (
            <div className="space-y-6">
              {/* Coat Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🎨</span> Coat Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TraitCard 
                    label="Primary Color" 
                    value={visual_traits.coat.color.primary} 
                    color="bg-blue-100"
                  />
                  <TraitCard 
                    label="Length" 
                    value={visual_traits.coat.length} 
                    color="bg-green-100"
                  />
                  <TraitCard 
                    label="Texture" 
                    value={visual_traits.coat.texture} 
                    color="bg-purple-100"
                  />
                  <TraitCard 
                    label="Pattern" 
                    value={visual_traits.coat.pattern} 
                    color="bg-pink-100"
                  />
                </div>
              </div>

              {/* Facial Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>😺</span> Facial Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TraitCard 
                    label="Ear Shape" 
                    value={visual_traits.facial.ear_shape} 
                    color="bg-yellow-100"
                  />
                  <TraitCard 
                    label="Ear Size" 
                    value={visual_traits.facial.ear_size} 
                    color="bg-orange-100"
                  />
                  <TraitCard 
                    label="Face Shape" 
                    value={visual_traits.facial.face_shape} 
                    color="bg-red-100"
                  />
                  <TraitCard 
                    label="Eye Color" 
                    value={visual_traits.facial.eye_color} 
                    color="bg-cyan-100"
                  />
                </div>
              </div>

              {/* Body Section */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>🐈</span> Body Features
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <TraitCard 
                    label="Tail Length" 
                    value={visual_traits.body.tail.length} 
                    color="bg-teal-100"
                  />
                  <TraitCard 
                    label="Tail Shape" 
                    value={visual_traits.body.tail.shape} 
                    color="bg-indigo-100"
                  />
                  <TraitCard 
                    label="Body Type" 
                    value={visual_traits.body.body_type} 
                    color="bg-lime-100"
                  />
                  <TraitCard 
                    label="Size" 
                    value={visual_traits.body.size_estimate} 
                    color="bg-emerald-100"
                  />
                </div>
              </div>

              {/* Anomalies */}
              {visual_traits.anomalies?.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Features Flagged for Review
                  </h3>
                  <div className="space-y-2">
                    {visual_traits.anomalies.map((anomaly, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-amber-700">
                        <span className={`
                          px-2 py-1 rounded text-xs font-medium
                          ${anomaly.severity === 'moderate' ? 'bg-amber-200' : 'bg-amber-100'}
                        `}>
                          {anomaly.severity}
                        </span>
                        <span>{anomaly.feature.replace('_', ' ')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Genetics Tab */}
          {activeTab === 'genetics' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 rounded-xl p-4 mb-6">
                <p className="text-indigo-800 text-sm">
                  Visual traits often correlate with specific genetic variants. 
                  Genetic testing confirms heritability and carrier status.
                </p>
              </div>

              {genetic_correlation.map((gene, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">🧬</span>
                        <h4 className="font-semibold text-gray-800">{gene.trait}</h4>
                        <span className={`
                          px-2 py-0.5 rounded text-xs font-medium
                          ${gene.confidence === 'high' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                        `}>
                          {gene.confidence} confidence
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 mb-2">
                        Gene: <span className="font-mono text-indigo-600">{gene.gene}</span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-3">{gene.note}</p>
                      
                      {gene.action && (
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                          <span className="font-medium">💡 Recommendation: </span>
                          {gene.action}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className={`
                    border rounded-xl p-4
                    ${rec.priority === 'high' 
                      ? 'bg-red-50 border-red-200' 
                      : rec.priority === 'moderate'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {rec.type === 'genetic_test' ? '🔬' 
                        : rec.type === 'veterinary_review' 
                        ? '⚕️' 
                        : rec.type === 'breed_insight'
                        ? '📋'
                        : '✓'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-800">{rec.message}</h4>
                        <span className={`
                          px-2 py-0.5 rounded text-xs font-medium uppercase
                          ${rec.priority === 'high' ? 'bg-red-200 text-red-800' : ''}
                          ${rec.priority === 'moderate' ? 'bg-yellow-200 text-yellow-800' : ''}
                          ${rec.priority === 'low' ? 'bg-gray-200 text-gray-800' : ''}
                        `}>
                          {rec.priority}
                        </span>
                      </div>
                      
                      {rec.benefits && (
                        <ul className="mt-2 space-y-1">
                          {rec.benefits.map((benefit, bidx) => (
                            <li key={bidx} className="text-sm text-gray-600 flex items-center gap-2">
                              <span className="text-green-500">✓</span> {benefit}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {rec.note && (
                        <p className="mt-2 text-sm text-gray-500 italic">{rec.note}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white text-center">
                <h4 className="text-lg font-semibold mb-2">Ready to unlock the full genetic picture?</h4>
                <p className="text-indigo-100 mb-4">
                  Upload your pet's DNA data to confirm visual predictions and discover health insights.
                </p>
                <button
                  onClick={onUploadDNA}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-colors"
                >
                  Upload DNA Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-components
const TraitCard = ({ label, value, color }) => (
  <div className={`${color} rounded-lg p-3`}>
    <div className="text-xs text-gray-600 mb-1 capitalize">{label}</div>
    <div className="font-semibold text-gray-800 capitalize">{value || 'Not detected'}</div>
  </div>
);
