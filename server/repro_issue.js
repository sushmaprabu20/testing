const { extractSkills } = require('./services/skillExtractionService');

const testText = `
TECHNICAL SKILLS:
- Languages: JavaScript, Python
- Web Technologies: React, Node.js, REST APIs, HTML/CSS
- Database: MongoDB, PostgreSQL
`;

console.log('Testing skill extraction with text containing "REST APIs"...');
const skills = extractSkills(testText);
console.log('Extracted skills:', skills);

const hasRestApi = skills.some(s => s.toLowerCase() === 'rest api');
if (hasRestApi) {
    console.log('SUCCESS: "rest api" was extracted.');
} else {
    console.log('FAILURE: "rest api" was NOT extracted.');
}

const testText2 = `
Experience:
Worked on REST API development.
`;

console.log('\nTesting with "REST API" (singular)...');
const skills2 = extractSkills(testText2);
console.log('Extracted skills:', skills2);

const hasRestApi2 = skills2.some(s => s.toLowerCase() === 'rest api');
if (hasRestApi2) {
    console.log('SUCCESS: "rest api" was extracted.');
} else {
    console.log('FAILURE: "rest api" was NOT extracted.');
}
