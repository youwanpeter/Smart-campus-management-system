import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const LecturerView = () => {
  const [files, setFiles] = useState([]);
  const [lecturerName, setLecturerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    //Get lecturer name from auth token
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setLecturerName(decoded.name);
      
      fetchLecturerFiles(decoded.name);
    }
  }, []);

  const fetchLecturerFiles = async (name) => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/files/lecturer/${name}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setFiles(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load files. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Communication - Files from Students</h1>
      
      {loading ? (
        <p>Loading files...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : files.length === 0 ? (
        <p className="text-gray-500">No files have been shared with you yet.</p>
      ) : (
        <div>
          <ul className="border rounded divide-y">
            {files.map((file) => (
              <li key={file._id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{file.originalFilename}</p>
                    <p className="text-sm text-gray-500">
                      From: {file.studentName} • {new Date(file.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <a
                      href={`/api/files/download/${file._id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LecturerView;