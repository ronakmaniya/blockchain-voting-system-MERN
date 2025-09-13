// frontend/src/pages/About.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-title">About Blockchain Voting System</h1>
          <p className="about-subtitle">
            A secure, transparent, and decentralized voting platform built on
            blockchain technology
          </p>
        </div>
      </div>

      <div className="about-content">
        <div className="about-section">
          <h2 className="section-title">🌐 About the Website</h2>
          <div className="section-content">
            <p>
              The Blockchain Voting System is a revolutionary platform that
              leverages the power of blockchain technology to create a secure,
              transparent, and tamper-proof voting system. Built on the MERN
              stack with smart contracts, it ensures that every vote is recorded
              immutably on the blockchain.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure & Transparent</h3>
                <p>
                  Every vote is cryptographically secured and recorded on the
                  blockchain, ensuring complete transparency and immutability.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3>Fast & Efficient</h3>
                <p>
                  Built with modern web technologies for optimal performance and
                  user experience across all devices.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">🌍</div>
                <h3>Decentralized</h3>
                <p>
                  No single point of failure. The system operates on a
                  decentralized network, ensuring reliability and availability.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">📊</div>
                <h3>Real-time Analytics</h3>
                <p>
                  Track voting progress, view statistics, and monitor election
                  results in real-time with our intuitive dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">🛠️ Technology Stack</h2>
          <div className="section-content">
            <div className="tech-stack">
              <div className="tech-category">
                <h3>Frontend</h3>
                <div className="tech-tags">
                  <span className="tech-tag">React 18</span>
                  <span className="tech-tag">Vite</span>
                  <span className="tech-tag">React Router</span>
                  <span className="tech-tag">Axios</span>
                  <span className="tech-tag">CSS3</span>
                </div>
              </div>

              <div className="tech-category">
                <h3>Backend</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Node.js</span>
                  <span className="tech-tag">Express.js</span>
                  <span className="tech-tag">MongoDB</span>
                  <span className="tech-tag">Mongoose</span>
                  <span className="tech-tag">JWT</span>
                </div>
              </div>

              <div className="tech-category">
                <h3>Blockchain</h3>
                <div className="tech-tags">
                  <span className="tech-tag">Solidity</span>
                  <span className="tech-tag">Hardhat</span>
                  <span className="tech-tag">Ethers.js</span>
                  <span className="tech-tag">Ganache</span>
                  <span className="tech-tag">Web3</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">👨‍💻 About the Developer</h2>
          <div className="section-content">
            <div className="developer-card">
              <div className="developer-info">
                <div className="developer-avatar">👨‍💻</div>
                <div className="developer-details">
                  <h3>Blockchain Developer</h3>
                  <p className="developer-role">
                    Full-Stack Blockchain Developer
                  </p>
                  <p className="developer-bio">
                    Passionate about building decentralized applications that
                    solve real-world problems. Specialized in blockchain
                    technology, smart contracts, and modern web development.
                    Committed to creating secure, transparent, and user-friendly
                    solutions.
                  </p>

                  <div className="developer-skills">
                    <h4>Key Skills:</h4>
                    <div className="skills-list">
                      <span className="skill-tag">Blockchain Development</span>
                      <span className="skill-tag">Smart Contracts</span>
                      <span className="skill-tag">Web3 Integration</span>
                      <span className="skill-tag">Full-Stack Development</span>
                      <span className="skill-tag">Security Auditing</span>
                      <span className="skill-tag">UI/UX Design</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">🚀 Project Features</h2>
          <div className="section-content">
            <div className="features-list">
              <div className="feature-item">
                <div className="feature-number">01</div>
                <div className="feature-text">
                  <h4>Smart Contract Integration</h4>
                  <p>
                    Voting logic implemented in Solidity smart contracts for
                    maximum security and transparency.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-number">02</div>
                <div className="feature-text">
                  <h4>Wallet Authentication</h4>
                  <p>
                    Secure authentication using wallet signatures and
                    cryptographic verification.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-number">03</div>
                <div className="feature-text">
                  <h4>Real-time Monitoring</h4>
                  <p>
                    Live election monitoring with automatic status updates and
                    result tracking.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-number">04</div>
                <div className="feature-text">
                  <h4>Responsive Design</h4>
                  <p>
                    Optimized for all devices with modern, intuitive user
                    interface design.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-number">05</div>
                <div className="feature-text">
                  <h4>Pagination System</h4>
                  <p>
                    Efficient data loading with pagination for optimal
                    performance with large datasets.
                  </p>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-number">06</div>
                <div className="feature-text">
                  <h4>Error Handling</h4>
                  <p>
                    Comprehensive error handling and user feedback for smooth
                    user experience.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="about-section">
          <h2 className="section-title">🔗 Get Started</h2>
          <div className="section-content">
            <div className="cta-card">
              <h3>Ready to experience secure voting?</h3>
              <p>
                Join our blockchain voting platform and participate in
                transparent, secure elections.
              </p>
              <div className="cta-buttons">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  🚀 Get Started
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  🔑 Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
