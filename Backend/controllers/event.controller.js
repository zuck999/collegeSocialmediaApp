import { Event } from "../model/event.model.js";

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location, hostedBy, category } = req.body;

        // 1. Validation: Ensure all required fields for the UI are present
        if (!title || !description || !date || !time || !location || !hostedBy) {
            return res.status(400).json({
                message: "Please provide all required event details (title, description, date, time, location, hostedBy)",
                success: false
            });
        }

        // 2. Check if an event with the exact same title and date already exists (Prevent duplicates)
        const existingEvent = await Event.findOne({ title, date });
        if (existingEvent) {
            return res.status(409).json({
                message: "An event with this title already exists for the selected date",
                success: false
            });
        }

        // 3. Create the event in MongoDB
        const newEvent = await Event.create({
            title,
            description,
            date,
            time,
            location,
            hostedBy,
            category: category || 'Academic' // Fallback to Academic if not provided
        });

        return res.status(201).json({
            message: "New event published successfully",
            success: true,
            event: newEvent
        });

    } catch (err) {
        console.error("Event Creation Error:", err);
        return res.status(500).json({
            message: "Internal server error while creating event",
            success: false
        });
    }
};

// Also adding a simple Fetch controller for your Frontend List
export const getUpcomingEvents = async (req, res) => {
    try {
        // Sort by date: 1 for ascending (Soonest first)
        // If you want the most recently ADDED event first, use { createdAt: -1 }
        const events = await Event.find().sort({ date: 1 });
        
        return res.status(200).json({
            success: true,
            events
        });
    } catch (err) {
        console.error("Fetch Events Error:", err);
        return res.status(500).json({
            message: "Failed to load events",
            success: false
        });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const event = await Event.findByIdAndDelete(eventId);

        if (!event) {
            return res.status(404).json({ message: "Event not found", success: false });
        }

        return res.status(200).json({ message: "Event removed successfully", success: true });
    } catch (err) {
        return res.status(500).json({ message: "Server error", success: false });
    }
};