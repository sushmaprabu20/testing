const { extractTechnicalSkillsSection } = require('./services/skillExtractionService');

const testText = `
TECHNICAL SKILLS:
REST API
NODE JS
MONGODB
`;

console.log('--- TESTING EARLY SECTION BREAK ---');
const section = extractTechnicalSkillsSection(testText);
console.log('Extracted Section:\n', section);

if (section.trim().split('\n').length <= 2) {
    console.log('\nFAILURE IDENTIFIED: Section extraction stopped early due to all-caps skill.');
} else {
    console.log('\nSUCCESS: Full section extracted.');
}
