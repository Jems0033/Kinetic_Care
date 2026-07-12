const Event = require("../models/Event");

// ==========================
// Add Event
// ==========================
const addEvent = async (req, res) => {

    try {

        const event = await Event.create(req.body);

        res.status(201).json({
            message: "Event Added Successfully",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Get All Events
// ==========================
const getEvents = async (req, res) => {

    try {

        const events = await Event.find()
            .sort({ date: 1 });

        res.status(200).json(events);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Get Event By Id
// ==========================
const getEventById = async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {

            return res.status(404).json({
                message: "Event Not Found"
            });

        }

        res.status(200).json(event);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Update Event
// ==========================
const updateEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndUpdate(

            req.params.id,

            req.body,

            { new: true }

        );

        if (!event) {

            return res.status(404).json({
                message: "Event Not Found"
            });

        }

        res.status(200).json({
            message: "Event Updated Successfully",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// ==========================
// Delete Event
// ==========================
const deleteEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {

            return res.status(404).json({
                message: "Event Not Found"
            });

        }

        res.status(200).json({
            message: "Event Deleted Successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    addEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};