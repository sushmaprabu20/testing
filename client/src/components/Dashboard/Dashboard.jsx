import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import Loader from '../Loader/Loader';
import UploadSection from './UploadSection';
import AnalysisResults from './AnalysisResults';
import CoursesSection from './CoursesSection';
import MentorSection from './MentorSection';
import MentorPrompt from './MentorPrompt';
import MentorRegistration from './MentorRegistration';

import './Dashboard.css';

const Dashboard = () => {
    const [analysis, setAnalysis] = useState(null);
    const [assessment, setAssessment] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showMentorPrompt, setShowMentorPrompt] = useState(false);
    const [showMentorReg, setShowMentorReg] = useState(false);

    const handleUploadSuccess = (data) => {
        setAnalysis(data.analysis);
        setAssessment(data.assessment);

        // Show mentor prompt after 2 seconds if match score is descent
        if (data.assessment.readinessScore > 50) {
            setTimeout(() => setShowMentorPrompt(true), 2000);
        }
    };

    return (
        <div className="dashboard-container">
            {loading && <Loader />}

            {showMentorReg && (
                <MentorRegistration
                    onComplete={() => {
                        setShowMentorReg(false);
                        alert('Congratulations! You are now a community mentor.');
                    }}
                    onCancel={() => setShowMentorReg(false)}
                />
            )}

            <div className="dashboard-header">
                <h1>Career Intelligence Dashboard</h1>
                <p>Track your progress and map your transition to {assessment ? assessment.targetCareer : 'your dream role'}</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-main">
                    {!assessment ? (
                        <UploadSection onUploadStart={() => setLoading(true)} onUploadSuccess={(data) => {
                            setLoading(false);
                            handleUploadSuccess(data);
                        }} onUploadError={() => setLoading(false)} />
                    ) : (
                        <AnalysisResults
                            assessment={assessment}
                            analysis={analysis}
                            onReset={() => {
                                setAssessment(null);
                                setAnalysis(null);
                                setShowMentorPrompt(false);
                            }}
                        />
                    )}

                    {showMentorPrompt && !showMentorReg && (
                        <MentorPrompt
                            onAccept={() => {
                                setShowMentorPrompt(false);
                                setShowMentorReg(true);
                            }}
                            onDecline={() => setShowMentorPrompt(false)}
                        />
                    )}

                    {assessment && (
                        <>
                            <CoursesSection missingSkills={assessment.missingSkills} />
                            <MentorSection
                                targetCareer={assessment.targetCareer}
                                skillGaps={assessment.missingSkills}
                            />
                        </>
                    )}

                </div>
            </div>
        </div>
    );
};

export default Dashboard;
