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
    createPost(parent, args, { db }, info) {
        const userExist = db.users.some(user => user.id === args.input.author)
        if(!userExist) {
            throw new Error("User not found")
        }
        
        const post = {
            id: randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
            ...args.input
        }

        db.posts.push(post)
        return post
    },
    updatePost(parent, args, { db }, info) {
        const { id, input } = args
        const post = db.posts.find(post => post.id === id)
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

        return post
    },
    createComment(parent, args, { db }, info) {
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
        return comment
    }

}

export default Mutation