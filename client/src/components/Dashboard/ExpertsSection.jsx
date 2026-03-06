import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import ExpertCard from './ExpertCard';
import { Users, Filter, Sparkles } from 'lucide-react';

const ExpertsSection = ({ missingSkills = [] }) => {
    const [experts, setExperts] = useState([]);
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ domain: '', type: '' });

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                setLoading(true);
                // Fetch all experts
                const allRes = await api.get('/experts');
                setExperts(allRes.data);

                // If we have missing skills, fetch recommendations
                if (missingSkills.length > 0) {
                    const recRes = await api.post('/experts/recommendations', { skills: missingSkills });
                    setRecommended(recRes.data);
                }
            } catch (err) {
                console.error('Error fetching experts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchExperts();
    }, [missingSkills]);

    const filteredExperts = experts.filter(exp => {
        const matchDomain = !filter.domain || exp.expertise.some(s => s.toLowerCase().includes(filter.domain.toLowerCase()));
        const matchType = !filter.type || exp.role === filter.type;
        return matchDomain && matchType;
    });

    if (loading) return <div className="loader">Loading Experts...</div>;

    return (
        <div className="experts-section">
            {recommended.length > 0 && (
                <div className="recommendations-block">
                    <div className="section-title">
                        <Sparkles size={24} color="var(--primary-orange)" />
                        <h2>Recommended For Your Skill Gaps</h2>
                    </div>
                    <div className="experts-grid">
                        {recommended.map(exp => <ExpertCard key={exp._id} expert={exp} />)}
                    </div>
                </div>
            )}

            <div className="all-experts-block">
                <div className="section-header">
                    <div className="section-title">
                        <Users size={24} color="var(--primary-orange)" />
                        <h2>Talk With Experts</h2>
                    </div>

                    <div className="expert-filters">
                        <div className="filter-item">
                            <Filter size={16} />
                            <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })}>
                                <option value="">All Types</option>
                                <option value="Career Consultant">Career Consultant</option>
                                <option value="Industry Professional">Industry Professional</option>
                                <option value="Domain Expert">Domain Expert</option>
                            </select>
                        </div>
                        <input
                            type="text"
                            placeholder="Filter by domain..."
                            className="domain-filter"
                            value={filter.domain}
                            onChange={(e) => setFilter({ ...filter, domain: e.target.value })}
                        />
                    </div>
                </div>

                <div className="experts-grid">
                    {filteredExperts.map(exp => <ExpertCard key={exp._id} expert={exp} />)}
                    {filteredExperts.length === 0 && <p className="no-results">No experts found matching your filters.</p>}
                </div>
            </div>
        </div>
    );
};

export default ExpertsSection;
