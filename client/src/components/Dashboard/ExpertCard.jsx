import React from 'react';
import { Mail, Calendar, MessageSquare, Star, Clock } from 'lucide-react';
import './Experts.css';

const ExpertCard = ({ expert }) => {
    return (
        <div className="expert-card card">
            <div className="expert-header">
                <img src={expert.photoUrl} alt={expert.name} className="expert-photo" />
                <div className="expert-info">
                    <h3>{expert.name}</h3>
                    <div className="expert-role-badge">{expert.role}</div>
                </div>
            </div>

            <p className="expert-desc">{expert.description}</p>

            <div className="expert-meta">
                <div className="meta-item">
                    <Clock size={16} />
                    <span>{expert.experience} Yrs Experience</span>
                </div>
                <div className="expert-tags">
                    {expert.expertise.slice(0, 3).map((tag, i) => (
                        <span key={i} className="skill-tag">{tag}</span>
                    ))}
                </div>
            </div>

            <div className="expert-actions">
                <button className="btn-expert book" title="Book Session">
                    <Calendar size={18} />
                    <span>Book Session</span>
                </button>
                <button className="btn-expert msg" title="Send Message">
                    <MessageSquare size={18} />
                </button>
            </div>
        </div>
    );
};

export default ExpertCard;
