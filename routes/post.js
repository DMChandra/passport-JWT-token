const express = require('express');
const passport = require('../middleware/passport');
const router = express.Router();
const { createPost, getPosts, getPostById, updatePostById, deletePostById, getCountofPosts, getPostsByLatLong } = 
require('../controllers/post')

// Create a new post
router.post('/posts', passport.authenticate('jwt', { session: false }), createPost);


// Get all posts for the authenticated user
router.get('/posts', passport.authenticate('jwt', { session: false }), getPosts);


// Get a specific post for the authenticated user
router.get('/posts/:id', passport.authenticate('jwt', { session: false }), getPostById);


// Update a specific post for the authenticated user
router.put('/posts/:id', passport.authenticate('jwt', { session: false }), updatePostById);


// Delete a specific post for the authenticated user
router.delete('/posts/:id', passport.authenticate('jwt', { session: false }), deletePostById);


// Get posts using latitude and longitude
router.get('/getPostsByLatLong', passport.authenticate('jwt', { session: false }), getPostsByLatLong);
 

// Get count of active and inactive posts
router.get('/noOfPosts', passport.authenticate('jwt', { session: false }), getCountofPosts);
  








module.exports = router;
