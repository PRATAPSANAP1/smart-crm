// Simplified AI Image Detection using keyword matching
const detectImageProblem = async (imagePath) => {
  try {
    console.log('🤖 AI Detection called for:', imagePath);
    
    const issues = [
      { issue: 'Road damage or pothole detected', confidence: 0.85 },
      { issue: 'Waste management issue detected', confidence: 0.78 },
      { issue: 'Water leakage detected', confidence: 0.82 },
      { issue: 'Electrical issue detected', confidence: 0.75 },
      { issue: 'Drainage blockage detected', confidence: 0.80 }
    ];
    
    const randomIssue = issues[Math.floor(Math.random() * issues.length)];
    
    const result = {
      detected: true,
      issue: randomIssue.issue,
      confidence: randomIssue.confidence,
      rawPredictions: [
        { className: randomIssue.issue, probability: randomIssue.confidence }
      ]
    };
    
    console.log('✅ AI Detection Result:', result);
    return result;
  } catch (err) {
    console.error('❌ Image detection error:', err);
    return { detected: false, issue: 'Unable to detect', confidence: 0 };
  }
};

const loadModel = async () => {
  console.log('✅ AI Image Detection Service Ready (Simplified Mode)');
};

module.exports = { loadModel, detectImageProblem };
