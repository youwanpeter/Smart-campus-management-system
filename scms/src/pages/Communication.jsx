import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Communication = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturer, setSelectedLecturer] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    //Get student name from auth token
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setStudentName(decoded.name);

      //Fetch all files uploaded by this student
      fetchStudentFiles(decoded.name);
    }

    //Fetch list of lecturers
    fetchLecturers();
  }, []);

  const fetchStudentFiles = async (name) => {
    try {
      const response = await axios.get(`/api/files/student/${name}`);
      setUploadedFiles(response.data);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Failed to load your files. Please try again later.");
    }
  };

  const fetchLecturers = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get("/api/lecturers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLecturers(response.data);
    } catch (err) {
      console.error("Error fetching lecturers:", err);
      setError("Failed to load lecturer list. Please try again later.");
    }
  };


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLecturerChange = (e) => {
    setSelectedLecturer(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !selectedLecturer) {
      setError("Please select both a file and a lecturer");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("lecturerName", selectedLecturer);
    formData.append("studentName", studentName);

    try {
      await axios.post("/api/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // Refresh file list
      fetchStudentFiles(studentName);

      // Reset form and close modal
      setFile(null);
      setSelectedLecturer("");
      setShowModal(false);
      setLoading(false);
    } catch (err) {
      console.error("Error uploading file:", err);
      setError("Failed to upload file. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Communication</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add File
        </button>
      </div>

      {/* Files List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Your Uploaded Files</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {uploadedFiles.length === 0 ? (
          <p className="text-gray-500">No files uploaded yet.</p>
        ) : (
          <ul className="border rounded divide-y">
            {uploadedFiles.map((file) => (
              <li key={file._id} className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium">{file.filename}</p>
                  <p className="text-sm text-gray-500">
                    Sent to: {file.lecturerName} • {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/api/files/download/${file._id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Upload File</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select File</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full border p-2 rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Select Lecturer</label>
                <select
                  value={selectedLecturer}
                  onChange={handleLecturerChange}
                  className="w-full border p-2 rounded"
                >
                  <option value="">Choose a lecturer</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer._id} value={lecturer.name}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-red-500 mb-4">{error}</p>}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mr-2 px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-300"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Communication;