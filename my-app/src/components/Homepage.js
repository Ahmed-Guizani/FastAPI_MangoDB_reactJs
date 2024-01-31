import React, { useEffect, useState } from 'react';
import './Homepage.css'; // import the CSS file

function Homepage() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch user data from the API endpoint
    fetch('http://localhost:8000/api/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setUserData(data))
      .catch((error) => console.error(error));
  }, []);

  const username = localStorage.getItem('username');
  const email = localStorage.getItem('email');

  return (
    <div className="container">
      <header className="header">
        <div className="logo">
          <h1 className="text-light">
            <a href="index.html">
              <span>community</span>
            </a>
          </h1>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <a className="active" href="index.html">
                Home
              </a>
            </li>
            <li>
              <a href="services.html">Services</a>
            </li>
            <li>
              <a href="contact.html">Contact Us</a>
            </li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
      </header>
      <section className="hero">
        <div className="heroCarousel">
          <div className="carousel-item active">
            <div className="carousel-container">
              <h2 className="animate__animated animate__fadeInDown">
                Welcome to <span>US</span>
              </h2>
              <p className="animate__animated animate__fadeInUp">
                the CEO is Mr James
              </p>
              <a href="" className="btn-get-started animate__animated animate__fadeInUp">
                Read More
              </a>
            </div>
          </div>
        </div>
      </section>
      {userData ? (
        <p>
          Welcome {username}, {email} to the Hek Platform!
        </p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Homepage;