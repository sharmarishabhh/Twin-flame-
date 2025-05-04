// src/Navbar.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase'; // Firebase imports
import { doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore methods
import './profile.css'; // Import styling
import Home_button from './home_button';

const Navbar = () => {
  const [profileData, setProfileData] = useState(null); // Store user data
  const [isEditing, setIsEditing] = useState(false); // Toggle between view/edit mode
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    height: '',
    weight: '',
    gender: '',
  });

  const user = auth.currentUser; // Get the authenticated user

  // Fetch user profile data from Firestore
  useEffect(() => {
    const fetchProfileData = async () => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfileData(data);
            setFormData(data.profile || {}); // Initialize form with existing data
          } else {
            console.log('No profile data found!');
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      }
    };

    fetchProfileData();
  }, [user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save updated profile data to Firestore
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        profile: formData,
      });
      setProfileData((prev) => ({ ...prev, profile: formData }));
      setIsEditing(false); // Switch back to view mode
    } catch (error) {
      console.error('Error saving profile data:', error);
    }
  };

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <div className="top-navbar">
        <h1>Your LoveConnect</h1>
        <nav>
          <ul>
            <li><Home_button/></li>
            <li>Messages</li>
            <li>Settings</li>
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Left Vertical Navbar */}
        <div className="vertical-navbar">
          <ul>
            <li>Dashboard</li>
            <li>Matches</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>

        {/* Right Content Area */}
        <div className="content-area">
          {isEditing ? (
            <form className="form-container" onSubmit={handleSave}>
              <h1>Edit Profile</h1>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="dob">Date of Birth</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
              />

              <label htmlFor="height">Height (cm)</label>
              <input
                type="number"
                id="height"
                name="height"
                value={formData.height}
                onChange={handleChange}
                required
              />

              <label htmlFor="weight">Weight (kg)</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                required
              />

              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <button type="submit">Save</button>
            </form>
          ) : profileData ? (
            <div className="profile-content">
              <div
                className="profile-image"
                style={{
                  backgroundImage: `url(${profileData.profilePicture || 'default-profile.jpg'})`,
                }}
              ></div>

              <h2>Welcome, {profileData.profile?.name || 'User'}!</h2>
              <p>
                <strong>Date of Birth:</strong> {profileData.profile?.dob || 'N/A'}
              </p>
              <p>
                <strong>Height:</strong> {profileData.profile?.height || 'N/A'} cm
              </p>
              <p>
                <strong>Weight:</strong> {profileData.profile?.weight || 'N/A'} kg
              </p>
              <p>
                <strong>Gender:</strong> {profileData.profile?.gender || 'N/A'}
              </p>

              <button onClick={() => setIsEditing(true)} className="edit-button">
                Edit Profile
              </button>
            </div>
          ) : (
            <p>Loading profile data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
