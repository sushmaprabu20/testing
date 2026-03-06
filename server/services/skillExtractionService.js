const skillKeywords = {
    'frontend': [
        'react', 'angular', 'vue', 'javascript', 'typescript', 'html', 'css',
        'sass', 'tailwind', 'next.js', 'redux', 'frontend', 'web development'
    ],
    'backend': [
        'node.js', 'express', 'mongodb', 'mongoose', 'sql', 'postgresql',
        'python', 'django', 'flask', 'java', 'spring boot', 'rest api', 'graphql',
        'backend', 'microservices'
    ],
    'data-science': [
        'python', 'r', 'machine learning', 'data science', 'pandas', 'numpy',
        'scikit-learn', 'tensorflow', 'pytorch', 'sql', 'big data', 'nlp'
    ],
    'devops': [
        'docker', 'kubernetes', 'aws', 'azure', 'cicd', 'jenkins', 'terraform',
        'linux', 'git', 'infrastructure as code', 'monitoring'
    ]
};

// Normalization mapping for variations
const skillNormalization = {
    'rest api': ['rest api', 'rest apis', 'restful api', 'restful apis'],
    'react': ['react', 'react.js', 'reactjs'],
    'node.js': ['node.js', 'nodejs', 'node', 'node js'],
    'mongodb': ['mongodb', 'mongo', 'mongodb atlas'],
    'postgresql': ['postgresql', 'postgres', 'psql', 'pgadmin'],
    'aws': ['aws', 'amazon web services'],
    'express': ['express', 'express.js', 'expressjs'],
    'git': ['git', 'github', 'git & github', 'bitbucket', 'gitlab'],
    'mysql': ['mysql', 'sql server'],
};

const extractTechnicalSkillsSection = (text) => {
    // Look for common headers like "TECHNICAL SKILLS", "SKILLS", "CORE COMPETENCIES"
    const sectionHeaders = [
        'TECHNICAL SKILLS',
        'SKILLS',
        'CORE COMPETENCIES',
        'TECHNOLOGIES',
        'PROFESSIONAL SKILLS'
    ];

    // Headers that definitely mark the end of a skills section
    const nextSectionHeaders = [
        'EDUCATION',
        'EXPERIENCE',
        'PROJECTS',
        'CERTIFICATIONS',
        'LANGUAGES',
        'AWARDS',
        'INTERESTS'
    ];

    const lines = text.split('\n');
    let startIndex = -1;
    let endIndex = lines.length;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim().toUpperCase();
        // Check if line strictly matches or contains a major header
        if (sectionHeaders.some(header => line === header || line.startsWith(header + ':') || line.startsWith(header + ' '))) {
            startIndex = i;
            break;
        }
    }

    if (startIndex === -1) return text; // Return full text if no section found

    // Find the next section or end of text
    for (let i = startIndex + 1; i < lines.length; i++) {
        const line = lines[i].trim().toUpperCase();

        // Stop if we see a definite next section header
        if (nextSectionHeaders.some(header => line === header || line.startsWith(header + ':') || line.startsWith(header + ' '))) {
            endIndex = i;
            break;
        }

        // HEURISTIC: If we see a very long line, it's probably not a header
        if (line.length > 50) continue;

        // HEURISTIC: Stop if we see something that looks like an experience entry (e.g., month year)
        if (/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+\d{4}/i.test(line)) {
            endIndex = i;
            break;
        }
    }

    return lines.slice(startIndex, endIndex).join('\n');
};

const extractSkills = (text) => {
    const foundSkills = new Set();
    const skillsSection = extractTechnicalSkillsSection(text);
    const lowerText = skillsSection.toLowerCase();

    // 1. Check for normalized variations first
    Object.entries(skillNormalization).forEach(([canonical, variations]) => {
        variations.forEach(variation => {
            const escapedVariation = variation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`\\b${escapedVariation}\\b`, 'i');
            if (regex.test(lowerText)) {
                foundSkills.add(canonical);
            }
        });
    });

    // 2. Check for other keywords with plural handling
    Object.values(skillKeywords).flat().forEach(skill => {
        if (foundSkills.has(skill)) return;

        // Escape special characters for regex
        const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Handle optional 's' at the end for simple plurals
        const regex = new RegExp(`\\b${escapedSkill}s?\\b`, 'i');
        if (regex.test(lowerText)) {
            foundSkills.add(skill);
        }
    });

    return Array.from(foundSkills);
};

module.exports = {
    extractSkills,
    skillKeywords,
    extractTechnicalSkillsSection
};
