import { Request, Response } from "express";
import CommunityPost from "../database/models/communityPost";
import { Op } from "sequelize";


export const createPost = async (req: any, res: Response) => {
  try {
    const post = await CommunityPost.create({
      userId: req.user.id,
      ...req.body
    });

    res.status(201).json({ message: "Post submitted for approval", post });
  } catch (err) {
    res.status(500).json({ message: "Failed to create post", error: err });
  }
};

export const getApprovedPosts = async (req: Request, res: Response) => {
  const posts = await CommunityPost.findAll({
    where: { status: "approved" },
    order: [["createdAt", "DESC"]]
  });

  res.json(posts);
};

export const getAllForAdmin = async (req: Request, res: Response): Promise<void> => {
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
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (status) where.status = status;
    if (category) where.category = category;

    const { rows, count } = await CommunityPost.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit,
      offset
    });

    res.json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to load posts" });
  }
};
export const approveRejectPost = async (
  req: Request,
  res: Response
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
