import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Filter, Sparkles, MessageSquare, Briefcase } from 'lucide-react';
import './MentorSection.css';
// import './Experts.css'; // Removed as file was deleted during cleanup

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
                                    {mentor.user?.name ? mentor.user.name.charAt(0) : 'M'}
                                </div>
                                <div className="expert-info">
                                    <h3>{mentor.user?.name || 'Anonymous Mentor'}</h3>
                                    <div className="expert-role-badge">{mentor.currentRole}</div>
                                </div>

                            </div>

                            <p className="expert-desc">{mentor.bio}</p>


                            <div className="expert-meta">
                                <div className="meta-item">
                                    <Briefcase size={16} />
                                    <span>{mentor.company}</span>
                                </div>

                                <div className="expert-tags">
                                    {/* Using mentor.user or other available skill sources if needed, for now just show a fallback if skills aren't on mentor object directly */}
                                    {mentor.primaryDomain && <span className="skill-tag">{mentor.primaryDomain}</span>}
                                    {mentor.expertRole && <span className="skill-tag">{mentor.expertRole}</span>}
                                </div>

                            </div>

                            <div className="expert-actions">
                                <button className="btn-expert book" title="View LinkedIn Profile" onClick={() => window.open(mentor.linkedIn, '_blank')}>
                                    <span>Connect</span>
                                </button>
                                <button className="btn-expert msg" title="Message on LinkedIn" onClick={() => window.open(mentor.linkedIn, '_blank')}>
                                    <MessageSquare size={18} />
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MentorSection;
