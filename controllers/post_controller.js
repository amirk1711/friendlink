const Post = require("../models/post");
const Comment = require('../models/comment');
const Like = require('../models/like');
const fs = require("fs");
const path = require("path");
const { create } = require("../models/post");

async function createPost(req){
    let post;
    if(req.file){
        post = await Post.create({
            user: req.user.id,
            content: Post.postPath + '/' + req.file.filename
        });
    }

    if(req.xhr){
        console.log('Create Post using AJAX');
        // to populate just the name of the user (we'll not want to send the password in the API)
        post = await post.populate('user', 'name').execPopulate();
        console.log('post to ajax', post);
        return res.status(200).json({
            data: {
                post: post
            },
            message: "Post created using AJAX!"
        });
    }

    req.flash('success', "Post published!");
    return res.redirect('back');
}

module.exports.create = async function(req , res){
    try {
        await Post.uploadedPost(req, res, function(err){
            if(err){
                console.log("*****Multer Error***** :" , err);
                return;
            }
            createPost(req, res);
        });         
    }catch (error){
        req.flash('error', "Error in creating Post")
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req,res){
    try {
        // find post by id passed in req url
        let post = await Post.findById(req.params.id );
        
        //user.id is used to convert user._id into a string
        //we have not populated user from posts yet, so post.user must be the user's id

        if(post.user == req.user.id){
            // delete all the associated likes with the post
            await Like.deleteMany({likeable: post, onModel: 'Post'});
            // deete all likes asscciated with the commets of that post
            await Like.deleteMany({_id: {$in: post.comments}});

            // reomve the files from uploads as well
            let fileName = post.content;
            console.log('file to be deleted', fileName);
            fs.unlinkSync(path.join(__dirname, '..', fileName));


            //delete the post 
            post.remove();

            // delete all the comments from that post
            // now post is deleted, so we need to use post id from params
            await Comment.deleteMany({post: req.params.id});

            if(req.xhr){
                // console.log('Delete Post using AJAX');
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post Deleted!"
                });
            }else{
                console.log('Req is not XHR');
            }

            req.flash('success' , "Post and associated comments deleted!");
            return res.redirect('back');
        }else{
            console.log('post != req');
            req.flash('success' , "You cannot delete this post!")
            return res.redirect('back');
        }
    } catch (error) {
        req.flash('error' ,error)
        return res.redirect('back');
    }
}