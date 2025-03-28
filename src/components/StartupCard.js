"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReactDOM from "react-dom"; // Import ReactDOM for createPortal
import "../App.css";
import "./StartupCard.css";

// Icon components
const LinkedInIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const CompanyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const EducationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
  </svg>
);

const WorkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
);

const SkillsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
       strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Add this function to split text into points for better readability
const formatDescriptionAsList = (text) => {
  if (!text) return null;
  
  // Split text by periods, line breaks, or bullets if they already exist
  const sentences = text.split(/[.•\n]+/).filter(sentence => 
    sentence.trim().length > 10 && !sentence.includes('http')
  );
  
  if (sentences.length <= 1) {
    return <p className="description">{text}</p>;
  }
  
  return (
    <ul className="description-list">
      {sentences.map((sentence, idx) => {
        const trimmed = sentence.trim();
        if (trimmed.length < 10) return null;
        return <li key={idx}>{trimmed}</li>;
      })}
    </ul>
  );
};

const StartupCard = ({ data }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  // Apply a more aggressive approach to blocking the page, but allow modal scrolling
  useEffect(() => {
    if (showDetails) {
      // Lock the body
      document.body.classList.add('body-no-scroll');
      
      // Instead of blocking all events, only block them outside the modal
      document.addEventListener('touchmove', preventScrollOutsideModal, { passive: false });
      document.addEventListener('wheel', preventScrollOutsideModal, { passive: false });
    } else {
      document.body.classList.remove('body-no-scroll');
      document.removeEventListener('touchmove', preventScrollOutsideModal);
      document.removeEventListener('wheel', preventScrollOutsideModal);
    }
    
    return () => {
      document.body.classList.remove('body-no-scroll');
      document.removeEventListener('touchmove', preventScrollOutsideModal);
      document.removeEventListener('wheel', preventScrollOutsideModal);
    };
  }, [showDetails]);

  // Only prevent scroll events if they're outside the modal
  const preventScrollOutsideModal = (e) => {
    // Check if the event target is within the modal
    const modalElement = document.querySelector('.detail-modal');
    if (modalElement && !modalElement.contains(e.target)) {
      e.preventDefault();
    }
  };

  const toggleDetails = (e) => {
    // Prevent event bubbling
    if (e) e.stopPropagation();
    
    // Only toggle if not already in transition
    // Add a small debounce to prevent double-toggling
    if (!isToggling) {
      setIsToggling(true);
      setShowDetails((prev) => !prev);
      
      // Reset toggle flag after a small delay
      setTimeout(() => {
        setIsToggling(false);
      }, 300);
    }
  };

  // Determine the college display: use merged colleges if available
  const collegeDisplay = Array.isArray(data.colleges)
    ? data.colleges.join(", ")
    : data.college;

  return (
    <div className="card">
      {/* Source badge */}
      {data.source && (
        <div className={`source-badge ${data.source}`}>
          {data.source === 'linkedin' ? 'LinkedIn' : 'Wellfound'}
        </div>
      )}
      
      {/* Basic info shown on the card */}
      <div className="card-header">
        <h4 className="card-name">
          <a href={data.source === 'wellfound' ? data.wellfoundProfileUrl : data.linkedinProfileUrl} 
             target="_blank" 
             rel="noopener noreferrer">
            {data.firstName} {data.lastName}
          </a>{" "}
          -{" "}
          <a href={data.source === 'wellfound' ? data.wellfoundCompanyUrl : data.linkedinCompanyUrl} 
             target="_blank" 
             rel="noopener noreferrer">
            {data.companyName}
          </a>
        </h4>
        <p className="card-headline">{data.linkedinHeadline || data.wellfoundHeadline}</p>
      </div>

      <div className="card-info">
        <p>
          <strong>College:</strong> {collegeDisplay}
        </p>
        <p>
          <strong>Industry:</strong> {data.companyIndustry}
        </p>
        <p>
          <strong>Company:</strong> {data.companyName}
        </p>
      </div>

      <button onClick={toggleDetails} className="card-button">
        {showDetails ? "Hide Details" : "Show Details"}
      </button>

      {/* The modal with details - now using createPortal */}
      {showDetails && 
        ReactDOM.createPortal(
          <div 
            className="modal-root"
            key="detail-modal-portal"
          >
            <div className="detail-overlay" onClick={toggleDetails}>
              <motion.div
                className="detail-modal"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close button in top-right corner */}
                <button className="close-button" onClick={toggleDetails}>
                  <CloseIcon />
                </button>

                {/* Modal Header */}
                <div className="modal-header">
                  <div className="profile-info">
                    {/* Large Avatar with initials */}
                    <div className="profile-avatar">
                      {data.firstName?.charAt(0)}
                      {data.lastName?.charAt(0)}
                    </div>

                    <div className="profile-main">
                      <h2 className="profile-name">
                        {data.firstName} {data.lastName}
                      </h2>
                      <p className="profile-headline">
                        {data.linkedinHeadline || data.wellfoundHeadline}
                      </p>
                      {data.location && (
                        <p className="profile-location">
                          <LocationIcon /> {data.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="profile-link-section">
                    {data.source === 'linkedin' && data.linkedinProfileUrl && (
                      <a
                        href={data.linkedinProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="profile-link-btn"
                      >
                        <LinkedInIcon /> Profile
                      </a>
                    )}
                  </div>
                </div>

                {/* Modal Body Content */}
                <div className="modal-content">
                  {/* About / Summary */}
                  {data.linkedinDescription && (
                    <div className="detail-section">
                      {formatDescriptionAsList(data.linkedinDescription)}
                    </div>
                  )}

                  {/* Current Position */}
                  {(data.currentJob || data.linkedinJobTitle || data.companyName) && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <WorkIcon /> Current Position
                      </h3>
                      <div className="detail-card">
                        <h4>
                          {data.linkedinJobTitle || "Professional"} at{" "}
                          {data.companyName}
                        </h4>
                        {data.linkedinJobDateRange && (
                          <p className="date-range">{data.linkedinJobDateRange}</p>
                        )}
                        {data.linkedinJobLocation && (
                          <p className="job-location">
                            <LocationIcon /> {data.linkedinJobLocation}
                          </p>
                        )}
                        {data.linkedinJobDescription && (
                          <div className="detail-section">
                            {formatDescriptionAsList(data.linkedinJobDescription)}
                          </div>
                        )}
                        {data.companyIndustry && (
                          <p className="industry">
                            Industry: {data.companyIndustry}
                          </p>
                        )}
                        {data.linkedinCompanyUrl && (
                          <a
                            href={data.linkedinCompanyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="company-link"
                          >
                            <CompanyIcon /> Company Page
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Previous Position */}
                  {(data.previousJob ||
                    data.linkedinPreviousJobTitle ||
                    data.previousCompanyName) && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <WorkIcon /> Previous Position
                      </h3>
                      <div className="detail-card">
                        <h4>
                          {data.linkedinPreviousJobTitle || "Professional"}
                          {data.previousCompanyName && ` at ${data.previousCompanyName}`}
                        </h4>
                        {data.linkedinPreviousJobDateRange && (
                          <p className="date-range">
                            {data.linkedinPreviousJobDateRange}
                          </p>
                        )}
                        {data.linkedinPreviousJobLocation && (
                          <p className="job-location">
                            <LocationIcon /> {data.linkedinPreviousJobLocation}
                          </p>
                        )}
                        {data.linkedinPreviousJobDescription && (
                          <div className="detail-section">
                            {formatDescriptionAsList(data.linkedinPreviousJobDescription)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {(data.currentSchool || data.linkedinSchoolName || collegeDisplay) && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <EducationIcon /> Education
                      </h3>
                      <div className="detail-card">
                        <h4>{data.linkedinSchoolName || collegeDisplay}</h4>
                        {data.linkedinSchoolDegree && (
                          <p className="degree">{data.linkedinSchoolDegree}</p>
                        )}
                        {data.linkedinSchoolDateRange && (
                          <p className="date-range">{data.linkedinSchoolDateRange}</p>
                        )}
                        {data.linkedinSchoolDescription && (
                          <div className="detail-section">
                            {formatDescriptionAsList(data.linkedinSchoolDescription)}
                          </div>
                        )}
                        {data.linkedinSchoolUrl && (
                          <a
                            href={data.linkedinSchoolUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="school-link"
                          >
                            School Page
                          </a>
                        )}
                      </div>

                      {/* Previous School */}
                      {data.previousSchool && (
                        <div className="detail-card">
                          <h4>{data.linkedinPreviousSchoolName}</h4>
                          {data.linkedinPreviousSchoolDegree && (
                            <p className="degree">
                              {data.linkedinPreviousSchoolDegree}
                            </p>
                          )}
                          {data.linkedinPreviousSchoolDateRange && (
                            <p className="date-range">
                              {data.linkedinPreviousSchoolDateRange}
                            </p>
                          )}
                          {data.linkedinPreviousSchoolDescription && (
                            <div className="detail-section">
                              {formatDescriptionAsList(data.linkedinPreviousSchoolDescription)}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Skills */}
                  {data.linkedinSkillsLabel && (
                    <div className="detail-section">
                      <h3 className="section-title">
                        <SkillsIcon /> Skills
                      </h3>
                      <div className="skills-container">
                        {data.linkedinSkillsLabel.split(",").map((skill, index) => (
                          <span key={index} className="skill-tag">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Followers */}
                  {data.linkedinFollowersCount && (
                    <div className="detail-section followers">
                      <h3 className="section-title">LinkedIn Network</h3>
                      <p>
                        <strong>{data.linkedinFollowersCount}</strong> followers
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
};

export default StartupCard;
