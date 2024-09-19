import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css"; // Add your custom CSS here

function TaskView() {
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
                      <img src={event.image} alt={event.task} className="card-img-top"   style={{ height: "300px", objectFit: "cover" }} />
                    ) : (
                      <img src="https://via.placeholder.com/300" alt="Event" className="card-img-top" />
                    )}
                    <div className="card-body">
                    <h3>Start Date: {event.task}</h3>
                            <h4>Start Date: {event.taskdeatil}</h4>
                            <p>Start Date: {event.startDate}</p>
                            <p>End Date: {event.endDate}</p>
                            <p>Location: {event.location}</p>
                            <p>Max Attendees: {event.maxAttendees}</p>
                            <p>Event Type: {event.eventType}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

   

    
    </div>
  );
}

export default TaskView;
