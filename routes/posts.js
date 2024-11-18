const express = require("express");
const router = express.Router();

const posts = require("../data/posts");
const users = require("../data/users");
const comments = require("../data/comments");
const error = require("../utilities/error");

router
  .route("/")
  .get((req, res, next) => {
    if (req.query.userId){
      const userId = Number(req.query.userId); 

      const userPosts = posts.filter((p) => p.userId == userId); 

      return res.json({userId: userId, posts: userPosts})
    }
    const links = [
      {
        href: "posts/:id",
        rel: ":id",
        type: "GET",
      },
    ];
    res.json({ posts, links });
  })
  .post((req, res, next) => {
    if (req.body.userId && req.body.title && req.body.content) {
      const post = {
        id: posts[posts.length - 1].id + 1,
        userId: req.body.userId,
        title: req.body.title,
        content: req.body.content,
      };

      posts.push(post);
      res.json(posts[posts.length - 1]);
    } else next(error(400, "Insufficient Data"));
  });


router
  .route("/:id")
  .get((req, res, next) => {
    const post = posts.find((p) => p.id == req.params.id);
    const links = [
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "PATCH",
      },
      {
        href: `/${req.params.id}`,
        rel: "",
        type: "DELETE",
      },
    ];

    if (post) res.json({ post, links });
    else next();
  })
  .patch((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        for (const key in req.body) {
          posts[i][key] = req.body[key];
        }
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  })
  .delete((req, res, next) => {
    const post = posts.find((p, i) => {
      if (p.id == req.params.id) {
        posts.splice(i, 1);
        return true;
      }
    });

    if (post) res.json(post);
    else next();
  });

router
  .route("/:id/comments")
  .get((req, res, next) => {
    if (req.query.userId){
      const userId = Number(req.query.userId);
      const userComments = comments.filter((c) => c.userId == userId); 
      res.json({userId: userId, comments: userComments}); 

      if (isNaN(userId)) return next(error(400, "Invalid user ID"))
    } 
    const id = Number(req.params.id);
    const userComments = comments.filter((c) => c.id == id); 
    res.json({id: id, comments: userComments});
});

module.exports = router;