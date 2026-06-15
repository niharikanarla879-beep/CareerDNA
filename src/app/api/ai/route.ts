import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'Gemini API key is not configured in .env.local. Please add GEMINI_API_KEY=your_api_key and restart the server.'
      }, { status: 400 });
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'generate_summary') {
      const { roleName, skills, companies } = body;
      const prompt = `You are a professional resume writer. Write a compelling, ATS-friendly professional summary (2-3 sentences, maximum 60 words) for a candidate targeting a "${roleName}" role.
Skills to highlight: ${skills || 'none specified'}
Prior companies/experience: ${companies || 'none specified'}

Guidelines:
- Write in third-person or active professional voice.
- Be highly specific and outcome-oriented.
- DO NOT use generic placeholders or markdown headings.
- Return ONLY the raw plain text summary. No introductory comments, no markdown code block backticks.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error: ${errText}`);
      }

      const resData = await response.json();
      const summaryText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleanSummary = summaryText.replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');

      return NextResponse.json({ success: true, text: cleanSummary });
    } 
    
    if (action === 'generate_bullets') {
      const { roleName, company, title, description, skills } = body;
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

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error: ${errText}`);
      }

      const resData = await response.json();
      const bulletText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      const cleanBullet = bulletText.replace(/^[\s\-\*•]+/, '').replace(/^```[a-z]*\n/i, '').replace(/\n```$/, '');

      return NextResponse.json({ success: true, text: cleanBullet });
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

      const formattedContents = messages.map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const payload = {
        systemInstruction: {
          parts: [{ text: `${systemInstruction}\n\n${profileContext}` }]
        },
        contents: formattedContents
      };

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Gemini API error: ${errText}`);
      }

      const resData = await response.json();
      const replyText = resData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

      return NextResponse.json({ success: true, text: replyText });
    }

    return NextResponse.json({ success: false, error: 'Unknown action parameter' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in AI Route Handler:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server error during AI generation' }, { status: 500 });
  }
}
