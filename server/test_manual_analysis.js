const { extractSkills } = require('./services/skillExtractionService');
const careerConfig = require('./config/careerConfig');

// Mocking the core logic from controller for verification
async function testManualAnalysisLogic(targetCareer, manualSkills) {
    console.log(`--- Testing Manual Analysis Logic ---`);
    console.log(`Target Career: ${targetCareer}`);
    console.log(`Input Skills: ${manualSkills}`);

    const extractedSkills = extractSkills(manualSkills);
    console.log(`Normalized/Extracted Skills:`, extractedSkills);

    const requiredSkills = careerConfig[targetCareer];
    const matchedSkills = extractedSkills.filter(skill =>
        requiredSkills.some(reqSkill => reqSkill.toLowerCase() === skill.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(reqSkill =>
        !extractedSkills.some(skill => skill.toLowerCase() === reqSkill.toLowerCase())
    );

    const readinessScore = Math.round((matchedSkills.length / requiredSkills.length) * 100);

    console.log('\nResults:');
    console.log(`Matched: ${matchedSkills.join(', ')}`);
    console.log(`Missing: ${missingSkills.join(', ')}`);
    console.log(`Score: ${readinessScore}%`);

    if (matchedSkills.length > 0 && readinessScore > 0) {
        console.log('\n✅ SUCCESS: Logic correctly identified and scored skills.');
    } else {
        console.log('\n❌ FAILURE: Skills not identified correctly.');
    }
}

// Test with Backend Developer requirements
// Required: node.js, express, mongodb, sql, rest api, python, git
testManualAnalysisLogic('Backend Developer', 'Node.js, Express, MongoDB, Git');
