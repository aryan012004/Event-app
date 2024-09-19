import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Dashboard() {
    const [data1, setData1] = useState([]);
    const [to, setTo] = useState({});
    const [user, setUserData] = useState(null);
    const { userId } = useParams();
    const intervals = useRef({});
    const [filters, setFilters] = useState({ date: '', location: '', eventType: '' });
    const [rsvps, setRsvps] = useState([]);

    useEffect(() => {
        const storedUserData = JSON.parse(localStorage.getItem('user'));
        if (storedUserData) {
            setUserData(storedUserData);
        }

        const storedData = JSON.parse(localStorage.getItem('todoList')) || [];
        setData1(storedData);

        const storedRsvps = JSON.parse(localStorage.getItem('rsvps')) || [];
        setRsvps(storedRsvps);
    }, [userId]);

    useEffect(() => {
        if (data1.length > 0) {
            localStorage.setItem('todoList', JSON.stringify(data1));
        }
    }, [data1]);

    const deleteData = (id) => {
        const taskToDelete = data1.find(task => task.id === id);
        if (!taskToDelete.permissions.includes(user.username)) {
            toast.error("You do not have permission to delete this task.");
            return;
        }
        clearInterval(intervals.current[id]);
        const newData = data1.filter(v => v.id !== id);
        setData1(newData);
        toast.error("Event deleted");
    };

    const completeTask = (id) => {
        const taskToComplete = data1.find(task => task.id === id);
        if (!taskToComplete.permissions.includes(user.username)) {
            toast.error("You are not authorized to complete this event.");
            return;
        }
        clearInterval(intervals.current[id]);
        const updatedData = data1.map(task =>
            task.id === id ? { ...task, isCompleted: true } : task
        );
        setData1(updatedData);
        toast.success("Event completed!");
    };

    const setReminder = (task) => {
        toast.info(`Event scheduled on: ${task.endDate}`);
    };

    const getValue = (e) => {
        const { name, value } = e.target;
        setTo({ ...to, [name]: value });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTo({ ...to, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const calculateElapsedTime = (startDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const elapsedMs = now - start;

        const hours = Math.floor(elapsedMs / (1000 * 60 * 60));
        const minutes = Math.floor((elapsedMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((elapsedMs % (1000 * 60)) / 1000);

        return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const Tododata = (e) => {
        e.preventDefault();
        const obj = {
            task: e.target.task.value,
            taskdetail: e.target.taskdetail.value,
            startDate: new Date().toISOString(),
            endDate: e.target.endDate.value,
            location: e.target.location.value,
            maxAttendees: e.target.maxAttendees.value,
            eventType: e.target.eventType.value,
            id: Math.round(Math.random() * 1000),
            isCompleted: false,
            elapsedTime: "0:00:00",
            assignedTo: e.target.assignedTo.value,
            permissions: [user.username],
            image: to.image || ''
        };
        setData1([...data1, obj]);

        intervals.current[obj.id] = setInterval(() => {
            setData1(prevData =>
                prevData.map(task =>
                    task.id === obj.id
                        ? { ...task, elapsedTime: calculateElapsedTime(task.startDate) }
                        : task
                )
            );
        }, 1000);

        toast.success("Event created successfully!");
        toast.info(`Event assigned to ${obj.assignedTo}`);
        e.target.reset();
    };

    const addUserPermission = (id) => {
        const updatedData = data1.map(task => {
            if (task.id === id && !task.permissions.includes(user.username)) {
                return { ...task, permissions: [...task.permissions, user.username] };
            }
            return task;
        });
        setData1(updatedData);
        toast.success(`${user.username} has been added to the event permissions.`);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const filteredEvents = data1.filter(event => {
        return (
            (!filters.date || new Date(event.endDate) >= new Date(filters.date)) &&
            (!filters.location || event.location.includes(filters.location)) &&
            (!filters.eventType || event.eventType === filters.eventType)
        );
    });

    const handleRSVP = (event) => {
        if (event.maxAttendees <= rsvps.filter(r => r.eventId === event.id).length) {
            toast.error("Max attendees reached. You cannot RSVP.");
            return;
        }
        setRsvps([...rsvps, { eventId: event.id, userId: user.username }]);
        localStorage.setItem('rsvps', JSON.stringify([...rsvps, { eventId: event.id, userId: user.username }]));
        toast.success("RSVP successful!");
    };

    return (
        <div style={styles.container}>
            <div style={styles.welcomeBanner}>
                {user ? (
                    <h1>Welcome to your dashboard, {user.username}!</h1>
                ) : (
                    <h1>Loading your dashboard...</h1>
                )}
            </div>

            <h1 style={styles.title}>Add Events</h1>

            {/* Event Filters */}
            <div style={styles.filters}>
                <input type="date" name="date" onChange={handleFilterChange} placeholder="Filter by Date" style={styles.input} />
                <input type="text" name="location" onChange={handleFilterChange} placeholder="Filter by Location" style={styles.input} />
                <select name="eventType" onChange={handleFilterChange} style={styles.input}>
                    <option value="">All Event Types</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Conference">Conference</option>
                    <option value="Meetup">Meetup</option>
                </select>
            </div>

            {/* Event Input Form */}
            <form method="post" onSubmit={Tododata} style={styles.form}>
                <table border={1} cellPadding="10px" style={styles.table}>
                    <tbody>
                        <tr>
                            <td>Event Title:</td>
                            <td>
                                <textarea name="task" style={styles.textarea} onChange={getValue} />
                            </td>
                        </tr>
                        <tr>
                            <td>Event Details:</td>
                            <td>
                                <textarea name="taskdetail" style={styles.textarea} onChange={getValue} />
                            </td>
                        </tr>
                        <tr>
                            <td>Location:</td>
                            <td>
                                <input type="text" name="location" style={styles.input} onChange={getValue} />
                            </td>
                        </tr>
                        <tr>
                            <td>Max Attendees:</td>
                            <td>
                                <input type="number" name="maxAttendees" style={styles.input} onChange={getValue} />
                            </td>
                        </tr>
                        <tr>
                            <td>Event Date: </td>
                            <td>
                                <input type="date" name="endDate" style={styles.input} onChange={getValue} />
                            </td>
                        </tr>
                        <tr>
                            <td>Assign To:</td>
                            <td>
                                <input type="text" name="assignedTo" style={styles.input} onChange={getValue} />
                            </td>
                        </tr>
                        <tr>
                            <td>Event Image:</td>
                            <td>
                                <input type="file" accept="image/*" onChange={handleImageUpload} />
                            </td>
                        </tr>
                        <tr>
                            <td>Event Type:</td>
                            <td>
                                <select name="eventType" style={styles.input} onChange={getValue}>
                                    <option value="">Select Event Type</option>
                                    <option value="Workshop">Workshop</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Meetup">Meetup</option>
                                </select>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <button type="submit" style={styles.button}>Add Event</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </form>

     
            <h2 style={styles.subTitle}>Event List</h2>
            <table border={1} cellPadding="10px" style={styles.table}>
                <thead>
                    <tr>
                        <th>Event Title</th>
                        <th>Details</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Max Attendees</th>
                        <th>Assigned To</th>
                        <th>Elapsed Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEvents.map((task, i) => (
                        <tr key={i} style={task.isCompleted ? styles.completedTask : {}}>
                            <td>{task.task}</td>
                            <td>{task.taskdetail}</td>
                            <td>{task.location}</td>
                            <td>{new Date(task.endDate).toLocaleDateString()}</td>
                            <td>{task.maxAttendees}</td>
                            <td>{task.assignedTo}</td>
                            <td>{task.elapsedTime}</td>
                            <td>
                                <button onClick={() => completeTask(task.id)} style={styles.actionButton}>Complete</button>
                                <button onClick={() => setReminder(task)} style={styles.actionButton}>Set Reminder</button>
                                <button onClick={() => deleteData(task.id)} style={styles.actionButton}>Delete</button>
                                <button onClick={() => addUserPermission(task.id)} style={styles.actionButton}>Add User</button>
                                <button onClick={() => handleRSVP(task)} style={styles.actionButton}>RSVP</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <ToastContainer />
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    welcomeBanner: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center',
    },
    title: {
        fontSize: '30px',
        fontWeight: 'bold',
        color: '#343a40',
        marginBottom: '20px',
    },
    subTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: '#495057',
        marginTop: '30px',
        marginBottom: '15px',
    },
    filters: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px',
    },
    input: {
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ced4da',
        width: '30%',
    },
    form: {
        marginBottom: '30px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    textarea: {
        width: '100%',
        padding: '10px',
        fontSize: '16px',
        borderRadius: '5px',
        border: '1px solid #ced4da',
    },
    button: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
    },
    actionButton: {
        marginRight: '5px',
        padding: '5px 10px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '3px',
        cursor: 'pointer',
    },
    completedTask: {
        backgroundColor: '#d4edda',
    },
};

export default Dashboard;
