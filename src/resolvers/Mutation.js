const randomString = (length, chars) => {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

const Mutation = {
    createUser(parent, args, { db }, info) {
        const emailTaken = db.users.some(user => {
            return db.user.email === args.input.email
        })
        if(emailTaken) {
            throw new Error("Email already exists")
        }

        const user = {
            id: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            ...args.input
        }
        db.users.push(user)
        return user
    },
    deleteUser(parent, args, { db }, info) {
        const userIndex = db.users.findIndex(user => user.id === args.id)
        if(userIndex === -1) {
            throw new Error("User not found")
        }
        const deletedUser = db.users.splice(userIndex, 1)
        return deletedUser
    },
    updateUser(parent, args, { db }, info) {
        const { id, input } = args
        const user = db.users.find(user => user.id === id)
        if(!user) {
            throw new Error("User not found")
        }
        if (typeof input.email === 'string') {
            const emailTaken = users.some(user => user.email === input.email)
            if(emailTaken) {
                throw new Error("Email already taken")
            }
            user.email = input.email
        }
        if (typeof input.name === 'string') {
            user.name = input.name
        }
        if (typeof input.age !== 'undefined') {
            user.age = input.age
        }

        return user
    },
    createPost(parent, args, { db, pubsub }, info) {
        const userExist = db.users.some(user => user.id === args.input.author)
        if(!userExist) {
            throw new Error("User not found")
        }
        
        const post = {
            id: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            ...args.input
        }

        db.posts.push(post)
        if (args.input.published) {
            pubsub.publish( "post" , {
                post: {
                    mutation: "CREATED",
                    data: post 
                }
            })
        }

        return post
    },
    updatePost(parent, args, { db, pubsub }, info) {
        const { id, input } = args
        const post = db.posts.find(post => post.id === id)
        const originalPost = { ...post }
        if(!post) {
            throw new Error("Post doesn't exist")
        }
        if(typeof input.title === "string") {
            post.title = input.title
        }
        if(typeof input.body === "string") {
            post.body = input.body 
        }
        if(typeof input.published === "boolean") {
            post.published = input.published
        }

        if (typeof input.published === "boolean") {
            post.published = input.published
            
            if (originalPost.published && !post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'DELETED',
                        data: originalPost
                    }
                })
            } else if (!originalPost.published && post.published) { 
                pubsub.publish('post', {
                    post: {
                        mutation: 'CREATED',
                        data: post
                    }
                })
            } else if (originalPost.published && post.published) {
                pubsub.publish('post', {
                    post: {
                        mutation: 'UPDATED',
                        data: post
                    }
                })
            }
        } else if (post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: 'UPDATED',
                    data: post
                }
            })
        }

        return post
    },
    deletePost(parent, args, { db, pubsub }, info) {
        const { id } = args
        const postIndex = db.posts.findIndex(post => post.id === id)
        if(postIndex === -1) {
            throw new Error("Post does not exist!")
        }
        const [post] = db.posts.splice(postIndex, 1)
        db.comments = db.comments.filter(comment => comment.post !== id)

        if(post.published) {
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: post
                }
            })
        }
        return post
    },
    createComment(parent, args, { db, pubsub }, info) {
        const emailTaken = db.users.some(user => {
            return user.id === args.input.author
        })
        const postExists = db.posts.some(post => {
            return post.id === args.input.post 
            // || post.published == false
        })
        if(!emailTaken || !postExists) { throw new Error("User/Post doesn't exist!")}
        const comment = {
            id: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            ...args.input 
        }
        db.comments.push(comment)
        // first is the channel second is the value we want to publish, which matches up with the subscription name in schema, using shorthand syntax
        pubsub.publish(`comment ${args.input.post}`, { 
            comment: {
                mutation: "CREATED",
                data: comment
            }
         })
        return comment
    },
    updateComment(parent, args, { db, pubsub }, info) {
        const { id, input } = args
        const comment = db.comments.find(comment => comment.id === id)
        
        if(!comment) {
            throw new Error("Comment not found")
        }

        if (typeof input.text === 'string') {
            comment.text = input.text
        }

        pubsub.publish(`comment ${args.id}`, {
            comment: {
                mutation: "UPDATED",
                data: comment
            }
        })
        return comment
    },
    deleteComment(parent, args , { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment => comment.id === args.id)
        if(commentIndex === -1) {
            throw new Error("Comment not found")
        }
        //destructured because this obviates having to grab deletedComment from an array like so deletedComment[0]
        const [deletedComment] = db.comments.splice(commentIndex, 1)
        pubsub.publish(`comment ${deletedComment.post}`, {
            comment: {
                mutation: "DELETED",
                data: deletedComment
            }
        })
        return deletedComment
    }

}

export default Mutation