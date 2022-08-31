const dummy = blogs => {

    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((pval, cval) => pval + cval.likes, 0)
}

const favoriteBlog = blogs => {
    const blog = blogs.reduce((pval, cval) => pval.likes > cval.likes ? pval : cval, {})

    return {
        title: blog.title,
        author: blog.author,
        likes: blog.likes
    }
}

module.exports = {
    dummy,
    totalLikes,
}