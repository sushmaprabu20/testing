import React, { useState } from 'react';
import api from '../../utils/api';
import { Award, Briefcase, GraduationCap, Link as LinkIcon, Check, ChevronRight, X } from 'lucide-react';

const MentorRegistration = ({ onComplete, onCancel }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        currentRole: '',
        company: '',
        experience: 5,
        primaryDomain: 'Backend Development',
        bio: '',
        linkedIn: '',
        availability: 'Weekends, 10 AM - 2 PM',
        expertRole: 'Industry Professional'
    });

    const domains = ['Backend Development', 'Frontend Development', 'Fullstack Development', 'Data Science', 'AI & Machine Learning', 'UI/UX Design', 'Cloud & DevOps'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/mentors/register', formData);
            onComplete();
        } catch (err) {
            console.error('Error registering mentor:', err);
            alert('Failed to register. Please try again.');
        }
    };

    return (
        <div className="mentor-registration-overlay">
            <div className="mentor-registration-card card">
                <button className="close-btn" onClick={onCancel}><X size={20} /></button>

                <div className="registration-header">
                    <h2>Become a Community Mentor</h2>
                    <p>Step {step} of 2: {step === 1 ? 'Expertise Details' : 'Professional Profile'}</p>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${(step / 2) * 100}%` }}></div>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    {step === 1 ? (
                        <div className="registration-step">
                            <div className="input-group">
                                <label>Your Current Role</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Senior Backend Engineer"
                                    className="premium-input"
                                    value={formData.currentRole}
                                    onChange={(e) => setFormData({ ...formData, currentRole: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-row">
                                <div className="input-group">
                                    <label>Company</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Google"
                                        className="premium-input"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Years of Exp</label>
                                    <input
                                        type="number"
                                        className="premium-input"
                                        value={formData.experience}
                                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Primary Domain</label>
                                <select
                                    className="premium-input select"
                                    value={formData.primaryDomain}
                                    onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                                >
                                    {domains.map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                            </div>
                            <button type="button" className="btn-primary full-width" onClick={() => setStep(2)}>
                                Next Step <ChevronRight size={18} />
                            </button>
                        </div>
                    ) : (
                        <div className="registration-step">
                            <div className="input-group">
                                <label>Short Bio</label>
                                <textarea
                                    placeholder="Tell potential mentees about your journey and how you can help..."
                                    className="premium-input textarea"
                                    rows={4}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>LinkedIn Profile</label>
                                <div className="input-with-icon">
                                    <LinkIcon size={18} />
                                    <input
                                        type="url"
                                        placeholder="https://linkedin.com/in/..."
                                        className="premium-input"
                                        value={formData.linkedIn}
                                        onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="btn-group-row">
                                <button type="button" className="btn-secondary" onClick={() => setStep(1)}>Back</button>
                                <button type="submit" className="btn-primary flex-1">Complete Registration</button>
                            </div>
                        </div>
                    )}
                </form>
            </div>

            <style jsx>{`
                .mentor-registration-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(8px);
                    z-index: 2000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                }
                .mentor-registration-card {
                    max-width: 500px;
                    width: 100%;
                    padding: 2.5rem;
                    position: relative;
                }
                .close-btn {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-muted);
                }
                .registration-header h2 {
                    font-size: 1.8rem;
                    color: var(--text-main);
                    margin-bottom: 0.5rem;
                }
                .progress-bar {
                    height: 4px;
                    background: #f1f3f5;
                    border-radius: 4px;
                    margin: 1.5rem 0 2rem;
                }
                .progress-fill {
                    height: 100%;
                    background: var(--primary-gradient);
                    border-radius: 4px;
                    transition: 0.3s;
                }
                .premium-input {
                    width: 100%;
                    padding: 0.8rem 1rem;
                    border-radius: 10px;
                    border: 1px solid var(--border-color);
                    background: #fafbfc;
                    font-size: 1rem;
                    transition: 0.3s;
                }
                .premium-input:focus {
                    outline: none;
                    border-color: var(--primary-orange);
                    background: #fff;
                    box-shadow: 0 0 0 4px rgba(255,107,74,0.1);
                }
                .input-row {
                    display: flex;
                    gap: 1rem;
                }
                .input-with-icon {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    background: #fafbfc;
                    border: 1px solid var(--border-color);
                    padding-left: 1rem;
                    border-radius: 10px;
                }
                .input-with-icon .premium-input {
                    border: none;
                }
                .btn-group-row {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                .flex-1 { flex: 1; }
            `}</style>
        </div>
    );
};

export default MentorRegistration;
