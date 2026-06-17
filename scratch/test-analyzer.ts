import { validateResume } from '../src/lib/analyzer';

const testCases = [
  {
    name: 'Blank PDF / Scanned Image',
    text: 'Just some short text.'
  },
  {
    name: 'Random Story',
    text: `Once upon a time in a faraway kingdom, there lived a brave knight named Sir Eldon. He went on a quest to rescue a lost key from a giant dragon. The quest was filled with challenges, deep rivers, and dark caves. But Sir Eldon didn't give up. He persisted and returned victorious to the castle, where he lived happily ever after.`
  },
  {
    name: 'Research Paper',
    text: `Title: Deep Neural Architectures for Image Recognition
Abstract:
This paper presents a new neural network architecture designed for high-accuracy image recognition tasks.
Introduction:
Machine learning has seen significant growth in recent years.
Methodology:
We construct a convolutional neural network with residual layers and benchmark it.
Results:
Our model achieves state-of-the-art results on standard datasets.
Conclusion:
The proposed model performs efficiently under varying loads.
References:
1. LeCun, Y. et al. Gradient-based learning applied to document recognition.
2. He, K. et al. Deep residual learning for image recognition.`
  },
  {
    name: 'Invoice Document',
    text: `INVOICE
Invoice Date: June 15, 2026
Bill Number: INV-2026-004
GSTIN: 36AAAAA1111A1Z1
Subtotal: $1,200.00
Tax (GST 18%): $216.00
Amount Due: $1,416.00
Payment Terms: Net 30 days. Please send payments to Acme Corp bank account.
Thank you for your business.`
  },
  {
    name: 'Weak Resume',
    text: `Niharika Narla
Email: niharika@example.com
Experience:
Software Intern at TechCorp.
Skills:
React, Node.js, JavaScript, Git.
Education:
Bachelor of Technology in Computer Science.`
  },
  {
    name: 'Strong Resume',
    text: `Niharika Narla
Email: niharika@example.com
Phone: +1-555-0199
LinkedIn: linkedin.com/in/niharikanarla
Summary:
Results-driven Software Engineer with experience in full-stack development.
Skills:
React, Node.js, JavaScript, TypeScript, SQL, Git, REST APIs, HTML, CSS.
Experience:
Software Engineer at TechCorp (2024 - Present)
- Engineered scalable web applications using React and Node.js.
- Automated CI/CD deployment workflows, saving 10 hours weekly.
Projects:
CareerDNA - AI Employability Platform
Certifications:
AWS Certified Solutions Architect, Certified Scrum Master (CSM)
Education:
Bachelor of Technology in Computer Science, 2024`
  }
];

console.log('==================================================');
console.log('CAREERDNA - ATS VALIDATION LAYER RUNNER');
console.log('==================================================\n');

let passedTestsCount = 0;
const resultsLog: any[] = [];

testCases.forEach((tc, idx) => {
  const result = validateResume(tc.text);
  let expectedPass = false;
  let expectedWarning = false;

  if (tc.name === 'Weak Resume') {
    expectedPass = true;
    expectedWarning = true;
  } else if (tc.name === 'Strong Resume') {
    expectedPass = true;
    expectedWarning = false;
  }

  const actualPass = result.isValid;
  const isCorrect = (actualPass === expectedPass);
  
  if (isCorrect) passedTestsCount++;

  console.log(`Test Case ${idx + 1}: ${tc.name}`);
  console.log(`- Text Length: ${tc.text.length} chars`);
  console.log(`- Confidence: ${result.confidence}%`);
  console.log(`- Resume Detected: ${result.isDetected}`);
  console.log(`- Resume Type: ${result.resumeType}`);
  console.log(`- Validation Approved: ${result.isValid ? 'YES' : 'NO'}`);
  console.log(`- Expected Approved: ${expectedPass ? 'YES' : 'NO'}`);
  if (result.warning) {
    console.log(`- Warning/Reason: "${result.warning}"`);
  }
  console.log(`- Missing: [${result.missingSections.join(', ')}]`);
  console.log(`- Status: ${isCorrect ? 'PASS' : 'FAIL'}`);
  console.log('--------------------------------------------------\n');

  resultsLog.push({
    name: tc.name,
    confidence: result.confidence,
    isDetected: result.isDetected,
    resumeType: result.resumeType,
    isValid: result.isValid,
    warning: result.warning || 'None',
    missingSections: result.missingSections,
    status: isCorrect ? 'PASS' : 'FAIL'
  });
});

console.log('==================================================');
console.log(`SUMMARY: ${passedTestsCount} / ${testCases.length} TESTS PASSED`);
console.log(`Validation Accuracy: ${((passedTestsCount / testCases.length) * 100).toFixed(0)}%`);
console.log('==================================================');
