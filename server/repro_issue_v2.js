const { extractSkills, extractTechnicalSkillsSection } = require('./services/skillExtractionService');

const testText = `
Name: John Doe
Email: john@example.com

TECHNICAL SKILLS:
Programming Languages: Java, Python, C, JavaScript
Web Technologies & Tools: Node.js, REST APIs, React.js, Express.js, HTML, CSS, Git & GitHub, Postman, VS Code
Databases: MongoDB, MySQL

EDUCATION:
BTech in Computer Science
`;

console.log('--- REPRODUCTION SCRIPT V2 ---');
console.log('\n--- Section Extraction ---');
const section = extractTechnicalSkillsSection(testText);
console.log('Extracted Section:\n', section);

console.log('\n--- Skill Extraction ---');
const skills = extractSkills(testText);
console.log('Extracted Skills:', skills);

const requiredSkills = ['node.js', 'express', 'mongodb', 'rest api', 'python', 'git'];
const missing = requiredSkills.filter(req => !skills.includes(req));

console.log('\n--- Analysis ---');
console.log('Required Skills:', requiredSkills);
console.log('Identified Strengths:', skills.filter(s => requiredSkills.includes(s)));
console.log('Unexpected Gaps:', missing);

if (missing.length === 0) {
    console.log('\nSUCCESS: All required skills found.');
} else {
    console.log('\nFAILURE: Missing skills despite being present in text.');
}
