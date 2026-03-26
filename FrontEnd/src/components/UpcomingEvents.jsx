import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Avatar, AvatarFallback } from './ui/avatar'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog"
import { CalendarDays, MapPin, Clock, Loader2 } from 'lucide-react';

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-x-2.5 text-sm text-gray-700">
    <Icon className="h-5 w-5 text-gray-400 shrink-0" />
    <div>
        <span className="font-semibold">{label}: </span>
        <span>{value}</span>
    </div>
  </div>
);

function UpcomingEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Points to your backend on port 8000
        const res = await axios.get('http://localhost:8000/api/v1/event/all');
        const data = res.data.events || res.data;
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div className="bg-white w-full h-full flex flex-col rounded-lg border shadow-sm">
      <div className="text-md font-semibold p-4 border-b sticky top-0 bg-white z-10 text-gray-900 flex justify-between items-center">
        Upcoming events
        {loading && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
      </div>

      <div className="flex-1 overflow-y-auto">
        {events.length === 0 && !loading ? (
          <div className="p-6 text-center text-gray-400 text-sm">No events found.</div>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              onClick={() => setSelectedEvent(event)}
              className="flex items-center p-3 border-b gap-x-3 hover:bg-gray-50/50 cursor-pointer transition-colors"
            >
              <Avatar className="h-10 w-10 ring-2 ring-blue-50">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium uppercase">
                  {event.title.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="text-sm font-semibold text-gray-900">{event.title}</div>
                <div className="text-gray-500 text-xs">{event.date}</div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden rounded-xl">
          
          {/* Header Section with the Light Blue Tint */}
          <div className="bg-blue-50/70 px-6 py-5 border-b border-blue-100">
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold text-blue-950 tracking-tight">
                {selectedEvent?.title}
              </DialogTitle>
              <div className="flex items-center gap-x-2 text-sm text-blue-800 mt-1">
                <Avatar className="h-5 w-5">
                   <AvatarFallback className="bg-white/70 font-medium text-blue-700 text-[10px] uppercase">
                     {selectedEvent?.hostedBy?.charAt(0) || "A"}
                   </AvatarFallback>
                </Avatar>
                Hosted by: <span className="font-semibold">{selectedEvent?.hostedBy || "Admin"}</span>
              </div>
            </DialogHeader>
          </div>
          
          <div className="p-6 space-y-7">
            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-y-5 gap-x-4 border-b border-gray-100 pb-7">
              <InfoItem icon={CalendarDays} label="Date" value={selectedEvent?.date} />
              <InfoItem icon={Clock} label="Time" value={selectedEvent?.time} />
              <InfoItem icon={MapPin} label="Location" value={selectedEvent?.location} />
            </div>

            {/* Description */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-2.5">About the Event</h4>
              <p className="text-sm text-gray-700 leading-relaxed font-normal">
                {selectedEvent?.description || "No description provided."}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpcomingEvents;