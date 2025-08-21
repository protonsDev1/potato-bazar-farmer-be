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

export const getAllEvents = async (search, page = 1, limit = 10, filters) => {
  const offset = (page - 1) * limit;

  const { isFeatured, category, district, date, dateRange } = filters;

  const whereCondition: any = {};

  if (isFeatured) whereCondition.isFeatured = true;

  if (category && category.toLowerCase() !== "all")
    whereCondition.category = category;

  if (district && district.toLowerCase() !== "all")
    whereCondition.district = district;

  if (dateRange && dateRange.length === 2) {
    const [filterStart, filterEnd] = dateRange;

    const startOfDay = new Date(`${filterStart}T00:00:00`);
    const endOfDay = new Date(`${filterEnd}T23:59:59`);

    whereCondition[Op.and] = [
      {
        startDate: { [Op.lte]: endOfDay },
      },
      {
        endDate: { [Op.gte]: startOfDay },
      },
    ];
  }

  if (date) {
    const startOfDay = new Date(`${date}T00:00:00`);
    const endOfDay = new Date(`${date}T23:59:59`);

    whereCondition[Op.and] = [
      {
        startDate: { [Op.lte]: endOfDay },
      },
      {
        endDate: { [Op.gte]: startOfDay },
      },
    ];
  }

  if (search) {
    whereCondition[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: events, count: total } = await Event.findAndCountAll({
    where: { ...whereCondition },
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  const enrichedResults = await Promise.all(
    events.map(async (entry) => {
      const peopleInterested = await EventRequest.count({
        where: { eventId: entry.id },
      });

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
        peopleInterested,
      };
    })
  );

  return {
    data: enrichedResults,
    total,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  };
};

export const getEventDetail = async (eventId) => {
  const event = await Event.findOne({ where: { id: eventId } });

  const start = buildDate(event.startDate, event.startTime);
  const end = buildDate(event.endDate, event.endTime);

  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istNow = new Date(now.getTime() + istOffset);

  const isEventUpcoming = istNow < start;
  const isEventGoing = istNow >= start && now <= end;

  const peopleInterested = await EventRequest.count({
    where: { eventId },
  });

  return {
    event,
    isEventUpcoming,
    isEventGoing,
    peopleInterested,
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
    include: [
      {
        model: Event,
        as: "events",
        where: whereCondition,
      },
      {
        model: User,
        as: "requestedByUser",
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
    "category",
    "title",
    "description",
    "startDate",
    "endDate",
    "startTime",
    "endTime",
    "state",
    "district",
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

export const requestToJoinEvent = async (userId, eventId, name, mobile) => {
  const eventRequest = await EventRequest.findOne({
    where: {
      requestCreatedBy: userId,
      eventId,
      mobile,
    },
  });

  if (eventRequest) {
    return {
      success: false,
      error:
        "User already has raised request for given user to register for this event.",
    };
  }

  const newEventRequest = await EventRequest.create({
    name,
    mobile,
    requestCreatedBy: userId,
    eventId,
  });

  return {
    success: true,
    data: newEventRequest,
  };
};
