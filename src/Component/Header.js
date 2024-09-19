import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../App.css";  // Assuming custom styles will go here

function HeaderWithSidebar() {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('user'));
    const [sidebarOpen, setSidebarOpen] = useState(false); // Track sidebar state
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/signin');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen); // Toggle sidebar open/close
    };

    return (
        <div className="d-flex">
            {/* Sidebar */}
            <div className={`sidebar bg-light ${sidebarOpen ? 'open' : ''}`} style={{ width: sidebarOpen ? "250px" : "70px", transition: "width 0.3s" }}>
                <button className="btn-close text-dark" onClick={toggleSidebar} style={{ float: 'right', display: sidebarOpen ? 'block' : 'none' }}>
                    &times;
                </button>
                <nav className="d-flex flex-column p-4">
                    <Link to="/home" className="text-decoration-none text-dark fs-5 mb-3 d-flex align-items-center">
                        <i className="bi bi-house-door me-2"></i>{sidebarOpen && "Home"}
                    </Link>
                    <Link to="/dashboard" className="text-decoration-none text-dark fs-5 mb-3 d-flex align-items-center">
                        <i className="bi bi-align-top me-2"></i>{sidebarOpen && "Add Task"}
                    </Link>
                    <Link to="/about" className="text-decoration-none text-dark fs-5 mb-3 d-flex align-items-center">
                        <i className="bi bi-person me-2"></i>{sidebarOpen && "About"}
                    </Link>
                    <Link to="/contact" className="text-decoration-none text-dark fs-5 mb-3 d-flex align-items-center">
                        <i className="bi bi-gear me-2"></i>{sidebarOpen && "Contact"}
                    </Link>
                    <Link to="/help" className="text-decoration-none text-dark fs-5 mb-3 d-flex align-items-center">
                        <i className="bi bi-question-circle me-2"></i>{sidebarOpen && "Help"}
                    </Link>
                </nav>
            </div>

            {/* Main content */}
            <div className="main-content w-100">
                {/* Header */}
                <header className="bg-primary py-2 px-4 d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center">
                        <button className="btn btn-light me-3" onClick={toggleSidebar}>
                            ☰
                        </button>
                        <Link to="/" className="text-decoration-none text-white fs-3 fw-bold">Logo</Link>
                    </div>
                    
                    <div className="d-flex align-items-center">
                       
                        
                      
                        
                        {/* Logout */}
                        <div>
                            {isLoggedIn ? (
                                <button onClick={handleLogout} className="btn btn-light ms-4">
                                    Logout
                                </button>
                            ) : (
                                <Link to="/signin" className="btn btn-light ms-4">
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </header>

              
            </div>
        </div>
    );
}

export default HeaderWithSidebar;
