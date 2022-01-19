const Controller = require('../Controller');
const Helpers = require('../../../utils/Helper');

const { Comment: CommentModel } = require('../../models');

class CommentsController extends Controller {
  constructor () { super(); }

  async createComments(req, res, next) {
    try {
      const MovieId = await req.params.movieId;
      const Comment = req.body.comment;

      /* Confirm The Comment Is Within The Character Limit */
      if (Comment.length >= 500) {
        return super.sendErrorResponse(res, { comment: 'Your comment should not be greater than 500 characters!' }, 'Comment max limit exceeded!', 400);
      }

      /* Create The Comments */
      const createComment = await CommentModel.create({
        ipAddress: req.ip,
        movieId: MovieId,
        username: req.body.username,
        content: Comment,
        createdAt: new Date(global.Date()),
        updatedAt: new Date(global.Date())
      });

      return super.sendSuccessResponse(res, CommentsController.buildComment(createComment), 'Comment saved successfully!', 201);
    } catch (err) {
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  async fetchComments(req, res, next) {
    try {
      const PaginationObject = Helpers.pagination(
        req.query.page,
        req.query.size
      );

      /* Query The Comments */
      let comments = await CommentModel.findAndCountAll({
        limit: PaginationObject.limit,
        offset: PaginationObject.offset,
        where: {
          movieId: req.params.movieId
        },
        order: [["id", "DESC"]],
      });

      /* Check The Retrieved Roles */
      if (comments.rows.length < 1) {
        return super.sendErrorResponse(res, { comments: "No comments available at the moment. Please, try again later!" }, 400);
      }

      /* Parse The Retrieved Comments */
      comments.rows = comments.rows.map(CommentsController.buildComment);
      comments = Helpers.pagingData(comments, PaginationObject.page, req.query.size);

      return super.sendSuccessResponse(res, comments, `${comments.content.length} comments has been retrieved successfully!`, 200);
    } catch (err) {
      console.log(err);
      return super.sendServerError(
        res,
        "Sorry, something went wrong! Please, try again"
      );
    }
  }

  static buildComment(comment) {
    return {
      id: comment.id,
      ipAddress: comment.ipAddress,
      moviedId: comment.movieId,
      username: comment.username,
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt
    }
  }
}

module.exports = new CommentsController();