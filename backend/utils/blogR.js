const { PrismaClient } = require('@prisma/client');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prisma = new PrismaClient();

const getAllBlogsOnApp = async(req, res, next) => {

    const allBlogs = await prisma.blog.findMany({
        where: {
            email: {
                endsWith: ".com"
            }
        }
    })
    res.render('getFeeds', {
        data: allBlogs,
        userID: req.user.id
    })
}

const getAllBlogs = async(req, res, next) => {
    const userEmail = req.user.emails[0].value;
        const userBlogs = await prisma.blog.findMany({
            where: {
                email: userEmail,
            },
        })
        res.render('getUserBlogs', {
            data: userBlogs,
            userID: req.params.userID
        });
}
const addNewBlog = async(req, res, next) => {
    res.render('createBlog', {
        userID: req.params.userID
    });
}
const createNewBlog = async(req, res, next) => {
    const userEmail = req.user.emails[0].value;
        const newBlog = await prisma.blog.create({
          data: {
            title: req.body.title,
            content: req.body.content,
            email: userEmail,
          }
        })
    const userBlogs = await prisma.blog.findMany({
        where: {
            email: userEmail,
        },
    })
    res.render('getUserBlogs', {
        data: userBlogs,
        userID: req.params.userID
    });
}

const updateBlog = async(req, res, next) => {
    const userBlog = await prisma.blog.findUnique({
        where: {
            id: parseInt(req.params.blogID)
        },
    })
    res.render('updateBlog', {
        userID: req.params.userID,
        blogID: req.params.blogID,
        title: userBlog.title,
        content: userBlog.content
    });
}
const updatedBlog = async(req, res, next) => {
    const userEmail = req.user.emails[0].value;
    const updateUser = await prisma.blog.update({
        where: {
            id: parseInt(req.params.blogID)
        },
        data: {
            title: req.body.title,
            content: req.body.content,
            email: userEmail
          }
    })
    const userBlogs = await prisma.blog.findMany({
        where: {
            email: userEmail,
        },
    })
    res.render('getUserBlogs', {
        data: userBlogs,
        userID: req.params.userID
    });
}
const deleteBlog = async(req, res) => {
    const userEmail = req.user.emails[0].value;
    const deleteUser = await prisma.blog.delete({
        where: {
            id: parseInt(req.params.blogID)
        }
    })
    const userBlogs = await prisma.blog.findMany({
        where: {
            email: userEmail,
        },
    })
    res.render('getUserBlogs', {
        data: userBlogs,
        userID: req.params.userID
    });
}
module.exports = {
    getAllBlogsOnApp: getAllBlogsOnApp,
    getAllBlogs: getAllBlogs,
    addNewBlog:  addNewBlog,
    createNewBlog: createNewBlog,
    updateBlog: updateBlog,
    updatedBlog: updatedBlog,
    deleteBlog: deleteBlog
}; 
