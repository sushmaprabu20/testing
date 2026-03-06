import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { User, Mail, Briefcase, Target, Award, Linkedin, Globe, CheckCircle, XCircle } from 'lucide-react';
import './Profile.css';

const UserProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/mentors/profile');
            setProfile(res.data);
            setFormData(res.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching profile:', err);
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await api.put('/mentors/profile', formData);
            setProfile(formData);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (err) {
            console.error('Error updating profile:', err);
        }
    };

    if (loading) return <div className="loader">Loading Profile...</div>;

    return (
        <div className="profile-container container">
            <div className="profile-header card">
                <div className="profile-hero-content">
                    <div className="profile-main-info">
                        <div className="profile-pic-large">
                            {profile.user.name.charAt(0)}
                        </div>
                        <div className="profile-title-block">
                            <h1>{profile.user.name}</h1>
                            <p className="profile-subtitle">
                                <Mail size={16} /> {profile.user.email}
                            </p>
                            <div className={`mentor-badge-status ${profile.isMentor ? 'active' : ''}`}>
                                {profile.isMentor ? (
                                    <><CheckCircle size={16} /> Community Mentor Active</>
                                ) : (
                                    <><XCircle size={16} /> Mentor Status Inactive</>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-grid">
                <div className="profile-sidebar">
                    <div className="card profile-card-mini">
                        <h3>Career Status</h3>
                        <div className="status-item">
                            <Briefcase size={18} />
                            <div>
                                <span>Current Role</span>
                                <strong>{profile.currentCareer || 'Not Set'}</strong>
                            </div>
                        </div>
                        <div className="status-item">
                            <Target size={18} />
                            <div>
                                <span>Target Role</span>
                                <strong>{profile.targetCareer || 'Not Set'}</strong>
                            </div>
                        </div>
                    </div>

                    <div className="card profile-card-mini">
                        <h3>Domain Skills</h3>
                        <div className="skills-cloud">
                            {profile.skills.map((skill, i) => (
                                <span key={i} className="skill-tag">{skill}</span>
                            ))}
                            {profile.skills.length === 0 && <p className="text-muted">No skills added yet.</p>}
                        </div>
                    </div>
                </div>

                <div className="profile-main-content">
                    {profile.isMentor && profile.mentorProfile && (
                        <div className="card mentor-details-card">
                            <div className="card-header-with-action">
                                <h3>Community Mentor Profile</h3>
                            </div>
                            <div className="mentor-info-grid">
                                <div className="info-item">
                                    <label>Company/Organization</label>
                                    <p>{profile.mentorProfile.company || profile.mentorProfile.organization || 'Not specified'}</p>
                                </div>
                                <div className="info-item">
                                    <label>Industry Experience</label>
                                    <p>{profile.mentorProfile.experience} Years</p>
                                </div>
                                <div className="info-item">
                                    <label>Expertise Domain</label>
                                    <p>{profile.mentorProfile.primaryDomain}</p>
                                </div>
                            </div>
                            <div className="mentor-bio-section">
                                <label>Short Biography</label>
                                <p>{profile.mentorProfile.bio}</p>
                            </div>
                            <div className="mentor-links-section">
                                {profile.mentorProfile.linkedIn && (
                                    <a href={profile.mentorProfile.linkedIn} target="_blank" rel="noopener noreferrer" className="social-link">
                                        <Linkedin size={20} /> LinkedIn Profile
                                    </a>
                                )}
                                {profile.mentorProfile.portfolio && (
                                    <a href={profile.mentorProfile.portfolio} target="_blank" rel="noopener noreferrer" className="social-link">
                                        <Globe size={20} /> Portfolio
                                    </a>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="profile-actions">
                        <button className="btn-primary" onClick={() => setIsEditing(true)}>Edit Profile Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
