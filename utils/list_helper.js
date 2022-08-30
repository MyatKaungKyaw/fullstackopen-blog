const dummy = blogs => {

    return 1
}

const totalLikes = blogs => {
    return blogs.reduce((pval, cval) => pval+cval.likes, 0)
}

module.exports = {
    dummy,
    totalLikes,
}