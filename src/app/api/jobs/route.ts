import { NextRequest, NextResponse } from 'next/server';
import { roleKeywords } from '@/lib/analyzer';

interface ArbeitnowJob {
  slug?: string;
  title?: string;
  company_name?: string;
  location?: string;
  description?: string;
  tags?: string[];
  remote?: boolean;
  url?: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const roleId = searchParams.get('roleId') || 'swe';
    const skillsParam = searchParams.get('skills') || '';
    const userSkills = skillsParam ? skillsParam.split(',').map(s => s.trim().toLowerCase()) : [];

    // Fetch live jobs from Arbeitnow public endpoint
    const response = await fetch('https://www.arbeitnow.com/api/job-board-api', {
      method: 'GET',
      next: { revalidate: 300 } // cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from Arbeitnow: ${response.statusText}`);
    }

    const resData = await response.json();
    const rawJobs = (resData.data || []) as ArbeitnowJob[];

    // Map roleId to common titles / keywords to filter jobs
    const roleMatchMap: Record<string, string[]> = {
      swe: ['software', 'engineer', 'developer', 'programmer', 'fullstack', 'full-stack', 'backend', 'frontend', 'react', 'node'],
      frontend: ['frontend', 'front-end', 'react', 'javascript', 'ui', 'ux', 'css'],
      backend: ['backend', 'back-end', 'node', 'python', 'java', 'go', 'golang', 'databases', 'apis'],
      fullstack: ['fullstack', 'full-stack', 'developer', 'react', 'node'],
      da: ['analyst', 'data analyst', 'business intelligence', 'bi', 'tableau', 'power bi', 'sql'],
      ds: ['data scientist', 'data science', 'statistics', 'machine learning', 'ml', 'python'],
      ai: ['ai', 'artificial intelligence', 'nlp', 'llm', 'langchain', 'generative', 'openai'],
      ml: ['machine learning', 'ml', 'pytorch', 'tensorflow', 'computer vision', 'deep learning'],
      pm: ['product manager', 'product owner', 'agile', 'scrum'],
      ux: ['ux', 'designer', 'product designer', 'user experience', 'figma', 'ui']
    };

    const searchKeywords = roleMatchMap[roleId] || roleMatchMap['swe'];
    const allKeywords = Object.values(roleKeywords).flat();

    // Filter and map jobs
    const matchedJobs = rawJobs
      .filter((job: ArbeitnowJob) => {
        const titleLower = (job.title || '').toLowerCase();
        const tagsLower = (job.tags || []).map((t: string) => t.toLowerCase());

        const matchesTitle = searchKeywords.some(keyword => titleLower.includes(keyword));
        const matchesTags = searchKeywords.some(keyword => tagsLower.some((t: string) => t.includes(keyword)));

        return matchesTitle || matchesTags;
      })
      .map((job: ArbeitnowJob) => {
        const descLower = (job.description || '').toLowerCase();
        const titleLower = (job.title || '').toLowerCase();
        const tags = job.tags || [];

        // Dynamically extract skills required from the description using our global list
        const skillsRequired = new Set<string>();
        
        tags.forEach((tag: string) => {
          if (tag.length > 1 && tag.length < 25) {
            skillsRequired.add(tag);
          }
        });

        allKeywords.forEach(kw => {
          const kwName = kw.name.toLowerCase();
          let matched = false;
          if (descLower.includes(kwName) || titleLower.includes(kwName)) {
            matched = true;
          } else {
            for (const syn of kw.synonyms) {
              if (descLower.includes(syn.toLowerCase())) {
                matched = true;
                break;
              }
            }
          }

          if (matched) {
            skillsRequired.add(kw.name);
          }
        });

        const displaySkills = Array.from(skillsRequired).slice(0, 7);
        if (displaySkills.length === 0) {
          displaySkills.push('JavaScript', 'Git');
        }

        const fitIndicators: string[] = [];
        const lowerDisplaySkills = displaySkills.map(s => s.toLowerCase());
        
        const matchingCount = userSkills.filter(s => lowerDisplaySkills.includes(s)).length;
        if (matchingCount >= 4) {
          fitIndicators.push('High skill match coverage');
        } else if (matchingCount >= 2) {
          fitIndicators.push('Core technical skills aligned');
        }

        if (job.remote) {
          fitIndicators.push('Remote flexibility');
        } else {
          fitIndicators.push('Location alignment');
        }

        if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('sr')) {
          fitIndicators.push('Leadership potential');
        } else {
          fitIndicators.push('Strong growth roadmap');
        }

        return {
          id: job.slug || Math.random().toString(36).substring(2, 9),
          title: job.title || 'Software Position',
          company: job.company_name || 'InnovateTech',
          location: job.location || 'Remote',
          experienceRequired: titleLower.includes('senior') ? '5+ years' : titleLower.includes('lead') ? '7+ years' : '2+ years',
          skillsRequired: displaySkills,
          description: job.description || 'Position details and application guidelines available via link.',
          fitIndicators: fitIndicators.slice(0, 3),
          url: job.url || 'https://www.arbeitnow.com'
        };
      });

    return NextResponse.json({ success: true, jobs: matchedJobs.slice(0, 15) });

  } catch (error) {
    console.error('Error fetching live jobs:', error);
    const errorMsg = error instanceof Error ? error.message : 'Failed to fetch live job listings';
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}
