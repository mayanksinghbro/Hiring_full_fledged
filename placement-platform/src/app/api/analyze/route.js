import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `System Role:
You are an elite, highly critical Technical Recruiter and HR Data Analyst. Your job is to evaluate a candidate's resume strictly against a specific Job Description (JD).

Instructions:

You will be provided with a Job Description and a Candidate Resume.

You must compare the candidate's actual skills, experience, and projects directly against the competencies required in the JD.

DO NOT give a generic positive response. If the candidate lacks a required skill mentioned in the JD, you must explicitly state it.

If the JD changes, your analysis must drastically change to reflect the new requirements.

Output Format (Strict JSON):
You must output your analysis in the following strict JSON format. Do not include markdown formatting or outside text.
{
"match_score_out_of_100": [Insert integer based strictly on skill overlap],
"key_strengths": ["[Specific matching skill 1]", "[Specific matching skill 2]"],
"critical_missing_skills": ["[Required skill in JD not found in resume]"],
"justification": "[A crisp, 2-sentence explanation of exactly why they got this score for THIS specific job.]"
}`;

function buildPrompt(jobDescription, resumeText) {
    return `Inputs:
Job Description:
"""
${jobDescription}
"""

Candidate Resume:
"""
${resumeText}
"""`;
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// Intelligent fallback: analyze resume text against JD keywords locally
function localAnalysis(jobDescription, resumeText, candidateId) {
    const jdLower = jobDescription.toLowerCase();
    const resumeLower = resumeText.toLowerCase();

    // Extract skills from JD
    const commonSkills = [
        'react', 'next.js', 'typescript', 'javascript', 'python', 'java', 'go', 'c++',
        'node.js', 'express', 'django', 'flask', 'spring boot',
        'aws', 'gcp', 'azure', 'docker', 'kubernetes', 'terraform',
        'postgresql', 'mongodb', 'redis', 'mysql', 'dynamodb',
        'system design', 'data structures', 'algorithms', 'machine learning',
        'pytorch', 'tensorflow', 'react native', 'flutter', 'swift',
        'graphql', 'rest api', 'microservices', 'ci/cd', 'jenkins',
        'figma', 'tailwind', 'vue.js', 'svelte', 'angular',
        'kafka', 'rabbitmq', 'elasticsearch', 'prometheus', 'grafana',
        'git', 'linux', 'sql', 'nosql', 'agile', 'scrum',
    ];

    const jdSkills = commonSkills.filter((s) => jdLower.includes(s));
    const resumeSkills = commonSkills.filter((s) => resumeLower.includes(s));

    const matched = jdSkills.filter((s) => resumeSkills.includes(s));
    const missing = jdSkills.filter((s) => !resumeSkills.includes(s));
    const extras = resumeSkills.filter((s) => !jdSkills.includes(s));

    // Score based on skill overlap
    let score = 0;
    if (jdSkills.length > 0) {
        score = Math.round((matched.length / jdSkills.length) * 80) + Math.min(extras.length * 2, 15);
    } else {
        score = Math.min(50 + resumeSkills.length * 3, 85);
    }

    // Add some variance based on experience mentions
    const hasInternship = resumeLower.includes('intern');
    const hasProject = resumeLower.includes('project');
    const hasContributions = resumeLower.includes('open source') || resumeLower.includes('contribution');
    if (hasInternship) score = Math.min(score + 5, 98);
    if (hasProject) score = Math.min(score + 3, 98);
    if (hasContributions) score = Math.min(score + 3, 98);

    // Clamp
    score = Math.max(20, Math.min(score, 98));

    const justification = matched.length > 0
        ? `Candidate demonstrates strong alignment with ${matched.slice(0, 3).join(', ')} skills required for this role. ${missing.length > 0 ? `However, lacks ${missing.slice(0, 2).join(' and ')} which are critical requirements.` : 'Shows comprehensive coverage of the required tech stack.'}`
        : `Candidate's skill profile has limited overlap with the specific requirements of this JD. ${extras.length > 0 ? `Brings strong ${extras.slice(0, 2).join(', ')} skills but these don't align with core role needs.` : 'Resume needs stronger alignment with the listed competencies.'}`;

    return {
        id: candidateId,
        matchScore: score,
        keyStrengths: matched.length > 0 ? matched.slice(0, 5) : extras.slice(0, 3),
        criticalMissingSkills: missing.slice(0, 4),
        justification,
        shortlisted: false,
    };
}

async function analyzeWithRetry(model, jobDescription, resume, index, maxRetries = 2) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            const prompt = buildPrompt(jobDescription, resume.text);
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
                justification: analysis.justification || 'No justification provided.',
                shortlisted: false,
                source: 'gemini',
            };
        } catch (err) {
            console.error(`Attempt ${attempt + 1} failed for resume ${index}:`, err.message?.slice(0, 100));
            if (attempt < maxRetries) {
                const backoff = (attempt + 1) * 3000;
                console.log(`Retrying in ${backoff}ms...`);
                await delay(backoff);
            }
        }
    }

    // All retries failed — use intelligent local fallback
    console.log(`Using local analysis fallback for resume ${index}`);
    return {
        ...localAnalysis(jobDescription, resume.text, resume.id),
        fileName: resume.fileName,
        source: 'local-fallback',
    };
}

export async function POST(request) {
    try {
        const { jobDescription, resumes } = await request.json();

        if (!jobDescription || !resumes || resumes.length === 0) {
            return NextResponse.json(
                { error: 'Missing jobDescription or resumes' },
                { status: 400 }
            );
        }

        const apiKey = process.env.GEMINI_API_KEY?.trim();

        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            // No API key — use local analysis for all resumes
            console.log('No Gemini API key configured, using local analysis');
            const results = resumes.map((resume, i) => ({
                ...localAnalysis(jobDescription, resume.text, resume.id),
                fileName: resume.fileName,
                source: 'local-no-key',
            }));
            results.sort((a, b) => b.matchScore - a.matchScore);
            return NextResponse.json({ candidates: results });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            generationConfig: {
                temperature: 0.3,
                topP: 0.8,
                maxOutputTokens: 1024,
                responseMimeType: 'application/json',
            },
        });

        // Process resumes SEQUENTIALLY with delays to respect rate limits
        const results = [];
        for (let i = 0; i < resumes.length; i++) {
            console.log(`Analyzing resume ${i + 1}/${resumes.length}: ${resumes[i].fileName}`);
            const result = await analyzeWithRetry(model, jobDescription, resumes[i], i);
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
