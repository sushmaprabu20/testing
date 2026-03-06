import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { MessageSquare, Users, Sparkles, Filter, Send, ThumbsUp, MessageCircle, Briefcase, Plus, Search } from 'lucide-react';
import './Community.css';

const Community = () => {
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');

    const categories = ['General', 'Backend Development', 'Frontend Development', 'Data Science', 'AI/ML', 'DevOps', 'Interview Experience'];

    useEffect(() => {
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            const [postsRes, groupsRes, mentorsRes] = await Promise.all([
                api.get('/community/posts'),
                api.get('/community/groups'),
                api.get('/mentors/all')
            ]);
            setPosts(postsRes.data);
            setGroups(groupsRes.data);
            setMentors(mentorsRes.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching community data:', err);
            setLoading(false);
        }
    };

    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!newPost.trim()) return;

        try {
            const res = await api.post('/community/posts', {
                content: newPost,
                category: selectedCategory
            });
            setPosts([res.data, ...posts]);
            setNewPost('');
        } catch (err) {
            console.error('Error creating post:', err);
        }
    };

    const handleLike = async (id) => {
        try {
            const res = await api.post(`/community/posts/${id}/like`);
            setPosts(posts.map(p => p._id === id ? { ...p, likes: res.data.likes } : p));
        } catch (err) {
            console.error('Error liking post:', err);
        }
    };

    if (loading) return <div className="loader">Building Community...</div>;

    return (
        <div className="community-container container">
            <div className="community-layout">
                {/* Sidebar: Groups */}
                <aside className="community-sidebar">
                    <div className="community-card card">
                        <h3>Domain Groups</h3>
                        <p className="text-muted small">Join discussions in your area of interest</p>
                        <div className="groups-list">
                            {groups.map(group => (
                                <button key={group._id} className="group-item-btn">
                                    <div className="group-icon-mini">
                                        <Briefcase size={16} />
                                    </div>
                                    <div className="group-info-mini">
                                        <span>{group.name}</span>
                                        <small>{group.members.length} members</small>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Main: Feed */}
                <main className="community-main">
                    <div className="create-post-card card">
                        <div className="category-tabs">
                            {categories.slice(0, 4).map(cat => (
                                <button
                                    key={cat}
                                    className={`cat-tab ${selectedCategory === cat ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {cat}
                                </button>
                            ))}
                            <select
                                className="cat-select"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="" disabled>Others...</option>
                                {categories.slice(4).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <form onSubmit={handleCreatePost} className="post-form">
                            <textarea
                                placeholder="Share a resource, ask a question, or discuss a career doubt..."
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                rows={3}
                            />
                            <div className="post-actions">
                                <span className="text-muted small">Posting in {selectedCategory}</span>
                                <button type="submit" className="btn-primary post-btn">
                                    Post Community <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="feed-list">
                        {posts.map(post => (
                            <div key={post._id} className="post-card card">
                                <div className="post-header">
                                    <div className="user-avatar-mini">
                                        {post.user.name.charAt(0)}
                                    </div>
                                    <div className="user-meta">
                                        <strong>{post.user.name}</strong>
                                        <span className="post-time">{new Date(post.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="post-tag">{post.category}</div>
                                </div>
                                <div className="post-content">
                                    {post.content}
                                </div>
                                <div className="post-footer">
                                    <button className="post-action-btn" onClick={() => handleLike(post._id)}>
                                        <ThumbsUp size={18} className={post.likes.length > 0 ? 'liked' : ''} /> {post.likes.length}
                                    </button>
                                    <button className="post-action-btn">
                                        <MessageCircle size={18} /> {post.comments.length}
                                    </button>
                                </div>

                                {post.comments.length > 0 && (
                                    <div className="comments-section">
                                        {post.comments.map((comment, i) => (
                                            <div key={i} className="comment-item">
                                                <strong>{comment.user?.name || 'User'}:</strong> <span>{comment.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="comment-input-area">
                                    <input
                                        type="text"
                                        placeholder="Add a comment..."
                                        onKeyDown={async (e) => {
                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                const text = e.target.value;
                                                try {
                                                    const res = await api.post(`/community/posts/${post._id}/comment`, { text });
                                                    setPosts(posts.map(p => p._id === post._id ? res.data : p));
                                                    e.target.value = '';
                                                } catch (err) {
                                                    console.error('Error adding comment:', err);
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </main>

                {/* Right Sidebar: Mentors & Tips */}
                <aside className="community-sidebar-right">
                    <div className="mentor-highlight-card card">
                        <div className="sparkle-title">
                            <Sparkles size={20} color="var(--primary-orange)" />
                            <h3>Top Community Mentors</h3>
                        </div>
                        <p className="text-muted small">Peer experts ready to help</p>
                        <div className="mini-mentor-list">
                            {mentors.slice(0, 5).map(mentor => (
                                <div key={mentor._id} className="mini-mentor-item">
                                    <div className="avatar-blue">
                                        {mentor.user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <strong>{mentor.user.name}</strong>
                                        <p>{mentor.mentorProfile.currentRole}</p>
                                    </div>
                                </div>
                            ))}
                            {mentors.length === 0 && <p className="text-muted small">No mentors joined yet.</p>}
                        </div>
                        <button className="btn-secondary full-width" style={{ marginTop: '1rem' }}>Browse All Mentors</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Community;
