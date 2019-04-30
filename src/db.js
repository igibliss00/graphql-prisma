const users = [
    {
        id: '1',
        name: "Tom",
        age: '23',
        occupation: "writer",

    },
    {
        id: '2',
        name: "Jen",
        age: '23',
        occupation: "writer",
        
    },
    {
        id: '3',
        name: "Mark",
        age: '23',
        occupation: "writer",
        
    }
]

const posts = [
    {
        id: '2',
        title: "banana",
        body: "sldkfjlsk",
        published: false,
        author: '3'
    },
    {
        id: '3',
        title: "apple",
        body: "sldkfjlsk",
        published: false,
        author: '3'
    },
    {
        id: '7',
        title: "banana",
        body: "sldkfjlsk",
        published: false,
        author: '3'
    }
]

const comments = [{
    id: '1',
    text: "sldflkjsdf",
    author: '1',
    post: '2'
}, {
    id: '2',
    text: "qqqqqqjsdf",
    author: '1',
    post: '2'
}, {
    id: '3',
    text: "ttterttjsdf",
    author: '2',
    post: '3'
}, {
    id: '4',
    text: "barfsdf",
    author: '3',
    post: '7'
}]

const db = {
    comments, users, posts
}

export default db