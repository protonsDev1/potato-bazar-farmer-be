import { Request, Response } from "express";
import CommunityPost from "../database/models/communityPost";
import { Op, Sequelize } from "sequelize";
import CommentCommunity from "../database/models/commentCommunity";
import LikeCommunity from "../database/models/likeCommunity";
import User, { USER_ROLES } from "../database/models/user";
import { PERMISSIONS } from "../utils/constants/permissions";
import { canUpdateResource } from "../utils/commonCode";
import { sendNotificationService } from "../services/notificationService";
import { NotificationType } from "../database/models/notification";
import ReportOnCommunityPost from "../database/models/ReportOnCommunityPost";

export const createPost = async (req, res) => {
  try {
    const post = await CommunityPost.create({
      userId: req.user.id,
      ...req.body,
    });

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: `New Community Post Created.`,
      description: `A new community post has been created. Please review and verify its details.`,
      senderId: req.user.id,
      referenceType: NotificationType.COMMUNITY_POSTS,
      referenceId: post.id,
      receiverId: superAdmin.id,
    });

    return res
      .status(201)
      .json({ success: true, message: "Post submitted for approval", post });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to create post", error: err });
  }
};

export const updatePost = async (req, res) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    const hasPermission = await canUpdateResource(
      req.user,
      post.userId,
      PERMISSIONS.COMMUNITY,
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        statusCode: 403,
        message: "You are not allowed to update this post",
      });
    }

    // if (post.status === "approved") {
    //   return res.status(400).json({
    //     success: false,
    //     statusCode: 400,
    //     message:
    //       "Post is already approved. You cannot update an approved post.",
    //   });
    // }

    if (post.status !== "pending") {
      req.body.status = "pending";

      const superAdmin = await User.findOne({
        where: { role: USER_ROLES.SUPER_ADMIN },
      });

      await sendNotificationService({
        title: `Community Post Updated.`,
        description: `A community post has been updated. Please review and verify its details.`,
        senderId: req.user.id,
        referenceType: NotificationType.COMMUNITY_POSTS,
        referenceId: post.id,
        receiverId: superAdmin.id,
      });
    }

    await post.update(req.body);

    return res
      .status(200)
      .json({ success: true, message: "Post updated successfully", post });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to update post", error: err });
  }
};

export const getApprovedPosts = async (req, res) => {
  try {
    const {
      listingType,
      page = 1,
      limit = 10,
      state,
      district,
      search,
      category,
      isFavourite,
    } = req.query;

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

    const userWhereCondition: any = {};

    if (state) {
      userWhereCondition.state = state;
    }

    if (district) {
      userWhereCondition.district = district;
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

    let favouritePostIds: number[] = [];

    if (isFavourite === "true" && userId) {
      const likedPosts = await LikeCommunity.findAll({
        where: { userId },
        attributes: ["communityId"],
      });

      favouritePostIds = likedPosts.map((l) => l.communityId);

      if (favouritePostIds.length === 0) {
        return res.status(200).json({
          success: true,
          currentPage: Number(page),
          total: 0,
          totalPages: 0,
          posts: [],
        });
      }

      whereCondition.id = { [Op.in]: favouritePostIds };
    }

    const { rows, count } = await CommunityPost.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          where: Object.keys(userWhereCondition).length
            ? userWhereCondition
            : undefined,
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
          [
            Sequelize.literal(`(
        SELECT CASE 
          WHEN COUNT(*) > 0 THEN true 
          ELSE false 
        END
        FROM "likeCommunities" AS likes
        WHERE likes."communityId" = "CommunityPost"."id"
        AND likes."userId" = ${userId}
      )`),
            "isLiked",
          ],
        ],
      },
      order: [["createdAt", "DESC"]],
      limit: Number(limit),
      offset,
      distinct: true,
    });

    return res.status(200).json({
      success: true,
      currentPage: Number(page),
      total: count,
      totalPages: Math.ceil(count / Number(limit)),
      posts: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
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

    res.status(200).json({
      success: true,
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load posts" });
  }
};

export const approveRejectPost = async (req, res) => {
  try {
    const post = await CommunityPost.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    post.status = req.body.status;
    post.adminRemark = req.body?.adminRemark;
    await post.save();

    await sendNotificationService({
      title: `Your Community Post is ${post.status}`,
      description:
        post.status === "approved"
          ? "Your community post has been approved!"
          : `Your community post was rejected. Reason: ${post.adminRemark}`,
      senderId: req.user.id,
      receiverId: post.userId,
      referenceType: NotificationType.COMMUNITY_POSTS,
      referenceId: post.id,
    });

    return res.status(200).json({
      success: true,
      message: `Post is ${post.status} successfully`,
      post,
    });
  } catch (err) {
    console.error("Error in approving/rejecting post:", err);
    return res.status(500).json({
      success: false,
      message: err.message || "Failed to update post status",
    });
  }
};

export const getCommunityPostById = async (req, res) => {
  try {
    const { id: userId } = req.user;

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

      attributes: {
        include: [
          [
            Sequelize.literal(`(
          SELECT CASE 
            WHEN COUNT(*) > 0 THEN true 
            ELSE false 
          END
          FROM "likeCommunities" AS likes
          WHERE likes."communityId" = "CommunityPost"."id"
          AND likes."userId" = ${userId}
        )`),
            "isLiked",
          ],
        ],
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

    const isOwner = communityPost.userId === userId;

    return res.status(200).json({
      success: true,
      message: "Community post detail page retrieved successfully.",
      data: { communityPost, countOfComments, countOfLikes, isOwner },
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
    const { role, id: userId } = req.user;
    const record = await CommunityPost.findByPk(req.params.id);
    if (!record)
      return res.status(404).json({
        success: false,
        message: "Community Post record not found.",
      });

    if (role === USER_ROLES.USER && userId !== record.userId)
      return res.status(401).json({
        success: false,
        message:
          "Only Super Admin, Sub Admin and user who made comment are authorized to delete it.",
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

export const reportOnPost = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const communityId = Number(req.params.postId);
    const { reason } = req.body;

    const isValidCommunityPost = await CommunityPost.findByPk(communityId);

    if (!isValidCommunityPost)
      return res.status(404).json({
        success: false,
        message: "Community Post not found!",
      });

    if (userId === isValidCommunityPost.userId) {
      return res.status(400).json({
        success: false,
        message: "You cannot report your own post.",
      });
    }

    await ReportOnCommunityPost.create({
      userId,
      postId: communityId,
      reason,
    });

    return res.status(200).json({
      success: true,
      message: "Community Post reported successfully!",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Error in reporting the given Community Post.",
    });
  }
};

export const getAllReportsForPost = async (req, res) => {
  try {
    const { status, search, page = 1, perPage: limit = 10 } = req.query;

    const offset = (Number(page) - 1) * Number(limit);

    const whereCondition: any = {};

    if (status) {
      whereCondition.status = status;
    }

    if (search) {
      whereCondition[Op.or] = [
        { "$user.name$": { [Op.iLike]: `%${search}%` } },
        { "$post.title$": { [Op.iLike]: `%${search}%` } },
      ];
    }

    const { count, rows } = await ReportOnCommunityPost.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "mobile"],
        },
        {
          model: CommunityPost,
          as: "post",
        },
      ],
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "All reports fetched successfully.",
      currentPage: Number(page),
      total: count,
      totalPages: Math.ceil(count / Number(limit)),
      data: rows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Error in retrieving all reports for the given Community Post.",
    });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { id: reportId } = req.params;
    const { status } = req.body;

    const report = await ReportOnCommunityPost.findByPk(reportId);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found!",
      });
    }

    report.status = status;
    await report.save();

    return res.status(200).json({
      success: true,
      message: "Report status updated successfully!",
      data: report,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error.message || "Error in updating the status of the given report.",
    });
  }
};
