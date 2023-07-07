const Post = require('../models/post');

const createPost = (req, res) => {
    const data = req.body;
    data.createdBy = req.user._id;

    const newPost = new Post(data);

    newPost.save()
        .then(post => res.json({ success: true, post }))
        .catch(error => res.status(400).json({ success: false, error }));
}

const getPosts = (req, res) => {
    const createdBy = req.user._id;
    Post.find({ createdBy })
        .then(posts => res.json({ success: true, posts }))
        .catch(error => res.status(400).json({ success: false, error }));
}

const getPostById = (req, res) => {
    const postId = req.params.id;
    const createdBy = req.user._id;

    Post.findOne({ _id: postId, createdBy })
        .then(post => {
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, post });
        })
        .catch(error => res.status(400).json({ success: false, error }));
}

const updatePostById = (req, res) => {
    const postId = req.params.id;
    const createdBy = req.user._id;

    Post.findOneAndUpdate({ _id: postId, createdBy }, req.body, { new: true })
        .then(post => {
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, post });
        })
        .catch(error => res.status(400).json({ success: false, error }));
}

const deletePostById = (req, res) => {
    const postId = req.params.id;
    const createdBy = req.user._id;

    Post.findOneAndDelete({ _id: postId, createdBy })
        .then(post => {
            if (!post) {
                return res.status(404).json({ success: false, message: 'Post not found' });
            }
            res.json({ success: true, message: 'Post deleted successfully' });
        })
        .catch(error => res.status(400).json({ success: false, error }));
}

// const getPostsByLatLong = (req, res) => {
//     const { latitude, longitude } = req.query;

//     Post.find({
//         location: {
//             $near: {
//                 $geometry: {
//                     type: 'Point',
//                     coordinates: [longitude, latitude],
//                 },
//                 $maxDistance: 1000, // Maximum distance in meters
//             },
//         },
//     })
//         .populate('createdBy')
//         .exec((err, posts) => {
//             if (err) {
//                 res.status(500).json({ message: 'Error retrieving posts' });
//             } else {
//                 res.json(posts);
//             }
//         });
// }

const getPostsByLatLong = async (req, res) => {
    const { latitude, longitude } = req.query;

    try {
        const posts = await Post.find({
            geoLocation: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000000000,
                },
            },
        }).populate('createdBy');

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts', error });
    }
}


const getCountofPosts = async (req, res) => {

    try {
        const result = await Post.aggregate(
            [
                {
                    $match: {
                        createdBy: req.user._id,
                    },
                },
                {
                    $group: {
                        _id: '$active',
                        count: { $sum: 1 },
                    },
                },
            ])

        const counts = {};
        result.forEach((item) => {
            const status = item._id ? 'Active' : 'Inactive';
            counts[status] = item.count;
        });
        res.json(counts);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving post count' });
    }

 
}



module.exports = { createPost, getPosts, getPostById, updatePostById, deletePostById, getCountofPosts, getPostsByLatLong }