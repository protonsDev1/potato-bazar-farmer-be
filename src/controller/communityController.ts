import { Request, Response } from "express";
import CommunityPost from "../database/models/communityPost";
import { Op, Sequelize } from "sequelize";
import CommentCommunity from "../database/models/commentCommunity";
import LikeCommunity from "../database/models/likeCommunity";
import User, { USER_ROLES } from "../database/models/user";

export const createPost = async (req, res) => {
  try {
    const post = await CommunityPost.create({
      userId: req.user.id,
      ...req.body,
    });

    res.status(201).json({ message: "Post submitted for approval", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err });
  }
};

export const getApprovedPosts = async (req, res) => {
  try {
    const { listingType, page = 1, limit = 10, search, category } = req.query;

    const { id: userId } = req.user;

    const offset = (Number(page) - 1) * Number(limit);

    const whereCondition: any = {};

    // listing filter
    if (listingType === "own") {
      whereCondition.userId = userId;
    } else if (listingType === "others") {
      whereCondition.status = "approved";
    }

    // category filter
    if (category) {
      whereCondition.category = category;
    }

    // search filter
    if (search && search.trim() !== "") {
      const searchTerm = `%${search.trim()}%`;

      whereCondition[Op.or] = [
        {
          tags: {
            [Op.overlap]: [search.trim()], //   search in tags
          },
        },
      ];
    }

    const { rows, count } = await CommunityPost.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password_hash", "playerId", "playerIdForWeb"],
          },
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "likeCommunities" AS likes
              WHERE likes."communityId" = "CommunityPost"."id"
            )`),
            "likeCount",
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(*)
              FROM "commentCommunities" AS comments
              WHERE comments."communityId" = "CommunityPost"."id"
            )`),
            "commentCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
      distinct: true,
    });

    return res.json({
      currentPage: Number(page),
      total: count,
      totalPages: Math.ceil(count / Number(limit)),
      posts: rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

export const getAllForAdmin = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";
    const status = req.query.status as string;
    const category = req.query.category as string;

    const offset = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;

    const { rows, count } = await CommunityPost.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password_hash", "playerId", "playerIdForWeb"],
          },
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
            SELECT COUNT(*)
            FROM "likeCommunities" AS likes
            WHERE likes."communityId" = "CommunityPost"."id"
          )`),
            "likeCount",
          ],
          [
            Sequelize.literal(`(
            SELECT COUNT(*)
            FROM "commentCommunities" AS comments
            WHERE comments."communityId" = "CommunityPost"."id"
          )`),
            "commentCount",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load posts" });
  }
};

export const approveRejectPost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const post = await CommunityPost.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ message: "Post not found" });
      return;
    }

    post.status = req.body.status;
    post.adminRemark = req.body.adminRemark;
    await post.save();

    res.json({ message: "Updated", post });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getCommunityPostById = async (req, res) => {
  try {
    const isValidCommunityPost = await CommunityPost.findByPk(req.params.id);

    if (!isValidCommunityPost)
      return res.status(404).json({
        success: false,
        message: "Community Post record not found.",
      });

    const countOfComments = await CommentCommunity.count({
      where: { communityId: req.params.id },
    });
    const countOfLikes = await LikeCommunity.count({
      where: { communityId: req.params.id },
    });

    const communityPost = await CommunityPost.findOne({
      where: {
        id: req.params.id,
      },

      include: [
        {
          model: User,
          as: "user",
          attributes: {
            exclude: ["password_hash", "playerId", "playerIdForWeb"],
          },
        },
        {
          model: CommentCommunity,
          as: "comments",
          include: [
            {
              model: User,
              as: "user",
              attributes: {
                exclude: ["password_hash", "playerId", "playerIdForWeb"],
              },
            },
          ],
        },
        {
          model: LikeCommunity,
          as: "likes",
        },
      ],
    });

    return res.status(200).json({
      success: true,
      message: "Community post detail page retrieved successfully.",
      data: { communityPost, countOfComments, countOfLikes },
    });
  } catch (error) {
    console.error(error, "Error in fetching community post detail page.");
    res.status(500).json({
      success: true,
      message: error.message || "Error in fetching community post detail page.",
    });
  }
};

export const likeOrDislikeCommunityPost = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const communityId = Number(req.params.id);

    const isValidCommunityPost = await CommunityPost.findByPk(communityId);

    if (!isValidCommunityPost)
      return res.status(404).json({
        success: false,
        message: "Community Post record not found.",
      });

    const isExistingCommunityPostLiked = await LikeCommunity.findOne({
      where: { userId, communityId },
    });

    if (isExistingCommunityPostLiked) {
      await LikeCommunity.destroy({ where: { userId, communityId } });
      return res.status(200).json({
        succces: true,
        message: "Community Post un-liked successfully!",
      });
    } else {
      await LikeCommunity.create({ userId, communityId });
      return res.status(200).json({
        success: true,
        message: "Community Post liked successfully!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in like or dislike community post.",
    });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {
    const record = await CommunityPost.findByPk(req.params.id);
    if (!record)
      return res.status(404).json({
        success: false,
        message: "Community Post record not found.",
      });

    await record.destroy();

    return res.status(200).json({
      success: true,
      message: "Community Post record deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in deleting Community Post.",
    });
  }
};

export const postCommentInCommunityPost = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const communityId = Number(req.params.id);
    const { comment } = req.body;

    const isValidCommunityPost = await CommunityPost.findByPk(communityId);

    if (!isValidCommunityPost)
      return res.status(404).json({
        success: false,
        error: "Community Post not found!",
      });

    await CommentCommunity.create({ userId, communityId, comment });
    return res.status(200).json({
      success: true,
      message: "Posted comment on Community Post successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in posting comment in Community Post.",
    });
  }
};

export const deleteCommentOnPost = async (req, res) => {
  try {
    const { id: commentId } = req.params;
    const { id: userId, role } = req.user;

    const isValidCommentId = await CommentCommunity.findByPk(commentId);

    if (!isValidCommentId)
      return res.status(404).json({
        success: false,
        message: "Comment id not found!",
      });

    if (role === USER_ROLES.USER && userId !== isValidCommentId.userId)
      return res.status(401).json({
        success: false,
        message:
          "Only Super Admin, Sub Admin and user who made comment are authorized to delete it.",
      });

    await CommentCommunity.destroy({
      where: {
        id: commentId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in deleting comment in Community Post.",
    });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const communityId = Number(req.params.id);
    const isValidCommunityPost = await CommunityPost.findByPk(communityId);

    if (!isValidCommunityPost)
      return res.status(404).json({
        success: false,
        error: "Community Post not found!",
      });

    const comments = await CommentCommunity.findAll({
      where: {
        communityId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "All Comments fetched for the given post successfully.",
      data: comments,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Error in retrieving all comments in given Community Post.",
    });
  }
};
