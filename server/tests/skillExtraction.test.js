const { extractSkills, extractTechnicalSkillsSection } = require('../services/skillExtractionService');

function test(name, fn) {
    try {
        fn();
        console.log(`✅ PASS: ${name}`);
    } catch (err) {
        console.error(`❌ FAIL: ${name}`);
        console.error(err);
    }
}

function assertEquals(actual, expected, message) {
    const a = JSON.stringify(actual.sort());
    const e = JSON.stringify(expected.sort());
    if (a !== e) {
        throw new Error(`${message || 'Assertion failed'}: expected ${e}, but got ${a}`);
    }
}

// 1. Test Section Extraction
test('Should extract technical skills section correctly', () => {
    const text = `
NAME: John Doe
EXPERIENCE:
Worked as a developer.
TECHNICAL SKILLS:
- React, Node.js, REST APIs
- MongoDB
EDUCATION:
BS in Computer Science
    `;
    const section = extractTechnicalSkillsSection(text);
    if (!section.includes('React') || section.includes('EDUCATION')) {
        throw new Error('Section extraction failed: ' + section);
    }
});

// 2. Test Skill Extraction with Normalization
test('Should normalize variations of skills', () => {
    const text = `
TECHNICAL SKILLS:
RESTFUL APIS, react.js, nodejs, postgres
    `;
    const skills = extractSkills(text);
    assertEquals(skills, ['rest api', 'react', 'node.js', 'postgresql']);
});

// 3. Test Plural Variations
test('Should handle simple plurals', () => {
    const text = `
TECHNICAL SKILLS:
Javascripts, Pythons, Djangos
    `;
    const skills = extractSkills(text);
    assertEquals(skills, ['javascript', 'python', 'django']);
});

// 4. Test Isolation from other sections
test('Should NOT extract skills from other sections if Technical Skills exists', () => {
    const text = `
TECHNICAL SKILLS:
React, Node.js
EXPERIENCE:
Used Python and Java extensively.
    `;
    const skills = extractSkills(text);
    // Python and Java are in EXPERIENCE, and since we found TECHNICAL SKILLS, 
    // we should only have React and Node.js
    assertEquals(skills, ['react', 'node.js']);
});

console.log('--- Skill Extraction Tests ---');
