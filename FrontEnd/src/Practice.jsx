import React, { useState } from 'react';
import axios from 'axios';
import { 
  Users, GraduationCap, Calendar, 
  MessageCircle, UserPlus, Loader2, ArrowLeft, 
} from 'lucide-react';

import { getDynamicBatches } from './utils/batchHelper';
import { useNavigate } from 'react-router-dom'; // Add this to your imports



// Get faculty array from environment variables
const facultyString = import.meta.env.VITE_FACULTY;
const facultyARR = JSON.parse(facultyString);

const CollegeSocialUI = () => {
  const navigate = useNavigate();

  // --- States ---
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [students, setStudents] = useState([]);
  console.log("KKK>>>",students);
  const [loading, setLoading] = useState(false);

  // --- Dynamic Data ---
  const dynamicBatches = getDynamicBatches(selectedFaculty);

  // --- API Call ---
  const fetchStudents = async (batchString) => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:8000/api/v1/user/directory`, {
        params: {
          faculty: selectedFaculty,
          batch: batchString
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        setStudents(res.data.students);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]); 
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleBatchClick = (batchString) => {
    setSelectedBatch(batchString);
    fetchStudents(batchString);
  };

  // --- View: Faculty Selection ---
  const renderFacultyView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-zinc-600 border-b pb-4">
        <Users size={20} />
        <span className="font-semibold text-lg">Browse by Faculty</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {facultyARR.map(faculty => (
          <button
            key={faculty}
            onClick={() => setSelectedFaculty(faculty)}
            className="group relative overflow-hidden bg-white rounded-2xl shadow-sm border p-8 text-left transition-all hover:shadow-md hover:bg-zinc-50"
          >
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <GraduationCap size={32} />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-800">{faculty.toUpperCase()}</h3>
                <p className="text-zinc-500 text-sm">Click to explore batches</p>
              </div>
              <div className="text-zinc-400 group-hover:translate-x-2 transition-transform">→</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  // --- View: Batch Selection ---
  const renderBatchView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedFaculty(null)} 
          className="p-2 hover:bg-zinc-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{selectedFaculty.toUpperCase()} Batches</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {dynamicBatches.map(batchString => (
          <button
            key={batchString}
            onClick={() => handleBatchClick(batchString)}
            className="bg-white rounded-xl shadow-sm p-6 text-center border-2 border-transparent hover:border-zinc-300 hover:bg-zinc-50 transition-all group"
          >
            <Calendar className="w-10 h-10 mx-auto mb-3 text-zinc-400 group-hover:text-zinc-900 transition-colors" />
            <div className="text-lg font-bold text-gray-800">{batchString}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // --- View: Student Directory ---
// --- View 3: Student Directory ---
const renderStudentsView = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-zinc-100 pb-6">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => setSelectedBatch(null)} 
            className="p-2 hover:bg-zinc-50 border border-zinc-200 rounded-lg transition-all active:scale-95"
          >
            <ArrowLeft size={18} className="text-zinc-600" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">{selectedBatch}</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em]">
              {selectedFaculty} / Directory
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <Loader2 className="animate-spin text-zinc-300" size={28} />
          <p className="text-zinc-400 text-xs font-medium uppercase tracking-widest">Syncing Records</p>
        </div>
      ) : students.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {students.map(student => (
            <div 
              key={student._id} 
              className="group bg-white border border-zinc-200 rounded-xl p-5 hover:border-zinc-900 transition-colors flex flex-col"
            >
              {/* Profile Top Section */}
              <div className="flex items-start gap-4 mb-6">
                <div className="w-14 h-14 rounded-lg bg-zinc-50 border border-zinc-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {student.profilePicture ? (
                    <img src={student.profilePicture} alt="" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <Users size={20} className="text-zinc-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-zinc-900 text-base truncate">
                    {student.username}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 h-8 mt-1 italic">
                    {student.hobby || "No bio recorded."}
                  </p>
                </div>
              </div>

              {/* Redirection Actions */}
              <div className="pt-4 border-t border-zinc-50 flex items-center justify-between">
                <button 
                  onClick={() => navigate(`/profile/${student._id}`)} // REDIRECTION HERE
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 transition-colors underline-offset-4 hover:underline"
                >
                  View Profile
                </button>
                
                <button 
                  className="text-zinc-400 hover:text-zinc-900 transition-colors"
                  onClick={() => navigate(`/chat/${student._id}`)} // Optional: Chat redirection
                >
                  <MessageCircle size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-zinc-100 rounded-2xl">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">No members found.</p>
        </div>
      )}
    </div>
  );
  return (
    <div className="min-h-screen bg-zinc-100 p-6 flex flex-col">
        <div className="bg-white rounded-3xl p-10 flex-1 shadow-sm overflow-y-auto max-w-7xl mx-auto w-full">
            {!selectedFaculty && renderFacultyView()}
            {selectedFaculty && !selectedBatch && renderBatchView()}
            {selectedFaculty && selectedBatch && renderStudentsView()}
        </div>
    </div>
  );
};

export default CollegeSocialUI;