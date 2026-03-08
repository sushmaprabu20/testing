const Post = require('../models/Post');
const Group = require('../models/Group');

exports.createPost = async (req, res) => {
    try {
        console.log('[COMMUNITY] Creating post:', req.body);
        const { content, category } = req.body;
        const post = new Post({
            user: req.user._id,
            content,
            category
        });
        await post.save();
        const populatedPost = await Post.findById(post._id).populate('user', 'name');
        res.status(201).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error creating post', error: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('user', 'name')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error: error.message });
    }
};

exports.likePost = async (req, res) => {
    try {
        console.log(`[COMMUNITY] Liking post: ${req.params.id}`);
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.likes.includes(req.user._id)) {
            post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
        } else {
            post.likes.push(req.user._id);
        }
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: 'Error liking post', error: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        console.log(`[COMMUNITY] Adding comment to post ${req.params.id}:`, req.body);
        const { text } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        post.comments.push({
            user: req.user._id,
            text
        });
        await post.save();
        const populatedPost = await Post.findById(post._id).populate('comments.user', 'name');
        res.status(200).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error: error.message });
    }
};

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find();
        res.status(200).json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching groups', error: error.message });
    }
};

exports.joinGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (!group.members.includes(req.user._id)) {
            group.members.push(req.user._id);
            await group.save();
        }
        res.status(200).json(group);
    } catch (error) {
        res.status(500).json({ message: 'Error joining group', error: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this post' });
        }

        await post.deleteOne();
        res.status(200).json({ message: 'Post removed' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting post', error: error.message });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized to delete this comment' });
        }

        comment.deleteOne();
        await post.save();

        const populatedPost = await Post.findById(post._id).populate('comments.user', 'name');
        res.status(200).json(populatedPost);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting comment', error: error.message });
    }
};
