import Event from "../database/models/event";
import EventRequest from "../database/models/eventRequest";
import { NotificationType } from "../database/models/notification";
import {
  addEvent,
  getAllEventRequests,
  getAllEvents,
  getEventDetail,
  requestToJoinEvent,
  updateEventService,
} from "../services/eventServices";
import { sendNotificationService } from "../services/notificationService";
import { parseFilters } from "../utils/parseQuery";
import User, { USER_ROLES } from "../database/models/user";

export const createEvent = async (req, res) => {
  try {
    const { id } = req.user;

    const response = await addEvent(req.body);

    if (!response.success)
      return res
        .status(400)
        .json({ success: response.success, message: response.error });

    await sendNotificationService({
      title: "New Event Created",
      description: `A new event "${response.data.title}" has been added. Check it out now!`,
      senderId: id,
      referenceType: NotificationType.EVENT,
      referenceId: response.data.id,
      isBroadCast: true,
    });

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

    if (!eventDetail.success)
      return res
        .status(404)
        .json({ success: false, message: eventDetail.error });

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

    const isEventExist = await Event.findOne({ where: { id: eventId } });

    if (!isEventExist)
      return res.status(404).json({
        success: false,
        message: "Event with given id do not exist.",
      });

    const response = await requestToJoinEvent(userId, eventId, name, mobile);

    if (!response.success)
      return res.status(400).json({
        success: response.success,
        message: response.error,
      });

    const superAdmin = await User.findOne({
      where: { role: USER_ROLES.SUPER_ADMIN },
    });

    await sendNotificationService({
      title: "Request To Join an Event",
      description: "User is Requesting to join an Event",
      senderId: userId,
      receiverId: superAdmin.id,
      referenceType: NotificationType.EVENT,
      referenceId: eventId,
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
    const { id } = req.user;

    const isEventExist = await EventRequest.findByPk(requestId);

    if (!isEventExist)
      return res.status(404).json({
        success: false,
        message: "Event request with given user do not exist.",
      });

    await isEventExist.update({ status });

    await sendNotificationService({
      title: `Your Event Request has been ${status}`,
      description: `Your request to join event has been ${status}.`,
      senderId: id,
      receiverId: isEventExist.requestCreatedBy,
      referenceType: NotificationType.EVENT,
      referenceId: isEventExist.eventId,
    });

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
