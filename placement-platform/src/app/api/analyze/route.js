import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `System Role:
You are an elite, highly critical Technical Recruiter and HR Data Analyst. Your job is to strictly evaluate a candidate's resume strictly against a specific Job Description (JD).

Instructions:

1. You will be provided with a complete Job Description (title, description, and required competencies) and Candidate Resume structured data (Specifically: Projects, Work Experience/Internships, and Skills extracted from the resume).

2. You MUST deeply analyze the candidate's specific PROJECTS, EXPERIENCE, and SKILLS to determine how accurately they map directly against the JD requirements and compute a "match_score_out_of_100".

13. The "justification_bullets" MUST be an array of up to 3 short bullet points explaining EXACTLY WHY the candidate was assigned this specific match score. Explicitly state whether their Projects, Experience, and Skills align with the requirements, or if they fall short. Start each bullet with an appropriate emoji (✅ for strengths, ❌ for missing skills, ⚠️ for warnings/weaknesses). DO NOT give generic or vague responses. Cite specific skills or projects listed.

4. For critical_missing_skills: ONLY list skills/technologies that are EXPLICITLY written in the JD's Required Competencies or job description text. Do NOT invent, infer, or add any skills that are not directly mentioned in the JD.

Output Format (Strict JSON):
You must output your analysis in the following strict JSON format. Do not include markdown formatting or outside text.
{
  "match_score_out_of_100": <integer based strictly on JD skill/experience overlap>,
  "key_strengths": ["<Specific matching skill from resume that JD requires>", "..."],
  "critical_missing_skills": ["<Required skill/tech in JD NOT found in resume>", "..."],
  "relevant_projects": ["<Project name from resume — brief reason it's relevant to JD>", "..."],
  "relevant_experience": ["<Internship/role from resume — brief reason it's relevant to JD>", "..."],
  "justification_bullets": ["<✅ Example strength...>", "<❌ Example weakness...>", "<⚠️ Example warning...>"]
}`;

function buildPrompt(jobDescription, resume, competencies) {
    return `Inputs:

=== JOB DESCRIPTION ===
${jobDescription}
=== END JOB DESCRIPTION ===

=== REQUIRED COMPETENCIES (EXACT LIST) ===
${competencies && competencies.length > 0 ? competencies.join(', ') : 'See job description text above'}
=== END REQUIRED COMPETENCIES ===

=== CANDIDATE STRUCTURED DATA ===
Skills Detected:
${resume.skills ? resume.skills.join('\n') : 'None'}

Projects:
${resume.projects ? resume.projects.join('\n') : 'None'}

Experience / Internships:
${resume.experience ? resume.experience.join('\n') : 'None'}
=== END CANDIDATE STRUCTURED DATA ===

IMPORTANT: The REQUIRED COMPETENCIES listed above are the ONLY skills you should check against. For critical_missing_skills, ONLY include items from this exact list that are NOT found in the resume. 
Analyze this candidate's structured data against the job description above. Explicitly explain your ranking score based on what is listed in their Projects, Experience, and Skills.`;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Intelligent fallback: analyze resume text against ONLY the user-provided competencies
function localAnalysis(jobDescription, resume, candidateId, competencies = []) {
    const resumeText = resume.rawText || '';
    const resumeLower = resumeText.toLowerCase();

    // Use ONLY the competencies the user explicitly listed — never invent skills
    const requiredSkills = competencies.map(c => c.toLowerCase());

    const matched = requiredSkills.filter(s => resumeLower.includes(s));
    const missing = requiredSkills.filter(s => !resumeLower.includes(s));

    // Score based on skill overlap against ONLY user-provided competencies
    let score = 0;
    if (requiredSkills.length > 0) {
        score = Math.round((matched.length / requiredSkills.length) * 85) + 10;
    } else {
        score = 50; // No competencies provided, neutral score
    }

    const projectLines = resume.projects || [];
    const experienceLines = resume.experience || [];
    const skillsLines = resume.skills || [];

    // Add some variance based on experience mentions
    if (experienceLines.length > 0) score = Math.min(score + 8, 98);
    if (projectLines.length > 0) score = Math.min(score + 5, 98);

    // Clamp
    score = Math.max(20, Math.min(score, 98));

    const justification = matched.length > 0
        ? `Candidate scored ${score}% because their Projects (${projectLines.length}) and Experience (${experienceLines.length}) show explicit proficiency in ${matched.slice(0, 3).join(', ')}. ${missing.length > 0 ? `However, their skills section lacks ${missing.slice(0, 2).join(' and ')}.` : `Their background covers all required competencies perfectly.`}`
        : `Candidate ranked low (${score}%) because they lack the core technical competencies (${requiredSkills.slice(0, 4).join(', ')}) in their listed skills, projects, and experiences.`;

    return {
        id: candidateId,
        matchScore: score,
        keyStrengths: matched.length > 0 ? matched.slice(0, 5) : [],
        criticalMissingSkills: missing.slice(0, 4),
        relevantProjects: projectLines.slice(0, 3),
        relevantExperience: experienceLines.slice(0, 2),
        justification,
        shortlisted: false,
    };
}

async function analyzeWithRetry(model, jobDescription, resume, index, competencies = [], maxRetries = 2) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const prompt = buildPrompt(jobDescription, resume, competencies);
            const result = await model.generateContent(SYSTEM_PROMPT + '\n\n' + prompt);
            const responseText = result.response.text();

            let analysis;
            try {
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
            } catch (parseErr) {
                console.error(`Parse error resume ${index}, attempt ${attempt}:`, responseText.slice(0, 200));
                if (attempt === maxRetries) throw new Error('JSON parse failed');
                await delay(2000);
                continue;
            }

            return {
                id: resume.id,
                fileName: resume.fileName,
                matchScore: analysis.match_score_out_of_100 || 0,
                keyStrengths: analysis.key_strengths || [],
                criticalMissingSkills: analysis.critical_missing_skills || [],
                relevantProjects: analysis.relevant_projects || [],
                relevantExperience: analysis.relevant_experience || [],
                justification_bullets: analysis.justification_bullets || ['⚠️ No justification provided by AI.'],
                shortlisted: false,
                source: 'gemini',
            };
        } catch (err) {
            console.error(`Attempt ${attempt + 1} failed for resume ${index}:`, err.message?.slice(0, 150));

            if (attempt < maxRetries) {
                let backoffMS = (attempt + 1) * 3000;

                // If Google explicitly tells us how long to wait upon Rate Limit
                const retryMatch = err.message?.match(/retry in (\d+\.?\d*)s/i);
                if (retryMatch && retryMatch[1]) {
                    backoffMS = (parseFloat(retryMatch[1]) + 1) * 1000; // sleep that exact amount of time + 1s padding
                    console.log(`Rate limit detected! Sleeping explicitly for ${backoffMS}ms before retrying...`);
                } else if (err.message?.includes('429') || err.message?.includes('quota')) {
                    backoffMS = 35000; // default long sleep if it's a 429 without explicit time
                    console.log(`429 Quota Exceeded detected. Sleeping for ${backoffMS}ms...`);
                }

                console.log(`Retrying in ${backoffMS}ms...`);
                await delay(backoffMS);
            }
        }
    }

    // All retries failed — gracefully return an error candidate profile
    console.error(`All Gemini analysis retries failed for resume ${index}`);
    return {
        id: resume.id,
        fileName: resume.fileName,
        matchScore: 0,
        keyStrengths: [],
        criticalMissingSkills: [],
        relevantProjects: [],
        relevantExperience: [],
        justification_bullets: [
            '⚠️ SCORE NOT GENERATED: Gemini API rate limit or quota exceeded.',
            '❌ Please wait exactly 1 minute and press "Analyze" again.',
            'ℹ️ Free tier limits (15 Requests/Min). Upgrade to a paid plan for higher limits.'
        ],
        shortlisted: false,
        source: 'gemini-error',
    };
}

export async function POST(request) {
    try {
        const { jobDescription, resumes, competencies = [] } = await request.json();

        if (!jobDescription || !resumes || resumes.length === 0) {
            return NextResponse.json(
                { error: 'Missing jobDescription or resumes' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return NextResponse.json(
                { error: 'Gemini API Key is missing or invalid. Please configure your .env variables to use Gemini analysis.' },
                { status: 401 }
            );
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.3,
                topP: 0.8,
                maxOutputTokens: 2048,
                responseMimeType: 'application/json',
            },
        });

        // Process resumes SEQUENTIALLY with delays to respect rate limits
        const results = [];
        for (let i = 0; i < resumes.length; i++) {
            console.log(`Analyzing resume ${i + 1}/${resumes.length}: ${resumes[i].fileName}`);
            const result = await analyzeWithRetry(model, jobDescription, resumes[i], i, competencies);
            results.push(result);

            // 2s delay between requests for free tier safety
            if (i < resumes.length - 1) {
                await delay(2000);
            }
        }

        // Sort by match score descending
        results.sort((a, b) => b.matchScore - a.matchScore);

        const geminiCount = results.filter((r) => r.source === 'gemini').length;
        const fallbackCount = results.filter((r) => r.source !== 'gemini').length;
        console.log(`Analysis complete: ${geminiCount} via Gemini, ${fallbackCount} via fallback`);

        return NextResponse.json({ candidates: results });
    } catch (err) {
        console.error('Analyze API error:', err);
        return NextResponse.json(
            { error: err.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
