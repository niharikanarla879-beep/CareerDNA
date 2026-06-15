import { NextRequest, NextResponse } from 'next/server';

async function fetchWithRetry(url: string, options: RequestInit): Promise<Response> {
  const maxRetries = 3;
  const backoffDurations = [2000, 4000, 8000]; // 2s, 4s, 8s

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      // Retry for 429 (Rate Limit) and 503 (Service Unavailable)
      if ((response.status === 429 || response.status === 503) && attempt < maxRetries) {
        const delay = backoffDurations[attempt];
        console.warn(`Gemini API returned ${response.status}. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      if (attempt < maxRetries) {
        const delay = backoffDurations[attempt];
        console.warn(`Fetch error: ${error instanceof Error ? error.message : String(error)}. Retrying in ${delay / 1000}s... (Attempt ${attempt + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
  
  throw new Error('Max retries exceeded');
}

function generateFallbackSummary(roleName: string, skills: string, companies: string): string {
  const skillsList = skills ? skills.split(',').map(s => s.trim()) : [];
  const companiesList = companies ? companies.split(',').map(c => c.trim()) : [];
  const roleLower = (roleName || '').toLowerCase();
  
  // Data Analyst / Data Scientist
  if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('science')) {
    let summary = `Results-oriented ${roleName || 'Data Analyst'} with hands-on expertise in extracting actionable insights and analyzing complex datasets to drive business decisions. `;
    if (skillsList.length > 0) {
      const skillsStr = skillsList.slice(0, 3).join(', ');
      summary += `Proficient in analytical tools and technologies including ${skillsStr}. `;
    }
    if (companiesList.length > 0) {
      const compStr = companiesList.slice(0, 2).join(' and ');
      summary += `Demonstrated history of driving data excellence and reporting at ${compStr}. `;
    } else {
      summary += `Dedicated to building interactive dashboards, data visualizations, and optimized reporting pipelines. `;
    }
    summary += `Proven ability to collaborate across functional teams to deliver data-driven business growth.`;
    return summary;
  }
  
  // Frontend Developer / UI/UX
  if (roleLower.includes('front') || roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('designer')) {
    let summary = `Results-oriented ${roleName || 'Frontend Developer'} with hands-on expertise in crafting responsive, high-performance user interfaces and premium user experiences. `;
    if (skillsList.length > 0) {
      const skillsStr = skillsList.slice(0, 3).join(', ');
      summary += `Proficient in key frontend technologies including ${skillsStr}. `;
    }
    if (companiesList.length > 0) {
      const compStr = companiesList.slice(0, 2).join(' and ');
      summary += `Demonstrated history of driving front-end excellence and visual consistency at ${compStr}. `;
    } else {
      summary += `Dedicated to building clean, accessible component libraries and implementing optimized UI/UX design patterns. `;
    }
    summary += `Proven ability to collaborate across functional teams to deliver seamless and engaging client-side experiences.`;
    return summary;
  }
  
  // Backend Developer / Cloud
  if (roleLower.includes('back') || roleLower.includes('cloud') || roleLower.includes('devops') || roleLower.includes('system')) {
    let summary = `Results-oriented ${roleName || 'Backend Developer'} with hands-on expertise in architecting scalable backend systems, server-side logic, and database designs. `;
    if (skillsList.length > 0) {
      const skillsStr = skillsList.slice(0, 3).join(', ');
      summary += `Proficient in server technologies and databases including ${skillsStr}. `;
    }
    if (companiesList.length > 0) {
      const compStr = companiesList.slice(0, 2).join(' and ');
      summary += `Demonstrated history of driving microservices excellence and API scalability at ${compStr}. `;
    } else {
      summary += `Dedicated to building secure, maintainable server structures and implementing optimized database queries. `;
    }
    summary += `Proven ability to collaborate across functional teams to deliver robust and high-availability systems.`;
    return summary;
  }

  // Default / Software Engineer
  let summary = `Results-oriented ${roleName || 'Software Engineer'} with hands-on expertise in developing high-performance applications and end-to-end software solutions. `;
  if (skillsList.length > 0) {
    const skillsStr = skillsList.slice(0, 3).join(', ');
    summary += `Proficient in key technologies including ${skillsStr}. `;
  }
  if (companiesList.length > 0) {
    const compStr = companiesList.slice(0, 2).join(' and ');
    summary += `Demonstrated history of driving technical excellence at ${compStr}. `;
  } else {
    summary += `Dedicated to building clean, maintainable codebases and implementing scalable software design patterns. `;
  }
  summary += `Proven ability to collaborate across functional teams to deliver optimized customer experiences.`;
  return summary;
}

function generateFallbackBullet(roleName: string, company: string, title: string, description: string, skills: string[]): string {
  const cleanSkills = skills ? skills.filter(Boolean) : [];
  const roleLower = (roleName || '').toLowerCase();
  
  // Data Analyst / Data Scientist
  if (roleLower.includes('data') || roleLower.includes('analyst') || roleLower.includes('science')) {
    const verb = (title || '').toLowerCase().includes('lead') || (title || '').toLowerCase().includes('senior') ? 'Spearheaded' : 'Analyzed';
    let bullet = `${verb} core datasets and implemented key business intelligence solutions as a ${title || 'Analyst'} at ${company || 'TechCorp'}. `;
    if (cleanSkills.length > 0) {
      bullet += `Leveraged ${cleanSkills.slice(0, 3).join(', ')} to design interactive dashboards, automate reports, and uncover operational insights. `;
    }
    if (description && description.trim().length > 10) {
      bullet += `Contributed to data strategy goals by resolving reporting bottlenecks and driving analytical standards.`;
    } else {
      bullet += `Optimized query efficiency and improved dashboard load times for critical business metrics.`;
    }
    return bullet;
  }

  // Frontend Developer / UI/UX
  if (roleLower.includes('front') || roleLower.includes('ui') || roleLower.includes('ux') || roleLower.includes('designer')) {
    const verb = (title || '').toLowerCase().includes('lead') || (title || '').toLowerCase().includes('senior') ? 'Spearheaded' : 'Designed';
    let bullet = `${verb} user interfaces and implemented key responsive frontend components as a ${title || 'Frontend Developer'} at ${company || 'TechCorp'}. `;
    if (cleanSkills.length > 0) {
      bullet += `Leveraged ${cleanSkills.slice(0, 3).join(', ')} to optimize load speeds, build accessible layouts, and integrate client-side logic. `;
    }
    if (description && description.trim().length > 10) {
      bullet += `Contributed to design alignment by resolving layout bottlenecks and driving UI engineering standards.`;
    } else {
      bullet += `Optimized client-side performance and improved user satisfaction ratings for critical application screens.`;
    }
    return bullet;
  }

  // Backend Developer / Cloud
  if (roleLower.includes('back') || roleLower.includes('cloud') || roleLower.includes('devops') || roleLower.includes('system')) {
    const verb = (title || '').toLowerCase().includes('lead') || (title || '').toLowerCase().includes('senior') ? 'Spearheaded' : 'Architected';
    let bullet = `${verb} core server-side logic and implemented key database/API schema structures as a ${title || 'Backend Developer'} at ${company || 'TechCorp'}. `;
    if (cleanSkills.length > 0) {
      bullet += `Leveraged ${cleanSkills.slice(0, 3).join(', ')} to build secure endpoints, manage databases, and scale service microservices. `;
    }
    if (description && description.trim().length > 10) {
      bullet += `Contributed to backend architecture by resolving pipeline bottlenecks and driving scalable code standards.`;
    } else {
      bullet += `Optimized database query performance and improved service uptime metrics for critical API flows.`;
    }
    return bullet;
  }

  // Default / Software Engineer
  const verb = (title || '').toLowerCase().includes('lead') || (title || '').toLowerCase().includes('senior') ? 'Spearheaded' : 'Engineered';
  let bullet = `${verb} core initiatives and implemented key system enhancements as a ${title || 'Developer'} at ${company || 'TechCorp'}. `;
  if (cleanSkills.length > 0) {
    bullet += `Leveraged ${cleanSkills.slice(0, 3).join(', ')} to design, test, and build key software features. `;
  }
  if (description && description.trim().length > 10) {
    bullet += `Contributed to development goals by resolving bottlenecks and driving engineering standards.`;
  } else {
    bullet += `Optimized system performance and improved codebase maintainability for critical application modules.`;
  }
  return bullet;
}

interface ChatMessageContext {
  sender: string;
  text: string;
}

interface ProfileContextData {
  profile?: {
    firstName?: string;
    lastName?: string;
    currentJob?: string;
    educationLevel?: string;
    experienceYears?: string | number;
  };
  assessment?: unknown;
  resumeScore?: number;
  missingSkills?: string[];
  roadmapProgressPercent?: number;
  projectsCount?: number;
  certsCount?: number;
  interviewScore?: number;
  targetRole?: string;
}

function generateFallbackCounselorResponse(messages: ChatMessageContext[], context: ProfileContextData): string {
  const lastUserMsg = messages[messages.length - 1]?.text?.toLowerCase() || '';
  const {
    profile,
    resumeScore,
    missingSkills = [],
    roadmapProgressPercent = 0,
    projectsCount = 0,
    certsCount = 0,
    interviewScore,
    targetRole = 'Software Engineer'
  } = context || {};

  const name = profile?.firstName || 'Candidate';
  const role = targetRole;

  if (lastUserMsg.includes('ready') || lastUserMsg.includes('job readiness') || lastUserMsg.includes('job-ready') || lastUserMsg.includes('readiness')) {
    const remaining = missingSkills.length;
    return `Hello **${name}**! Let's check your job readiness for a **${role}** role.
    
Currently:
- Your learning roadmap is **${roadmapProgressPercent}%** complete.
- You have **${remaining}** missing skill gap(s) remaining: **${missingSkills.join(', ') || 'None'}**.
- You have completed **${projectsCount}** projects and **${certsCount}** certifications.
    
To become fully competitive, I recommend finishing your remaining roadmap milestones to resolve outstanding skill gaps. This will immediately improve your Job Readiness score!`;
  }

  if (lastUserMsg.includes('learn') || lastUserMsg.includes('skill') || lastUserMsg.includes('gap') || lastUserMsg.includes('roadmap') || lastUserMsg.includes('milestone')) {
    if (missingSkills.length > 0) {
      const primarySkill = missingSkills[0];
      return `Based on your profile gaps for a **${role}** role, your highest priority skill to learn next is **${primarySkill}**.
      
I suggest opening the **${primarySkill}** Learning Roadmap and completing the recommended courses. Once you finish the learning modules and mark them complete:
1. Your skill gap for **${primarySkill}** will be resolved.
2. Your Job Readiness score will increase.
3. Your composite DNA score will improve as the skill gap penalty is removed.`;
    } else {
      return `Excellent work, **${name}**! You have resolved all critical skill gaps for your target role. You should focus on polishing your resume, mock interview practice, or adding more advanced certifications.`;
    }
  }

  if (lastUserMsg.includes('project') || lastUserMsg.includes('portfolio') || lastUserMsg.includes('github')) {
    const skillList = missingSkills.length > 0 ? missingSkills : ['React', 'Node.js', 'System Design'];
    return `Building portfolio projects is key to proving your hands-on capability, **${name}**.
    
You have **${projectsCount}** project(s) listed. To target the **${role}** role, try building an interactive full-stack project utilizing **${skillList.slice(0, 2).join(' or ')}**.
    
Ensure your projects:
- Have a clean README with architecture diagrams.
- Are hosted live on Vercel, Netlify, or AWS.
- Highlight performance metrics (e.g. 'reduced load time by 30%').`;
  }

  if (lastUserMsg.includes('resume') || lastUserMsg.includes('ats') || lastUserMsg.includes('score')) {
    return `Your resume ATS audit score is **${resumeScore || 0}/100**.
    
To raise this score:
1. Integrate missing keywords like **${missingSkills.slice(0, 3).join(', ') || 'relevant industry stacks'}** in your experience section.
2. Rewrite job descriptions using strong action verbs (e.g. *engineered*, *implemented*) followed by quantified achievements.
3. Ensure clean formatting using one of our resume builder templates (Classic, Minimal, or Glass).`;
  }

  if (lastUserMsg.includes('cert') || lastUserMsg.includes('credential') || lastUserMsg.includes('degree')) {
    return `Credentials and certifications help validate your skillset. You currently have **${certsCount}** certification(s).
    
For a **${role}** career path, targeting certifications like AWS Certified Cloud Practitioner, Microsoft Certified, or specialized developer certificates will strengthen your profile.`;
  }

  if (lastUserMsg.includes('interview') || lastUserMsg.includes('coach') || lastUserMsg.includes('practice')) {
    return `Preparing for interviews is critical, **${name}**.
    
Your current mock interview score is **${interviewScore ? `${interviewScore}/100` : 'not recorded yet'}**.
    
Here is a checklist for success:
- Use the **STAR method** (Situation, Task, Action, Result) for all technical and situational scenarios.
- Speak clearly and aim to minimize filler words.
- Head to our **AI Interview Coach** page to practice real-time speech-to-text behavioral questions!`;
  }

  return `Hello **${name}**! As your CareerDNA AI Counselor, I'm here to support your journey to becoming a job-ready **${role}**.
  
Currently, your composite DNA score is **${resumeScore ? resumeScore : 50}/100**.
What would you like to focus on next? We can dive into:
- **Skill gaps** and roadmap milestones (Missing: **${missingSkills.join(', ') || 'None'}**)
- **Projects** and portfolio development
- **Resume optimization** and ATS scores
- **Mock interview prep** and speech feedback`;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    const body = await req.json();
    const { action } = body;

    if (action === 'generate_summary') {
      const { roleName, skills, companies } = body;
      try {
        if (!apiKey) {
          throw new Error('Gemini API key is not configured');
        }

        const prompt = `You are a professional resume writer. Write a compelling, ATS-friendly professional summary (2-3 sentences, maximum 60 words) for a candidate targeting a "${roleName}" role.
Skills to highlight: ${skills || 'none specified'}
Prior companies/experience: ${companies || 'none specified'}

Guidelines:
- Write in third-person or active professional voice.
- Be highly specific and outcome-oriented.
- DO NOT use generic placeholders or markdown headings.
- Return ONLY the raw plain text summary. No introductory comments, no markdown code block backticks.`;

        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const resData = await response.json();
        const summaryText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const cleanSummary = summaryText.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');

        return NextResponse.json({ success: true, text: cleanSummary, isOfflineMode: false });
      } catch (error) {
        console.warn('Fallback triggered for generate_summary:', error);
        const fallbackText = generateFallbackSummary(roleName, skills, companies);
        return NextResponse.json({ success: true, text: fallbackText, isOfflineMode: true });
      }
    }

    if (action === 'generate_bullets') {
      const { roleName, company, title, description, skills } = body;
      try {
        if (!apiKey) {
          throw new Error('Gemini API key is not configured');
        }

        const prompt = `You are a professional resume writer. Write a high-impact, results-oriented bullet point describing a key achievement for a candidate working as a "${title}" at "${company}".
Role targeted: ${roleName}
Description of work: ${description || 'general development and programming'}
Skills used: ${skills ? skills.join(', ') : 'none specified'}

Guidelines:
- Start with a strong action verb (e.g. engineered, optimized, spearheaded, architected).
- Focus on concrete outcomes and incorporate metrics if implied (e.g., "reducing latency by 15%", "improving performance by 20%").
- Keep it to 1 sentence (maximum 30 words).
- Return ONLY the raw bullet point text. Do not prefix with a bullet character, dash, or quotes.
- No markdown code blocks.`;

        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        });

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const resData = await response.json();
        const bulletText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
        const cleanBullet = bulletText.replace(/^[\s\-\*•]+/, '').replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');

        return NextResponse.json({ success: true, text: cleanBullet, isOfflineMode: false });
      } catch (error) {
        console.warn('Fallback triggered for generate_bullets:', error);
        const fallbackText = generateFallbackBullet(roleName, company, title, description, skills);
        return NextResponse.json({ success: true, text: fallbackText, isOfflineMode: true });
      }
    }

    if (action === 'counselor_chat') {
      const { messages, context } = body;
      const {
        profile,
        assessment,
        resumeScore,
        missingSkills,
        roadmapProgressPercent,
        projectsCount,
        certsCount,
        interviewScore,
        targetRole
      } = context;

      try {
        if (!apiKey) {
          throw new Error('Gemini API key is not configured');
        }

        const profileContext = `
CANDIDATE PROFILE CONTEXT:
- Target Career Role: ${targetRole || 'Software Engineer'}
- Candidate Name: ${profile?.firstName || 'User'} ${profile?.lastName || ''}
- Current Job: ${profile?.currentJob || 'Not specified'}
- Education: ${profile?.educationLevel || 'Not specified'}
- Experience Years: ${profile?.experienceYears || 'Not specified'}
- Resume ATS Score: ${resumeScore ? `${resumeScore}/100` : 'Not uploaded'}
- Completed Projects: ${projectsCount || 0}
- Completed Certifications: ${certsCount || 0}
- Mock Interview Avg Score: ${interviewScore ? `${interviewScore}/100` : 'Not taken'}
- Learning Roadmap Completion: ${roadmapProgressPercent || 0}%
- Missing Skills Gaps: ${missingSkills ? missingSkills.join(', ') : 'None'}
- RIASEC assessment results: ${assessment?.taken ? JSON.stringify(assessment.riasec) : 'Not taken'}
- Career Values priorities: ${assessment?.taken ? JSON.stringify(assessment.values) : 'Not taken'}
- Personality Traits (Big Five): ${assessment?.taken ? JSON.stringify(assessment.personality) : 'Not taken'}
`;

        const systemInstruction = `You are the CareerDNA AI Counselor, a warm, professional, and data-driven career mentor.
You analyze the candidate's assessments, resume ATS audits, portfolio projects, certifications, and mock interview performance to guide them systematically.
Always use the provided CANDIDATE PROFILE CONTEXT to tailor your answers. Speak to the candidate by their name if available.
Keep your responses concise, highly encouraging, action-oriented, and structured. Focus on recommending what skill they should learn next, what project they should build, or how to prepare for interviews.
Do not make up fake details about their profile; rely strictly on the provided context statistics. Format key terms and statistics in **bold**.`;

        const formattedContents = messages.map((m: { sender: string; text: string }) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }]
        }));

        const payload = {
          systemInstruction: {
            parts: [{ text: `${systemInstruction}\n\n${profileContext}` }]
          },
          contents: formattedContents
        };

        const response = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const resData = await response.json();
        const replyText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

        return NextResponse.json({ success: true, text: replyText, isOfflineMode: false });
      } catch (error) {
        console.warn('Fallback triggered for counselor_chat:', error);
        const fallbackText = generateFallbackCounselorResponse(messages, context);
        return NextResponse.json({ success: true, text: fallbackText, isOfflineMode: true });
      }
    }

    return NextResponse.json({ success: false, error: 'Unknown action parameter' }, { status: 400 });

  } catch (error) {
    console.error('Error in AI Route Handler:', error);
    const errorMsg = error instanceof Error ? error.message : 'Server error during AI generation';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
