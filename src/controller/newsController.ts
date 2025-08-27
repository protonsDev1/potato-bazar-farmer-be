import {
  createNewsService,
  listNewsService,
  getNewsByIdService,
  updateNewsService,
  deleteNewsService,
} from "../services/newsService";

export const createNews = async (req, res) => {
  try {
    req.body.createdBy= req.user.role;
    const result = await createNewsService(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const listNews = async (req, res) => {
  try {
    const {
      search = "",
      page = 1,
      perPage = 10,
      category,
      isFeatured,
    } = req.query;
    const result = await listNewsService({
      search: search.toString(),
      page: Number(page),
      limit: Number(perPage),
      category,
      isFeatured,
    });
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const result = await getNewsByIdService(req.params.id, req.user);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const result = await updateNewsService(req.params.id, req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const result = await deleteNewsService(req.params.id);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const createNewsAI = async (req, res) => {
  try {
    const result = await createNewsService(req.body);
    return res.status(result.statusCode).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
