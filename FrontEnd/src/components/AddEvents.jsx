import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Trash2, 
  PlusCircle, 
  Loader2, 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Info,
  AlertCircle
} from "lucide-react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { toast } from "sonner"; // Assuming you use sonner for notifications

function AddEvents() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        hostedBy: 'College Administration',
        category: 'Academic'
    });

    // 1. Fetch Events for Management List
    const fetchEvents = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/v1/event/all');
            // Adjust based on your API response structure (res.data.events or res.data)
            const data = res.data.events || res.data;
            setEvents(Array.isArray(data) ? data : []);
        } catch (err) {
            toast.error("Failed to load events list");
        } finally {
            setFetchLoading(false);
        }
    };

    useEffect(() => { fetchEvents(); }, []);

    // 2. Handle Inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 3. Create Event (POST)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("works >>>>")
        try {
            const res = await axios.post('http://localhost:8000/api/v1/event/create', formData, {
                withCredentials: true 
            });
            if (res.data.success) {
                toast.success("Event published successfully!");
                // Reset Form
                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    location: '',
                    hostedBy: 'College Administration',
                    category: 'Academic'
                });
                fetchEvents(); // Refresh the list on the right
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Internal Server Error");
        } finally {
            setLoading(false);
        }
    };

    // 4. Delete Event (DELETE)
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this event?")) return;
        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/event/delete/${id}`, {
                withCredentials: true
            });
            if (res.data.success) {
                toast.success("Event deleted");
                setEvents(events.filter(event => event._id !== id));
            }
        } catch (err) {
            toast.error("Could not delete event");
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto min-h-screen bg-gray-50/50">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Event Control Center</h1>
                <p className="text-gray-500 text-sm mt-1">Manage official college happenings and schedules.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* --- FORM SECTION (5 Columns) --- */}
                <div className="lg:col-span-5">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sticky top-8">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                <PlusCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold text-gray-800">Create Event</h2>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Title</label>
                                <Input 
                                    name="title" 
                                    placeholder="e.g. BCA 6th Sem Welcome Program" 
                                    value={formData.title} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1 text-center flex items-center gap-1">
                                        <CalendarIcon className="w-3 h-3"/> Date
                                    </label>
                                    <Input 
                                        type="date" 
                                        name="date" 
                                        value={formData.date} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[11px] font-bold text-gray-400 uppercase ml-1 flex items-center gap-1">
                                        <Clock className="w-3 h-3"/> Time
                                    </label>
                                    <Input 
                                        type="time" 
                                        name="time" 
                                        value={formData.time} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input 
                                        name="location" 
                                        className="pl-10" 
                                        placeholder="Auditorium / Lab / Ground" 
                                        value={formData.location} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1">Host Organization</label>
                                <Input 
                                    name="hostedBy" 
                                    placeholder="e.g. Sports Cell" 
                                    value={formData.hostedBy} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[11px] font-bold text-gray-400 uppercase ml-1 text-center flex items-center gap-1">
                                    <Info className="w-3 h-3"/> Description
                                </label>
                                <Textarea 
                                    name="description" 
                                    placeholder="Provide event details for the students..." 
                                    rows={4}
                                    value={formData.description} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 font-bold rounded-xl"
                                disabled={loading}
                            >
                                {loading ? <Loader2 className="animate-spin mr-2" /> : "Publish to Dashboard"}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* --- LIST SECTION (7 Columns) --- */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-6 border-b bg-gray-50/50 flex justify-between items-center">
                            <h2 className="font-bold text-gray-800">Active Events ({events.length})</h2>
                            {fetchLoading && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {events.map((event) => (
                                <div 
                                    key={event._id} 
                                    className="flex items-center justify-between p-4 border rounded-xl hover:bg-gray-50/50 transition-all border-gray-100 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <Avatar className="h-10 w-10 border">
                                            <AvatarFallback className="bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                                                {event.title.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {event.title}
                                            </p>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                    <CalendarIcon className="w-3 h-3" /> {event.date}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" /> {event.location}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="text-gray-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        onClick={() => handleDelete(event._id)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}

                            {!fetchLoading && events.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                    <AlertCircle className="w-10 h-10 mb-2 opacity-20" />
                                    <p className="text-sm italic">No events found in the database.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default AddEvents;