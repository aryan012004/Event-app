import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; 
import { Link } from "react-router-dom";

function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  // Retrieve the upcoming events from localStorage on component mount
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('todoList')) || [];
    
    console.log("Stored Events: ", storedEvents); // Debugging: Check the structure of events

    // Filter to show only upcoming events based on the current date
    const currentEvents = storedEvents.filter(event => {
      const eventEndDate = new Date(event.endDate); // Convert endDate to Date object
      const today = new Date(); // Current date
      console.log("Event End Date:", eventEndDate, "Today's Date:", today); // Debugging
      return eventEndDate >= today; // Only keep future or ongoing events
    });

    setUpcomingEvents(currentEvents);
  }, []);

  return (
    <div className="container-fluid">
      {/* Upcoming Events */}
      <section className="upcoming-events py-5">
        <div className="container">
          <h2 className="text-center mb-4">Upcoming Events</h2>
          <div className="row">
            {upcomingEvents.length === 0 ? (
              <p className="text-center">No upcoming events.</p>
            ) : (
              upcomingEvents.map(event => (
                <div className="col-md-4" key={event.id}>
                  <div className="card">
                    {event.image ? (
                      <img 
                        src={event.image} 
                        alt={event.task} 
                        className="card-img-top" 
                        style={{ height: "300px", objectFit: "cover" }} 
                      />
                    ) : (
                      <img 
                        src="https://via.placeholder.com/300" 
                        alt="Event" 
                        className="card-img-top" 
                        style={{ height: "200px", objectFit: "cover" }} // Image Styling
                      />
                    )}
                    <div className="card-body">
                      <h5 className="card-title">{event.task}</h5>
                      <h5 className="card-title">{event.taskdetail}</h5>
                      <p className="card-text">Date: {new Date(event.endDate).toLocaleDateString()}</p>
                      <p className="card-text">Location: {event.location}</p>
                      {/* Update the Link to redirect to the specific event page */}
                      <Link to={`/view/${event.id}`} className="btn btn-primary">
                        View Task
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="services-offered py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">Services We Offer</h2>
          <div className="row">
            <div className="col-md-4 text-center">
              <i className="bi bi-calendar-check display-3 mb-3"></i>
              <h4>Event Planning</h4>
              <p>We offer end-to-end event planning services for weddings, corporate events, and more.</p>
            </div>
            <div className="col-md-4 text-center">
              <i className="bi bi-music-note-list display-3 mb-3"></i>
              <h4>Entertainment & Music</h4>
              <p>We ensure the best entertainment experience with DJs, live bands, and more.</p>
            </div>
            <div className="col-md-4 text-center">
              <i className="bi bi-people-fill display-3 mb-3"></i>
              <h4>Guest Management</h4>
              <p>Efficient guest management solutions with RSVP tracking and seating arrangements.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white py-4">
        <div className="container d-flex justify-content-between align-items-center">
          <p>&copy; 2024 Event Management | All Rights Reserved</p>
          <div className="social-links">
            <a href="#" className="text-white me-3"><i className="bi bi-facebook"></i></a>
            <a href="#" className="text-white me-3"><i className="bi bi-twitter"></i></a>
            <a href="#" className="text-white me-3"><i className="bi bi-instagram"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
