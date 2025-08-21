import { Op } from "sequelize";
import Event from "../database/models/event";
import { buildDate, hasValue } from "../utils/parseQuery";
import EventRequest from "../database/models/eventRequest";
import User from "../database/models/user";

export const addEvent = async (eventData) => {
  const { startDate, endDate, startTime, endTime } = eventData;

  const start = buildDate(startDate, startTime);
  const end = buildDate(endDate, endTime);

  if (end <= start) {
    return {
      success: false,
      error: "Event end datetime must be after start datetime.",
    };
  }

  const event = await Event.create(eventData);

  return {
    success: true,
    data: event,
  };
};

export const getAllEvents = async (
  search,
  page = 1,
  limit = 10,
  isFeatured
) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};
  if (search) {
    whereCondition[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (isFeatured) whereCondition.isFeatured = true;

  const { rows: events, count: total } = await Event.findAndCountAll({
    where: { ...whereCondition },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const enrichedResults = events.map((entry) => {
    const start = buildDate(entry.startDate, entry.startTime);
    const end = buildDate(entry.endDate, entry.endTime);

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const isEventUpcoming = istNow < start;
    const isEventGoing = istNow >= start && now <= end;

    return {
      ...entry.toJSON(),
      isEventUpcoming,
      isEventGoing,
    };
  });

  return {
    data: enrichedResults,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getAllEventRequests = async (page = 1, limit = 10, search) => {
  const offset = (page - 1) * limit;

  const whereCondition: any = {};
  if (search) {
    whereCondition[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows, count } = await EventRequest.findAndCountAll({
    where: whereCondition,
    include: [
      {
        model: Event,
        as: "events",
      },
      {
        model: User,
        as: "users",
        attributes: ["id", "name", "email", "mobile"],
      },
    ],
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    data: rows,
    total: count,
    currentPage: page,
    totalPages: Math.ceil(count / limit),
  };
};

export const updateEventService = async (eventId, payload) => {
  let { startDate, endDate, startTime, endTime } = payload;

  const event = await Event.findOne({ where: { id: eventId } });

  if (!event)
    return {
      success: false,
      error: "Event not found.",
    };

  if (!hasValue(startDate)) startDate = event.startDate;
  if (!hasValue(endDate)) endDate = event.endDate;
  if (!hasValue(startTime)) startTime = event.startTime;
  if (!hasValue(endTime)) endTime = event.endTime;

  const start = buildDate(startDate, startTime);
  const end = buildDate(endDate, endTime);

  if (end <= start) {
    return {
      success: false,
      error: "Event end datetime must be after start datetime.",
    };
  }

  const updateData: Record<string, any> = {};

  const updatableFields = [
    "email",
    "mobile",
    "organiserName",
    "image",
    "title",
    "description",
    "startDate",
    "endDate",
    "startTime",
    "endTime",
    "location",
    "document",
    "website",
  ];

  for (const field of updatableFields) {
    if (field in payload) {
      updateData[field] = payload[field];
    }
  }

  const [, updated] = await Event.update(updateData, {
    where: { id: eventId },
    returning: true,
  });

  return {
    success: true,
    message: "Event updated successfully.",
    data: updated[0],
  };
};

export const requestToJoinEvent = async (userId, eventId) => {
  const eventRequest = await EventRequest.findOne({
    where: {
      userId,
      eventId,
    },
  });

  if (eventRequest) {
    return {
      success: false,
      error: "User already has raised request to register for this event.",
    };
  }

  await EventRequest.create({ userId, eventId });

  return {
    success: true,
  };
};
