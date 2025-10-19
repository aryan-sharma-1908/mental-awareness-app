const express = require('express');
const router = express.Router();
const Post = require('../models/post.model');

exports.post = async (req, res) => {
    const {title, text} = req.body;

    
    if(!title || !text) {
        return res.status(400).json({
            success: false,
            message: 'Title and text are required'
        })
        console.error('Validation error: Title and text are required');
    }
    
    try {
        const userId = req.user?._id;
        if(!userId) {
            console.error('Unauthorized: No user Id found in request');
            return res.status(401).json({
                success: false,
                message: 'Unauthorized. User not found.'
            })
        }

        const newPost = new Post({title,text,user: userId});
        await newPost.save();

        const populatedPost = await newPost.populate("user", "name email username avatar");

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            post: populatedPost
        })
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        })
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'name email username avatar').sort({createdAt: -1});
        if(posts.length === 0) {
            console.log('No posts found in database');
            return res.status(200).json({
                success: true,
                message: 'No posts found'
            })
        }
        res.status(200).json({
            success: true,
            message: 'Posts fetched successfully',
            posts
        })
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        })
    }
}