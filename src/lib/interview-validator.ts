// AI Interview Coach Response Validator and Anti-Cheat Engine

export interface InterviewValidationResult {
  isValid: boolean;
  confidence: number;
  error?: string;
  checks: {
    lengthOk: boolean;
    wordCountOk: boolean;
    hasLettersOrDigits: boolean;
    notOnlyNumbers: boolean;
    noPlaceholders: boolean;
    noRepeatedPhrases: boolean;
    noGibberish: boolean;
    hasIndustryKeywords: boolean;
  };
}

// Rich vocabulary of tech/business terms
const industryKeywords = [
  'react', 'node', 'javascript', 'typescript', 'python', 'java', 'sql', 'nosql', 'git', 'docker', 'aws', 
  'api', 'state', 'management', 'database', 'system', 'design', 'architecture', 'service', 'client', 
  'server', 'application', 'code', 'function', 'class', 'method', 'component', 'performance', 'indexing', 
  'query', 'product', 'roadmap', 'agile', 'scrum', 'kanban', 'story', 'kpi', 'metrics', 'conversion', 
  'user', 'interview', 'usability', 'design', 'wireframe', 'testing', 'analytics', 'tableau', 'excel', 
  'data', 'model', 'analysis', 'statistics', 'ml', 'ai', 'learning', 'network', 'regression', 
  'classification', 'algorithm', 'complexity', 'scaling', 'scalability', 'security', 'encryption', 
  'framework', 'library', 'development', 'software', 'engineering', 'business', 'strategy', 'execution', 
  'market', 'competitor', 'stakeholder', 'collaboration', 'team', 'project', 'task', 'milestone', 
  'launch', 'release', 'deploy', 'deployment', 'pipeline', 'ci/cd', 'test', 'unittest', 'qa', 
  'automation', 'latency', 'throughput', 'load', 'optimizing', 'optimization', 'clean', 'refactor', 
  'structure', 'context', 'interface', 'variable', 'object', 'loop', 'conditional', 'syntax', 'error', 
  'debug', 'exception', 'stack', 'heap', 'memory', 'cpu', 'process', 'thread', 'concurrency', 
  'asynchronous', 'promise', 'callback', 'async', 'await', 'fetch', 'ajax', 'json', 'xml', 'html', 
  'css', 'dom', 'browser', 'hosting', 'cloud', 'serverless', 'lambda', 'containerization', 'kubernetes', 
  'microservices', 'monolith', 'rest', 'graphql', 'grpc', 'websocket', 'tcp', 'udp', 'http', 'https', 
  'dns', 'ip', 'subnet', 'routing', 'loadbalancer', 'proxy', 'reverseproxy', 'cache', 'caching', 
  'redis', 'memcached', 'cdn', 'replication', 'sharding', 'partitioning', 'consistency', 'availability', 
  'cap', 'acid', 'transaction', 'relational', 'document', 'graph', 'keyvalue', 'columnar', 'search', 
  'elasticsearch', 'lucene', 'fulltext', 'autocomplete', 'fuzzy', 'matching', 'regex', 'pattern', 
  'parsing', 'tokenization', 'validation', 'sanitization', 'oauth', 'jwt', 'session', 'cookie', 'token', 
  'mfa', 'hashing', 'salt', 'hash', 'ssl', 'tls', 'certificate', 'firewall', 'vpn', 'vpc', 'iam', 
  'rbac', 'policy', 'monitoring', 'logging', 'tracing', 'alerting', 'prometheus', 'grafana', 'elk', 
  'splunk', 'datadog', 'sentry', 'apm', 'uptime', 'sla', 'slo', 'sli', 'reliability', 'resilience', 
  'redundancy', 'failover', 'backup', 'restore', 'recovery', 'rto', 'rpo', 'incident', 'postmortem', 
  'rca', 'mitigation', 'resolution', 'patch', 'hotfix', 'version', 'commit', 'push', 'pull', 'merge', 
  'rebase', 'pr', 'pullrequest', 'codeview', 'debt', 'documentation', 'readme', 'sprint', 'backlog', 
  'epic', 'estimation', 'points', 'velocity', 'standup', 'retrospective', 'planning', 'grooming', 
  'triage', 'lean', 'mvp', 'poc', 'prototype', 'mockup', 'flowchart', 'diagram', 'solid', 'dry', 
  'yagni', 'kiss', 'coupling', 'cohesion', 'abstraction', 'encapsulation', 'inheritance', 'polymorphism', 
  'composition', 'di', 'ioc', 'factory', 'singleton', 'observer', 'strategy', 'decorator', 'adapter', 
  'mvc', 'mvvm', 'clean', 'onion', 'hexagonal', 'ddd', 'domain-driven', 'ubiquitous', 'entity', 
  'valueobject', 'aggregate', 'repository', 'bounded', 'context', 'open-source', 'oss', 'dependency', 
  'package', 'sdk', 'endpoint', 'payload', 'request', 'response', 'headers', 'params', 'status', 
  'badrequest', 'unauthorized', 'forbidden', 'notfound', 'conflict', 'internalservererror', 'gateway'
];

export function validateAnswer(answer: string): InterviewValidationResult {
  const trimmed = (answer || '').trim();
  const lowerText = trimmed.toLowerCase();
  
  const words = trimmed.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // 1. Basic length check (< 30 characters)
  const lengthOk = trimmed.length >= 30;

  // 2. Word count check (< 10 words, or reject if only 1-2 words)
  const wordCountOk = wordCount >= 10;

  // 3. Only symbols / punctuation check (e.g. "...", "???", "!!!", "---")
  const hasLettersOrDigits = /[a-zA-Z0-9]/.test(trimmed);

  // 4. Only numbers check
  const notOnlyNumbers = !/^[0-9\s.,\-+()]*$/.test(trimmed);

  // 5. Placeholder text check
  // Reject if the response matches placeholders exactly, or contains them in a very short response
  const placeholders = ["idk", "don't know", "no idea", "test", "asdf", "qwerty", "hello"];
  let noPlaceholders = true;
  placeholders.forEach(ph => {
    if (lowerText === ph) noPlaceholders = false;
    // If response is short (<50 chars) and contains placeholder
    if (trimmed.length < 50 && lowerText.includes(ph)) {
      noPlaceholders = false;
    }
  });

  // 6. Repeated phrases & repeated words check
  let noRepeatedPhrases = true;
  
  // Check continuous letter repetition (e.g. "aaaaaa")
  const continuousRepeatPattern = /([a-zA-Z0-9])\1{4,}/;
  if (continuousRepeatPattern.test(trimmed)) {
    noRepeatedPhrases = false;
  }

  // Check word repeats (e.g. "hello hello hello")
  for (let i = 0; i < words.length - 2; i++) {
    const w1 = words[i].toLowerCase().replace(/[^a-z0-9]/g, '');
    const w2 = words[i+1].toLowerCase().replace(/[^a-z0-9]/g, '');
    const w3 = words[i+2].toLowerCase().replace(/[^a-z0-9]/g, '');
    if (w1 && w1 === w2 && w2 === w3) {
      noRepeatedPhrases = false;
      break;
    }
  }

  // Check unique words ratio
  if (words.length >= 5) {
    const uniqueWords = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')));
    if (uniqueWords.size / words.length < 0.35) {
      noRepeatedPhrases = false;
    }
  }

  // 7. Gibberish check (vowel patterns)
  let noGibberish = true;
  const hasVowels = /[aeiouyAEIOUY]/.test(trimmed);
  if (!hasVowels) {
    noGibberish = false;
  }

  // Check if a substantial amount of words contain no vowels at all
  let vowelLessWords = 0;
  words.forEach(w => {
    const clean = w.toLowerCase().replace(/[^a-z]/g, '');
    if (clean.length > 2 && !/[aeiouy]/.test(clean)) {
      vowelLessWords++;
    }
  });
  if (words.length > 0 && vowelLessWords / words.length > 0.35) {
    noGibberish = false;
  }

  // 8. Technical / Business keywords count check (minimum 2)
  let matchedKeywordsCount = 0;
  const uniqueWordsLower = new Set(words.map(w => w.toLowerCase().replace(/[^a-z0-9-]/g, '')));
  industryKeywords.forEach(kw => {
    if (uniqueWordsLower.has(kw)) {
      matchedKeywordsCount++;
    }
  });
  const hasIndustryKeywords = matchedKeywordsCount >= 2;

  // Compute validation checks summary
  const checks = {
    lengthOk,
    wordCountOk,
    hasLettersOrDigits,
    notOnlyNumbers,
    noPlaceholders,
    noRepeatedPhrases,
    noGibberish,
    hasIndustryKeywords
  };

  // Run hard block checks
  if (!lengthOk || !wordCountOk) {
    return {
      isValid: false,
      confidence: 0,
      error: "Response is too short or does not contain enough meaningful content for evaluation.",
      checks
    };
  }

  const passesAntiCheat = hasLettersOrDigits && notOnlyNumbers && noPlaceholders && noRepeatedPhrases && noGibberish && hasIndustryKeywords;
  if (!passesAntiCheat) {
    return {
      isValid: false,
      confidence: 0,
      error: "Your response does not contain enough meaningful information for evaluation. Please provide a detailed answer.",
      checks
    };
  }

  // 9. Score Confidence Engine Calculation (0-100%)
  let qualityPoints = 0; // max 20
  let keywordPoints = 0; // max 25
  let structurePoints = 0; // max 15
  let depthPoints = 0; // max 25
  let examplePoints = 0; // max 15

  // A. Content Quality (max 20 pts)
  // Cap at 10 if word count is low, penalize filler words
  const fillerWords = ['like', 'um', 'uh', 'actually', 'basically', 'so', 'literally'];
  let fillerCount = 0;
  words.forEach(w => {
    if (fillerWords.includes(w.toLowerCase().replace(/[^a-z]/g, ''))) {
      fillerCount++;
    }
  });
  const baseQuality = wordCount < 25 ? 10 : 20;
  const fillerPenalty = Math.min(10, fillerCount * 2);
  qualityPoints = Math.max(0, baseQuality - fillerPenalty);

  // B. Technical Keywords (max 25 pts)
  if (matchedKeywordsCount >= 5) {
    keywordPoints = 25;
  } else if (matchedKeywordsCount >= 3) {
    keywordPoints = 15;
  } else if (matchedKeywordsCount >= 2) {
    keywordPoints = 8;
  } else {
    keywordPoints = 0;
  }

  // C. Sentence Structure (max 15 pts)
  const hasCapitalStart = /^[A-Z]/.test(trimmed);
  const sentenceEndings = (trimmed.match(/[.!?]/g) || []).length;
  if (sentenceEndings >= 2 && hasCapitalStart) {
    const averageSentenceLength = wordCount / sentenceEndings;
    if (averageSentenceLength >= 8) {
      structurePoints = 15;
    } else {
      structurePoints = 5;
    }
  } else if (sentenceEndings >= 1) {
    structurePoints = 5;
  } else {
    structurePoints = 0;
  }

  // D. Explanation Depth (max 25 pts)
  if (wordCount >= 50) {
    depthPoints = 25;
  } else if (wordCount >= 35) {
    depthPoints = 15;
  } else if (wordCount >= 20) {
    depthPoints = 10;
  } else {
    depthPoints = 0;
  }

  // E. Examples Provided (max 15 pts)
  const exampleIndicators = ['example', 'such as', 'specifically', 'instance', 'e.g.', 'project', 'case', 'experience', 'like', 'for example'];
  let hasExamples = false;
  exampleIndicators.forEach(ind => {
    if (lowerText.includes(ind)) hasExamples = true;
  });
  if (hasExamples) {
    examplePoints = 15;
  } else {
    examplePoints = 0;
  }

  const confidence = qualityPoints + keywordPoints + structurePoints + depthPoints + examplePoints;
  const isValid = confidence >= 40;

  let error: string | undefined = undefined;
  if (!isValid) {
    error = "Your response lacks depth or specific examples. Please try answering again with more detail.";
  }

  return {
    isValid,
    confidence,
    error,
    checks
  };
}
