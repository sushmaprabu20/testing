import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { AuthContext } from '../context/AuthContext';
import { MessageSquare, Users, Sparkles, Filter, Send, ThumbsUp, MessageCircle, Briefcase, Plus, Search, Trash2, AlertTriangle, X } from 'lucide-react';
import './Community.css';

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
const DeleteModal = ({ onConfirm, onCancel, type = 'post' }) => (
    <div className="modal-overlay" onClick={onCancel}>
        <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="delete-modal-icon">
                <AlertTriangle size={32} color="#ff4d4f" />
            </div>
            <h3>Delete {type === 'post' ? 'Post' : 'Comment'}?</h3>
            <p>
                This action <strong>cannot be undone</strong>.{' '}
                {type === 'post'
                    ? 'Your post and all its comments will be permanently removed.'
                    : 'Your comment will be permanently removed.'}
            </p>
            <div className="delete-modal-actions">
                <button className="modal-cancel-btn" onClick={onCancel}>
                    <X size={16} /> Cancel
                </button>
                <button className="modal-delete-btn" onClick={onConfirm}>
                    <Trash2 size={16} /> Yes, Delete
                </button>
            </div>
        </div>
    </div>
);

// ─── Main Community Component ─────────────────────────────────────────────────
const Community = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [groups, setGroups] = useState([]);
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPost, setNewPost] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('General');
    const [showMentorReg, setShowMentorReg] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [deletingPostIds, setDeletingPostIds] = useState(new Set()); // for fade-out animation

    // Modal state: { type: 'post' | 'comment', postId, commentId }
    const [deleteTarget, setDeleteTarget] = useState(null);

    const categories = ['General', 'Backend Development', 'Frontend Development', 'Data Science', 'AI/ML', 'DevOps', 'Interview Experience'];

    // Helper: get current user ID reliably (handles _id vs id)
    const currentUserId = user?._id || user?.id;

    // Helper: check if the logged-in user owns a resource
    const isOwner = (resourceUserId) => {
        if (!currentUserId || !resourceUserId) return false;
        return currentUserId.toString() === resourceUserId.toString();
    };

    useEffect(() => {
        fetchCommunityData();
    }, []);

    const fetchCommunityData = async () => {
        try {
            const [postsRes, groupsRes, mentorsRes, profileRes] = await Promise.all([
                api.get('/community/posts'),
                api.get('/community/groups'),
                api.get('/mentors/all'),
                user ? api.get('/mentors/profile') : Promise.resolve({ data: null })
            ]);
            setPosts(postsRes.data);
            setGroups(groupsRes.data);
            setMentors(mentorsRes.data);
            setUserProfile(profileRes.data);
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

    // ── Delete Post ──────────────────────────────────────────────────────────
    const confirmDeletePost = (postId) => {
        setDeleteTarget({ type: 'post', postId });
    };

    const handleDeletePost = async () => {
        const { postId } = deleteTarget;
        setDeleteTarget(null);

        // Add to deleting set to trigger fade-out
        setDeletingPostIds(prev => new Set(prev).add(postId));

        // Wait for animation then remove from state
        setTimeout(async () => {
            try {
                await api.delete(`/community/posts/${postId}`);
                setPosts(prev => prev.filter(p => p._id !== postId));
            } catch (err) {
                console.error('Error deleting post:', err);
                // On error, remove from deleting set so it reappears
                setDeletingPostIds(prev => {
                    const next = new Set(prev);
                    next.delete(postId);
                    return next;
                });
            }
            setDeletingPostIds(prev => {
                const next = new Set(prev);
                next.delete(postId);
                return next;
            });
        }, 350); // matches CSS transition duration
    };

    // ── Delete Comment ───────────────────────────────────────────────────────
    const confirmDeleteComment = (postId, commentId) => {
        setDeleteTarget({ type: 'comment', postId, commentId });
    };

    const handleDeleteComment = async () => {
        const { postId, commentId } = deleteTarget;
        setDeleteTarget(null);
        try {
            const res = await api.delete(`/community/posts/${postId}/comment/${commentId}`);
            setPosts(posts.map(p => p._id === postId ? res.data : p));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    // ── Modal confirm dispatcher ─────────────────────────────────────────────
    const handleModalConfirm = () => {
        if (!deleteTarget) return;
        if (deleteTarget.type === 'post') handleDeletePost();
        else handleDeleteComment();
    };

    if (loading) return <div className="loader">Building Community...</div>;

    return (
        <div className="community-container container">

            {/* Delete Confirmation Modal */}
            {deleteTarget && (
                <DeleteModal
                    type={deleteTarget.type}
                    onConfirm={handleModalConfirm}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {showMentorReg && (
                <MentorRegistration
                    onComplete={() => {
                        setShowMentorReg(false);
                        fetchCommunityData();
                        alert('Congratulations! You are now a community mentor.');
                    }}
                    onCancel={() => setShowMentorReg(false)}
                />
            )}

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
                        {!user ? (
                            <div className="login-prompt">
                                <h3>Join the conversation</h3>
                                <p>Please login to share your thoughts and interact with the community.</p>
                                <button className="btn-primary" onClick={() => navigate('/login')}>Login to Post</button>
                            </div>
                        ) : (
                            <>
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
                                        <button type="submit" className="btn-primary post-btn" disabled={!newPost.trim()}>
                                            Post Community <Send size={16} />
                                        </button>
                                    </div>
                                </form>
                            </>
                        )}
                    </div>

                    <div className="feed-list">
                        {posts.map(post => (
                            <div
                                key={post._id}
                                className={`post-card card ${deletingPostIds.has(post._id) ? 'post-deleting' : ''}`}
                            >
                                <div className="post-header">
                                    <div className="user-avatar-mini">
                                        {post.user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div className="user-meta">
                                        <strong>{post.user?.name || 'Deleted User'}</strong>
                                        <span className="post-time">
                                            {post.createdAt
                                                ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                                                : 'Unknown date'}
                                        </span>
                                    </div>
                                    <div className="post-header-right">
                                        <div className="post-tag">{post.category}</div>
                                        {/* Delete button — only visible to post owner */}
                                        {isOwner(post.user?._id) && (
                                            <button
                                                className="delete-post-btn"
                                                onClick={() => confirmDeletePost(post._id)}
                                                title="Delete your post"
                                                aria-label="Delete post"
                                            >
                                                <Trash2 size={16} />
                                                <span>Delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="post-content">{post.content}</div>

                                <div className="post-footer">
                                    <button className="post-action-btn" onClick={() => handleLike(post._id)}>
                                        <ThumbsUp size={18} className={post.likes.length > 0 ? 'liked' : ''} />
                                        {post.likes.length}
                                    </button>
                                    <button className="post-action-btn">
                                        <MessageCircle size={18} /> {post.comments.length}
                                    </button>
                                </div>

                                {post.comments.length > 0 && (
                                    <div className="comments-section">
                                        {post.comments.map((comment, i) => (
                                            <div key={comment._id || i} className="comment-item">
                                                <div className="comment-text">
                                                    <strong>{comment.user?.name || 'User'}:</strong>
                                                    <span> {comment.text}</span>
                                                </div>
                                                {/* Delete comment — only visible to comment owner */}
                                                {isOwner(comment.user?._id) && (
                                                    <button
                                                        className="delete-comment-btn"
                                                        onClick={() => confirmDeleteComment(post._id, comment._id)}
                                                        title="Delete your comment"
                                                        aria-label="Delete comment"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="comment-input-area">
                                    <input
                                        type="text"
                                        placeholder="Add a comment... (press Enter)"
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
                                <div key={mentor._id} className="mini-mentor-item" onClick={() => window.open(mentor.linkedIn, '_blank')} style={{ cursor: 'pointer' }}>
                                    <div className="avatar-blue">
                                        {mentor.user?.name?.charAt(0) || '?'}
                                    </div>
                                    <div>
                                        <strong>{mentor.user?.name || 'Anonymous Mentor'}</strong>
                                        <p>{mentor.expertRole || mentor.primaryDomain || 'Mentor'}</p>
                                    </div>
                                </div>
                            ))}
                            {mentors.length === 0 && <p className="text-muted small">No mentors joined yet.</p>}
                        </div>
                        <button className="btn-secondary full-width" style={{ marginTop: '1rem' }}>Browse All Mentors</button>
                    </div>

                    {user && userProfile && !userProfile.isMentor && (
                        <div className="join-mentors-cta card" style={{ marginTop: '1.5rem', background: 'var(--primary-gradient)', color: '#fff' }}>
                            <Sparkles size={24} style={{ marginBottom: '1rem' }} />
                            <h3>Want to Mentor?</h3>
                            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>Share your expertise with the community and help others grow.</p>
                            <button
                                className="btn-primary"
                                style={{ background: '#fff', color: 'var(--primary-orange)', border: 'none' }}
                                onClick={() => setShowMentorReg(true)}
                            >
                                Get Started
                            </button>
                        </div>
                    )}
                </aside>

            </div>
        </div>
    );
};

export default Community;
