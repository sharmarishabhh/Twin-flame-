import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Import your Firebase configuration
import styles from "./Matches.module.css"; // Import CSS for styling

const Matches = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // State for modal visibility

  // Hardcoded userId
  const userId = "Y7bKDheALOOX92uyS8fkzmIehGI3";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!userId) {
          throw new Error("No user ID provided.");
        }

        // Reference to the specific user's document
        const userDocRef = doc(db, "users", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setProfileData(userDoc.data()); // Set the fetched data
        } else {
          throw new Error("User profile not found.");
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile(); // Fetch the profile data on component mount
  }, []); // No dependencies since userId is hardcoded

  if (loading) return <div>Loading profile...</div>;
  if (error) return <div>{error}</div>;

  // Destructure profile data
  const {
    profile,
    about,
    academicDetails,
    demographicDetails,
    habits,
    interests: interestsArray,
  } = profileData;

  return (
    <div className={styles.profileContainer}>
      <h1 className={styles.title}>Profile</h1>

      {/* Profile Picture */}
      <img
        src={profile?.profile_pictures || "https://via.placeholder.com/150"}
        alt={profile?.name || "Profile Picture"}
        className={styles.profilePicture}
      />

      {/* About Section */}
      <div className={styles.section}>
        <h2>About</h2>
        <p>{about?.description || "No description provided."}</p>
      </div>

      {/* Basic Details */}
      <div className={styles.section}>
        <h2>Basic Details</h2>
        <p><strong>Name:</strong> {profile?.name || "N/A"}</p>
        <p><strong>Date of Birth:</strong> {profile?.dob || "N/A"}</p>
        <p><strong>Gender:</strong> {profile?.gender || "N/A"}</p>
        <p><strong>Zodiac Sign:</strong> {profile?.sign || "N/A"}</p>
        <p><strong>Height:</strong> {profile?.height} cm</p>
        <p><strong>Weight:</strong> {profile?.weight} kg</p>
      </div>

      {/* Buttons */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.actionButton}
          onClick={() => setShowModal(true)} // Open modal
        >
          Accept
        </button>
        <button
          className={styles.rejectButton}
          onClick={() => alert("Reject clicked!")}
        >
          Reject
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <>
          <div className={styles.modalBackdrop} onClick={() => setShowModal(false)} />
          <div className={styles.modal}>
            <h2>Choose an Option</h2>
            <button
              className={styles.modalButton}
              onClick={() => alert("Video Call Selected!")}
            >
              Start Video Call
            </button>
            <button
              className={styles.modalButton}
              onClick={() => alert("Schedule Call Selected!")}
            >
              Schedule Call
            </button>
            <button
              className={styles.modalCloseButton}
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Matches;
