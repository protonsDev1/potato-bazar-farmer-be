import Event from "../database/models/event";
import EventRequest from "../database/models/eventRequest";
import {
  addEvent,
  getAllEventRequests,
  getAllEvents,
  getEventDetail,
  requestToJoinEvent,
  updateEventService,
} from "../services/eventServices";
import { parseFilters } from "../utils/parseQuery";

export const createEvent = async (req, res) => {
  try {
    const response = await addEvent(req.body);

    if (!response.success)
      return res
        .status(400)
        .json({ success: response.success, message: response.error });

    return res.status(201).json({
      success: response.success,
      message: "Event created successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Failed to create event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create event",
      error: error.message,
    });
  }
};

export const retrieveAllEvents = async (req, res) => {
  try {
    const { search, page, perPage: limit } = req.query;

    const filters = parseFilters(req.query);

    const response = await getAllEvents(search, page, limit, filters);

    return res.status(200).json({
      success: true,
      message: "All events retrieved successfully.",
      paginatedData: response,
    });
  } catch (error) {
    console.error("Failed to retrieve all events:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve all events",
      error: error.message,
    });
  }
};

export const retrieveEventDetail = async (req, res) => {
  try {
    const { eventId } = req.params;

    const eventDetail = await getEventDetail(eventId);

    return res.status(200).json({
      success: true,
      message: "Event detail retrived successfully.",
      data: eventDetail,
    });
  } catch (error) {
    console.error("Failed to retrieve event detail:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event detail",
      error: error.message,
    });
  }
};

export const retrieveAllEventRequests = async (req, res) => {
  try {
    const { search, page, perPage: limit } = req.query;
    const paginatedData = await getAllEventRequests(page, limit, search);

    return res.status(200).json({
      success: true,
      message: "All Event Requests",
      paginatedData,
    });
  } catch (error) {
    console.error("Failed to retrieve event requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve event requests",
      error: error.message,
    });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const updatedEventData = await updateEventService(eventId, req.body);

    if (!updatedEventData.success)
      return res.status(400).json({
        success: updatedEventData.success,
        message: updatedEventData.error,
      });

    return res.status(200).json({
      success: updatedEventData.success,
      message: updatedEventData.message,
      updatedData: updatedEventData.data,
    });
  } catch (error) {
    console.error("Failed to update mandi agent:", error);
    return res.status(500).json({
      success: false,
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
        .json({ success: false, message: "Event with given id do not exist." });

    await Event.destroy({ where: { id: eventId } });

    return res
      .status(200)
      .json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    console.error("Failed to delete event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete event",
      error: error.message,
    });
  }
};

export const registerOnEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { id: userId } = req.user;
    const { name, mobile } = req.body;

    const response = await requestToJoinEvent(userId, eventId, name, mobile);

    if (!response.success)
      return res.status(400).json({
        success: response.success,
        message: response.error,
      });

    return res.status(201).json({
      success: response.success,
      message:
        "Request to register on this event has been submitted successfully.",
      data: response.data,
    });
  } catch (error) {
    console.error("Failed to register on event:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register on event",
      error: error.message,
    });
  }
};

export const updateEventStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { requestId } = req.params;

    const isEventExist = await EventRequest.findByPk(requestId);

    if (!isEventExist)
      return res.status(404).json({
        success: false,
        message: "Event request with given user do not exist.",
      });

    await isEventExist.update({ status });

    return res
      .status(200)
      .json({ success: true, message: `Event is ${status} successfully.` });
  } catch (error) {
    console.error("Failed to update event status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update event status",
      error: error.message,
    });
  }
};
