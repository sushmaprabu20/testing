import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Filter, Sparkles, MessageSquare, Briefcase } from 'lucide-react';
import './Experts.css'; // Reusing Experts.css as base

const MentorSection = ({ targetCareer, skillGaps }) => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await api.post('/mentors/recommendations', { targetCareer, skillGaps });
                setMentors(res.data);
            } catch (err) {
                console.error('Error fetching mentors:', err);
            } finally {
                setLoading(false);
            }
        };

        if (targetCareer) fetchMentors();
    }, [targetCareer, skillGaps]);

    if (loading) return <div className="loader">Finding Community Mentors...</div>;
    if (mentors.length === 0) return null;

    return (
        <div className="experts-section community-mentors">
            <div className="recommendations-block">
                <div className="section-title">
                    <Sparkles size={24} color="var(--primary-orange)" />
                    <h2>Recommended Community Mentors</h2>
                </div>
                <p className="section-desc">Connect with users who have successfully transitioned to {targetCareer} and can guide you through your skill gaps.</p>

                <div className="experts-grid">
                    {mentors.map(mentor => (
                        <div key={mentor._id} className="expert-card card">
                            <div className="expert-header">
                                <div className="expert-photo-placeholder">
                                    {mentor.user.name.charAt(0)}
                                </div>
                                <div className="expert-info">
                                    <h3>{mentor.user.name}</h3>
                                    <div className="expert-role-badge">{mentor.mentorProfile.currentRole}</div>
                                </div>
                            </div>

                            <p className="expert-desc">{mentor.mentorProfile.bio}</p>

                            <div className="expert-meta">
                                <div className="meta-item">
                                    <Briefcase size={16} />
                                    <span>{mentor.mentorProfile.company || mentor.mentorProfile.organization}</span>
                                </div>
                                <div className="expert-tags">
                                    {mentor.skills.slice(0, 3).map((s, i) => (
                                        <span key={i} className="skill-tag">{s}</span>
                                    ))}
                                </div>
                            </div>

                            <div className="expert-actions">
                                <button className="btn-expert book" title="Connect with Mentor">
                                    <span>Connect</span>
                                </button>
                                <button className="btn-expert msg">
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <style jsx>{`
                .expert-photo-placeholder {
                    width: 64px;
                    height: 64px;
                    background: var(--primary-gradient);
                    color: #fff;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    font-weight: 700;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                }
                .community-mentors .section-desc {
                    color: var(--text-muted);
                    margin-bottom: 2rem;
                    font-size: 1.1rem;
                }
            `}</style>
        </div>
    );
};

export default MentorSection;
