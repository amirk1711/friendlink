const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function (req, res) {
  let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
      path: 'comments',
      populate: {
        path: 'user',
      },
    });

  return res.json(200, {
    message: 'List of posts',
    posts: posts,
  });
};

module.exports.destroy = async function (req, res) {
  try {
    let post = await Post.findById(req.params.id);

    // check if the the owner of post is deleting or someone else
    // now we are comparing so we need to convert it req.user._id
    // from object to a string using req.user.id
    if (post.user == req.user.id) {
      post.remove();

      // delete comments on that post as well
      await Comment.deleteMany({ post: req.params.id });

      return res.status(200).json({
        message: 'Post and associated comments deleted successfully',
      });
    } else {
      return res.status(401).json({
        message: 'You are not authourized to delete this post!',
      });
    }
  } catch (err) {
    console.log('******:', err);
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
};
