import { validateAnswer } from '../src/lib/interview-validator';

const testCases = [
  {
    name: 'Empty Answer',
    text: '',
    expectedValid: false
  },
  {
    name: 'Punctuation Only ("...")',
    text: '...',
    expectedValid: false
  },
  {
    name: 'Placeholder Word ("hello")',
    text: 'hello',
    expectedValid: false
  },
  {
    name: 'Short Gibberish ("abc")',
    text: 'abc',
    expectedValid: false
  },
  {
    name: 'Random Numbers ("12345 67890")',
    text: '1234567890 987654321',
    expectedValid: false
  },
  {
    name: 'Repeated letters ("aaaaa...")',
    text: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    expectedValid: false
  },
  {
    name: 'Repeated Words ("test test...")',
    text: 'test test test test test test test test test test test',
    expectedValid: false
  },
  {
    name: 'Low Confidence Answer (Weak Tech)',
    text: 'I write code using React library code. Yes code is good.',
    expectedValid: false
  },
  {
    name: 'Real Interview Answer (Strong Tech)',
    text: 'To optimize state scaling inside React codebases, I partition global state using Zustand and utilize Context for localized modules, preventing redundant visual re-renders.',
    expectedValid: true
  }
];

console.log('==================================================');
console.log('CAREERDNA - INTERVIEW VALIDATOR HARNESS');
console.log('==================================================\n');

let passedTestsCount = 0;
const resultsLog: any[] = [];

testCases.forEach((tc, idx) => {
  const result = validateAnswer(tc.text);
  const isCorrect = (result.isValid === tc.expectedValid);
  
  if (isCorrect) passedTestsCount++;

  console.log(`Test Case ${idx + 1}: ${tc.name}`);
  console.log(`- Text: "${tc.text || '<empty>'}"`);
  console.log(`- Confidence: ${result.confidence}%`);
  console.log(`- Validation Approved: ${result.isValid ? 'YES' : 'NO'}`);
  console.log(`- Expected Approved: ${tc.expectedValid ? 'YES' : 'NO'}`);
  if (result.error) {
    console.log(`- Error/Reason: "${result.error}"`);
  }
  console.log(`- Status: ${isCorrect ? 'PASS' : 'FAIL'}`);
  console.log('--------------------------------------------------\n');

  resultsLog.push({
    name: tc.name,
    text: tc.text,
    confidence: result.confidence,
    isValid: result.isValid,
    error: result.error || 'None',
    status: isCorrect ? 'PASS' : 'FAIL'
  });
});

console.log('==================================================');
console.log(`SUMMARY: ${passedTestsCount} / ${testCases.length} TESTS PASSED`);
console.log(`Validation Accuracy: ${((passedTestsCount / testCases.length) * 100).toFixed(0)}%`);
console.log('==================================================');
