import React, { useState } from 'react';
import { Award, Sparkles, X, ChevronRight } from 'lucide-react';

const MentorPrompt = ({ onAccept, onDecline }) => {
    return (
        <div className="card mentor-prompt-card">
            <div className="sparkle-container">
                <Sparkles size={32} color="var(--primary-orange)" />
            </div>
            <div className="prompt-content">
                <h3>Join Our Expert Community!</h3>
                <p>Your analysis shows you have significant expertise. Would you like to become a community mentor and help others on their career journey?</p>
                <div className="prompt-actions">
                    <button className="btn-primary" onClick={onAccept}>
                        Yes, I'd Love to Help! <ChevronRight size={18} />
                    </button>
                    <button className="btn-secondary" onClick={onDecline}>Maybe Later</button>
                </div>
            </div>

            <style jsx>{`
                .mentor-prompt-card {
                    margin: 3rem 0;
                    padding: 2.5rem;
                    background: linear-gradient(135deg, #fff 0%, #fff9f5 100%);
                    display: flex;
                    gap: 2rem;
                    align-items: center;
                    border: 1px solid rgba(255, 87, 34, 0.1);
                    box-shadow: 0 10px 30px rgba(255, 87, 34, 0.05);
                }
                .sparkle-container {
                    background: #fff0eb;
                    padding: 1.5rem;
                    border-radius: 20px;
                }
                .prompt-content h3 {
                    font-size: 1.5rem;
                    margin-bottom: 0.5rem;
                    color: var(--text-main);
                }
                .prompt-content p {
                    color: var(--text-muted);
                    margin-bottom: 1.5rem;
                    font-size: 1.1rem;
                    max-width: 600px;
                }
                .prompt-actions {
                    display: flex;
                    gap: 1.5rem;
                }
                @media (max-width: 640px) {
                    .mentor-prompt-card {
                        flex-direction: column;
                        text-align: center;
                    }
                    .prompt-actions {
                        flex-direction: column;
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
};

export default MentorPrompt;
