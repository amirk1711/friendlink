{
    // function to create post which will 
    // fetch the data from the form
    // and send it to the controller's action

    // method to submit the form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        // whenever this form is submitted 
        newPostForm.submit(function(e){
            // we dont want to submit it naturally
            e.preventDefault();
            
            // submit it using ajax
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(), // this converts form data into json
                success: function(data){
                    let newPost = newPostDOM(data.data.post);
                    $('#post-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));
                },
                error: function(err){
                    console.log(err.resposeText);
                }

            });
        });
    };


    let newPostDOM = function(post){
        return $(`<li id="post-${post._id}">
                <p>
                    
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">X</a>
                
                    ${post.content}
                    <small>
                        by
                        ${post.user.name}
                    </small>
                
                </p>
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                            
                        </ul>
                    </div>
                    <form action="/comments/create" id="new-comment-form" method="POST">
                        <input type="text" name="content" cols="20" rows="1" placeholder="Add a comment..." required>
                        <!-- we need to send the pos id as well 
                        to the comments create controller 
                        because in comment model post is also referenced
                        along with user(which is passed in the req)  -->
                        <input type="hidden" name="post" value="${post._id}">
                        <input type="submit" value="Comment">
                    </form>
                </li>    `);
    };

    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },
                error: function(err){
                    console.log(error.responseText);
                }
            });
        });
    };

    createPost();
}