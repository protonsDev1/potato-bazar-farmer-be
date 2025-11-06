import { Op } from "sequelize";
import Event from "../database/models/event";
import { buildDate, hasValue } from "../utils/parseQuery";
import EventRequest from "../database/models/eventRequest";
import User from "../database/models/user";
import Banner from "../database/models/banner";

export const addEvent = async (eventData) => {
  const { startDate, endDate, startTime, endTime, banner } = eventData;

  const start = buildDate(startDate, startTime);
  const end = buildDate(endDate, endTime);

  if (end <= start) {
    return {
      success: false,
      error: "Event end datetime must be after start datetime.",
    };
  }

  const event = await Event.create(eventData);

  if (banner) {
    await Banner.create({
      ...banner,
      eventId: event.id,
    });
  }

  return {
    success: true,
    data: event,
  };
};

export const getAllEvents = async (search, page = 1, limit = 10, filters) => {
  const offset = (page - 1) * limit;

  const {
    isFeatured,
    category,
    district,
    city,
    date,
    dateRange,
    includeExpired,
  } = filters;

  const whereCondition: any = {};

  if (isFeatured) whereCondition.isFeatured = true;

  if (category && category.toLowerCase() !== "all")
    whereCondition.category = category;

  if (district && district.toLowerCase() !== "all")
    whereCondition.district = district;

  if (city && city.toLowerCase() !== "all") whereCondition.city = city;

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

  // expired events filter
  if (!includeExpired || includeExpired === "false") {
    const now = new Date();
    whereCondition.endDate = { [Op.gte]: now };
  }

  if (search) {
    whereCondition[Op.or] = [
      { title: { [Op.iLike]: `%${search}%` } },
      { location: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { rows: events, count: total } = await Event.findAndCountAll({
    where: { ...whereCondition },
    include: [
      {
        model: Banner,
        as: "banner",
        attributes: ["id", "image", "startDate", "endDate"],
      },
    ],
    limit,
    offset,
    order: [["updatedAt", "DESC"]],
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
  const event = await Event.findOne({
    where: { id: eventId },
    include: [
      {
        model: Banner,
        as: "banner",
        attributes: ["id", "image", "startDate", "endDate"],
      },
    ],
  });

  if (!event)
    return {
      success: false,
      error: "Event not found.",
    };

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

  // expired events filter
  const whereCondition: any = {};
  whereCondition.endDate = { [Op.gte]: now };

  const moreEvents = await Event.findAll({
    where: {
      category: event.category,
      id: { [Op.ne]: eventId },
      ...whereCondition,
    },
    order: [["updatedAt", "DESC"]],
    limit: 5,
  });

  const enrichedResults = await Promise.all(
    moreEvents.map(async (entry) => {
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
    success: true,
    event: {
      ...event.toJSON(),
      isEventUpcoming,
      isEventGoing,
      peopleInterested,
    },
    moreEvents: enrichedResults,
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
    order: [["updatedAt", "DESC"]],
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

  const event = await Event.findByPk(eventId, {
    include: [{ model: Banner, as: "banner" }],
  });

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
    "city",
    "location",
    "document",
    "website",
    "contactUrl",
    "isFeatured",
  ];

  for (const field of updatableFields) {
    if (field in payload) {
      updateData[field] = payload[field];
    }
  }

  await Event.update(updateData, { where: { id: eventId } });

  if (payload.banner) {
    if (event.banner) {
      await event.banner.update(payload.banner);
    } else {
      await Banner.create({ ...payload.banner, eventId });
    }
  }
  if ("banner" in payload) {
    if (payload.banner === null) {
      // delete banner
      if (event.banner) await event.banner.destroy();
    } else if (payload.banner) {
      // upsert (update if exists, else create)
      if (event.banner) {
        await event.banner.update(payload.banner);
      } else {
        await Banner.create({ ...payload.banner, eventId });
      }
    }
  }

  const updatedEvent = await Event.findByPk(eventId, {
    include: [{ model: Banner, as: "banner" }],
  });

  return {
    success: true,
    message: "Event updated successfully.",
    data: updatedEvent,
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
