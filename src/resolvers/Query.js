const Query = {
    add(parent, args, ctx, info) {
        return args.a + args.b
    },
    grades(parent, args, ctx, info) {
        return [23, 43, 64, 76]
    },
    total(parent, args, ctx, info) {
        return args.numbers.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
        })
    },
    users(parent, args, { db }, info) {
        if(!args.query) {
            return db.users
        }
        return db.users.map(user => {
            return user.id === args.query
        })
    },
    post(parent, args, { db }, info) {
        return db.posts
    },
    comment(parent, args, { db }, info) {
        return db.comments
    }
}

export default Query