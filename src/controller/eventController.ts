import Event from "../database/models/event";
import {
  addEvent,
  getAllEvents,
  updateEventService,
} from "../services/eventServices";
import { buildDate } from "../utils/parseQuery";

export const createEvent = async (req, res) => {
  try {
    const response = await addEvent(req.body);

    if (!response.success)
      return res.status(400).json({ message: response.error });
    return res.status(201).json({
      message: "Event created successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return res.status(500).json({
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const retrieveAllEvents = async (req, res) => {
  try {
    const { search, page, perPage: limit, status } = req.query;

    const response = await getAllEvents(search, page, limit, status);

    return res.status(200).json({
      message: "All events retrieved successfully.",
      paginatedData: response,
    });
  } catch (error) {
    console.error("Failed to retrieve all events:", error);
    return res.status(500).json({
      message: "Failed to retrieve all events",
      error: error.message,
    });
  }
};

export const retrieveEventDetail = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findOne({ where: { id: eventId } });

    const start = buildDate(event.startDate, event.startTime);
    const end = buildDate(event.endDate, event.endTime);

    const now = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(now.getTime() + istOffset);

    const isEventUpcoming = istNow < start;
    const isEventGoing = istNow >= start && now <= end;

    return res.status(200).json({
      message: "Event detail retrived successfully.",
      data: { ...event.toJSON(), isEventUpcoming, isEventGoing },
    });
  } catch (error) {
    console.error("Failed to retrieve event detail:", error);
    return res.status(500).json({
      message: "Failed to retrieve event detail",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const updatedEventData = await updateEventService(eventId, req.body);

    if (!updatedEventData.success)
      return res.status(400).json({ message: updatedEventData.error });

    return res.status(200).json({
      message: updatedEventData.message,
      updatedData: updatedEventData.data,
    });
  } catch (error) {
    console.error("Failed to update mandi agent:", error);
    return res.status(500).json({
      message: "Failed to update mandi agent",
      error: error.message,
    });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const isEventExist = await Event.findOne({ where: { id: eventId } });

    if (!isEventExist)
      return res
        .status(404)
        .json({ message: "Event with given id do not exist." });

    await Event.destroy({ where: { id: eventId } });

    return res.status(200).json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return res.status(500).json({
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { eventId } = req.params;

    const isEventExist = await Event.findOne({ where: { id: eventId } });

    if (!isEventExist)
      return res
        .status(404)
        .json({ message: "Event with given id do not exist." });

    await isEventExist.update({ status });

    return res
      .status(200)
      .json({ message: `Event is ${status} successfully.` });
  } catch (error) {
    console.error("Failed to update event status:", error);
    return res.status(500).json({
      message: "Failed to update event status",
      error: error.message,
    });
  }
};
