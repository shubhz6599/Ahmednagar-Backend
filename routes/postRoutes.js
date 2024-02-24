// routes/postRoutes.js

const express = require('express');
const router = express.Router();
const Post = require('../models/posts');
const upload = require('../middlewares/multer');
const User = require('../models/user');
const path = require('path');


// Create post
router.post("/upload",upload.single('photo'), async function (req, res) {
    const file = req.file;
    const users = req.body.user
    if (!file) {
        return res.status(400).send('No Files Were Uploaded');
    }
    const user = await User.findOne({ Username:users })
    const post = await Post.create({
        photo: req.file.filename,
        caption: req.body.caption,
        description: req.body.description,
        user: user._id
    })
    user.posts.push(post._id);
    await user.save();
    res.status(201).json({message:'Image saved successfully', statusMsg: 'Success'});
})

router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post || !post.photo) {
            return res.status(404).json({ message: 'Post or photo not found',statusMsg: 'Failure' });
        }
         res.status(200).sendFile(path.join(__dirname, '../public/images/uploads', post.photo));
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', statusMsg: 'Failure' });
    }
});

router.get('/postData/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post || !post.photo) {
            return res.status(404).json({ message: 'Post or photo not found',statusMsg: 'Failure' });
        }
         res.status(200).json({message:'Post Data Fetched Successfully', statusMsg: 'Success',data:post})
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', statusMsg: 'Failure' });
    }
});

router.get('/posts/user/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const posts = await Post.find({ user: userId });
        return res.json(posts);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


router.delete('/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        // Find the post to delete
        const deletedPost = await Post.findByIdAndDelete(postId);
        if (!deletedPost) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Update user's posts array
        const userId = deletedPost.user;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            $pull: { posts: postId } // Remove postId from user's posts array
        }, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
