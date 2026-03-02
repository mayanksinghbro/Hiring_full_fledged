/**
 * Prisma Seed Script
 * Run with: npx prisma db seed
 *
 * This populates the database with colleges, companies, skills,
 * placement drives, and job postings — mirroring the mock data files.
 *
 * Note: Users/Students are NOT seeded here — they are created via
 * the auth sign-up flow so they get proper NextAuth accounts.
 */

const { PrismaClient } = require('@prisma/client')

const db = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // ──────────────────────────────────────────────────────────────
    // COLLEGES
    // ──────────────────────────────────────────────────────────────
    const colleges = await Promise.all([
        db.college.upsert({ where: { id: 'college-iitd' }, update: {}, create: { id: 'college-iitd', name: 'IIT Delhi', city: 'New Delhi', state: 'Delhi', website: 'https://iitd.ac.in' } }),
        db.college.upsert({ where: { id: 'college-nitt' }, update: {}, create: { id: 'college-nitt', name: 'NIT Trichy', city: 'Tiruchirappalli', state: 'Tamil Nadu', website: 'https://nitt.edu' } }),
        db.college.upsert({ where: { id: 'college-bits' }, update: {}, create: { id: 'college-bits', name: 'BITS Pilani', city: 'Pilani', state: 'Rajasthan', website: 'https://bits-pilani.ac.in' } }),
        db.college.upsert({ where: { id: 'college-iiith' }, update: {}, create: { id: 'college-iiith', name: 'IIIT Hyderabad', city: 'Hyderabad', state: 'Telangana', website: 'https://iiit.ac.in' } }),
        db.college.upsert({ where: { id: 'college-dtu' }, update: {}, create: { id: 'college-dtu', name: 'DTU Delhi', city: 'New Delhi', state: 'Delhi', website: 'https://dtu.ac.in' } }),
        db.college.upsert({ where: { id: 'college-iitb' }, update: {}, create: { id: 'college-iitb', name: 'IIT Bombay', city: 'Mumbai', state: 'Maharashtra', website: 'https://iitb.ac.in' } }),
        db.college.upsert({ where: { id: 'college-vit' }, update: {}, create: { id: 'college-vit', name: 'VIT Vellore', city: 'Vellore', state: 'Tamil Nadu', website: 'https://vit.ac.in' } }),
        db.college.upsert({ where: { id: 'college-nsut' }, update: {}, create: { id: 'college-nsut', name: 'NSUT Delhi', city: 'New Delhi', state: 'Delhi', website: 'https://nsut.ac.in' } }),
    ])
    console.log(`✅ Seeded ${colleges.length} colleges`)

    // ──────────────────────────────────────────────────────────────
    // COMPANIES
    // ──────────────────────────────────────────────────────────────
    const companies = await Promise.all([
        db.company.upsert({ where: { name: 'Google' }, update: {}, create: { id: 'company-google', name: 'Google', website: 'https://google.com', industry: 'Technology' } }),
        db.company.upsert({ where: { name: 'Microsoft' }, update: {}, create: { id: 'company-microsoft', name: 'Microsoft', website: 'https://microsoft.com', industry: 'Technology' } }),
        db.company.upsert({ where: { name: 'Amazon' }, update: {}, create: { id: 'company-amazon', name: 'Amazon', website: 'https://amazon.com', industry: 'E-Commerce / Cloud' } }),
        db.company.upsert({ where: { name: 'Flipkart' }, update: {}, create: { id: 'company-flipkart', name: 'Flipkart', website: 'https://flipkart.com', industry: 'E-Commerce' } }),
        db.company.upsert({ where: { name: 'Razorpay' }, update: {}, create: { id: 'company-razorpay', name: 'Razorpay', website: 'https://razorpay.com', industry: 'Fintech' } }),
        db.company.upsert({ where: { name: 'Adobe' }, update: {}, create: { id: 'company-adobe', name: 'Adobe', website: 'https://adobe.com', industry: 'Software' } }),
        db.company.upsert({ where: { name: 'Atlassian' }, update: {}, create: { id: 'company-atlassian', name: 'Atlassian', website: 'https://atlassian.com', industry: 'Software' } }),
        db.company.upsert({ where: { name: 'Zoho' }, update: {}, create: { id: 'company-zoho', name: 'Zoho', website: 'https://zoho.com', industry: 'SaaS' } }),
    ])
    console.log(`✅ Seeded ${companies.length} companies`)

    // ──────────────────────────────────────────────────────────────
    // SKILLS
    // ──────────────────────────────────────────────────────────────
    const skillNames = [
        'React', 'Next.js', 'TypeScript', 'Node.js', 'System Design',
        'Python', 'Java', 'Go', 'MongoDB', 'PostgreSQL',
        'Docker', 'Kubernetes', 'AWS', 'Machine Learning', 'DSA',
        'Django', 'Vue.js', 'Figma', 'Tailwind CSS', 'Apache Spark',
        'Kafka', 'SQL', 'React Native', 'Flutter', 'Terraform',
        'Spring Boot', 'gRPC', 'Redis', 'C++', 'Azure',
    ]

    const skills = await Promise.all(
        skillNames.map(name =>
            db.skill.upsert({ where: { name }, update: {}, create: { name } })
        )
    )
    console.log(`✅ Seeded ${skills.length} skills`)

    // ──────────────────────────────────────────────────────────────
    // PLACEMENT DRIVES
    // ──────────────────────────────────────────────────────────────
    const drives = await Promise.all([
        db.placementDrive.upsert({ where: { id: 'drive-google-iitd' }, update: {}, create: { id: 'drive-google-iitd', collegeId: 'college-iitd', companyId: 'company-google', driveDate: new Date('2026-03-15'), status: 'upcoming', description: 'Google on-campus recruitment — IIT Delhi' } }),
        db.placementDrive.upsert({ where: { id: 'drive-microsoft-iitd' }, update: {}, create: { id: 'drive-microsoft-iitd', collegeId: 'college-iitd', companyId: 'company-microsoft', driveDate: new Date('2026-03-20'), status: 'upcoming', description: 'Microsoft SDE Intern drive — IIT Delhi' } }),
        db.placementDrive.upsert({ where: { id: 'drive-amazon-nitt' }, update: {}, create: { id: 'drive-amazon-nitt', collegeId: 'college-nitt', companyId: 'company-amazon', driveDate: new Date('2026-03-18'), status: 'upcoming', description: 'Amazon SDE-1 drive — NIT Trichy' } }),
        db.placementDrive.upsert({ where: { id: 'drive-flipkart-bits' }, update: {}, create: { id: 'drive-flipkart-bits', collegeId: 'college-bits', companyId: 'company-flipkart', driveDate: new Date('2026-03-10'), status: 'ongoing', description: 'Flipkart Backend Engineer drive — BITS Pilani' } }),
        db.placementDrive.upsert({ where: { id: 'drive-razorpay-iiith' }, update: {}, create: { id: 'drive-razorpay-iiith', collegeId: 'college-iiith', companyId: 'company-razorpay', driveDate: new Date('2026-03-12'), status: 'ongoing', description: 'Razorpay Full Stack Dev drive — IIIT Hyderabad' } }),
    ])
    console.log(`✅ Seeded ${drives.length} placement drives`)

    // ──────────────────────────────────────────────────────────────
    // JOB POSTINGS
    // ──────────────────────────────────────────────────────────────
    const skillMap = Object.fromEntries(skills.map(s => [s.name, s.id]))

    const jobsData = [
        {
            id: 'job-google-sde1', driveId: 'drive-google-iitd', companyId: 'company-google',
            title: 'SDE-1', packageLpa: 32, roleType: 'full_time',
            description: 'Software Development Engineer — full-stack, large-scale distributed systems.',
            requiredSkills: ['DSA', 'System Design', 'React', 'Go', 'Python'],
        },
        {
            id: 'job-microsoft-intern', driveId: 'drive-microsoft-iitd', companyId: 'company-microsoft',
            title: 'SDE Intern', packageLpa: 25, roleType: 'internship',
            description: 'Summer internship — building TypeScript/React features for Microsoft Teams.',
            requiredSkills: ['C++', 'DSA', 'Azure', 'TypeScript'],
        },
        {
            id: 'job-amazon-sde1', driveId: 'drive-amazon-nitt', companyId: 'company-amazon',
            title: 'SDE-1', packageLpa: 28, roleType: 'full_time',
            description: 'Software Development Engineer — distributed systems and Java backend.',
            requiredSkills: ['Java', 'AWS', 'System Design', 'DSA'],
        },
        {
            id: 'job-flipkart-backend', driveId: 'drive-flipkart-bits', companyId: 'company-flipkart',
            title: 'Backend Engineer', packageLpa: 22, roleType: 'full_time',
            description: 'Java/Scala microservices, Kafka, SQL at scale.',
            requiredSkills: ['Java', 'Kafka', 'System Design', 'SQL'],
        },
        {
            id: 'job-razorpay-fullstack', driveId: 'drive-razorpay-iiith', companyId: 'company-razorpay',
            title: 'Full Stack Dev', packageLpa: 18, roleType: 'full_time',
            description: 'React + Go + PostgreSQL in fintech.',
            requiredSkills: ['React', 'Go', 'PostgreSQL', 'Docker'],
        },
        {
            id: 'job-google-senior-fe', driveId: null, companyId: 'company-google',
            title: 'Senior Frontend Developer', packageLpa: 40, roleType: 'full_time',
            description: 'Lead our web applications team and set the standard for frontend excellence.',
            requiredSkills: ['React', 'TypeScript', 'Next.js', 'System Design'],
        },
    ]

    for (const job of jobsData) {
        const { requiredSkills, ...jobFields } = job
        await db.jobPosting.upsert({
            where: { id: job.id },
            update: {},
            create: {
                ...jobFields,
                packageLpa: job.packageLpa,
                requirements: {
                    create: requiredSkills
                        .filter(s => skillMap[s])
                        .map(s => ({ skillId: skillMap[s] })),
                },
            },
        })
    }
    console.log(`✅ Seeded ${jobsData.length} job postings with requirements`)

    console.log('\n🎉 Seed complete!')
}

main()
    .catch(e => { console.error('❌ Seed failed:', e); process.exit(1) })
    .finally(async () => { await db.$disconnect() })
