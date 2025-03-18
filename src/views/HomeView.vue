<template>
    <main class="home-container">
      <div class="home-card">
        <div class="content-container">
          <!-- Left side panel (only visible on medium screens and larger) -->
          <div class="side-panel">
            <div class="side-panel-content">
              <h2>Welcome Back</h2>
              <p>Your digital journey continues here. Access all your favorite features and content.</p>
            </div>
            <div class="side-panel-footer">
              &copy; 2025 YourApp. All rights reserved.
            </div>
          </div>
          
          <!-- Main content area -->
          <div class="main-content">
            <h1>Welcome Home</h1>
            <p class="subtitle">
              Your personalized dashboard provides quick access to all of your important information and recent activity.
            </p>
            
            <!-- Quick Stats -->
            <div class="stats-container">
              <div class="stat-card blue">
                <p class="stat-label">Recent Activity</p>
                <p class="stat-value">12</p>
              </div>
              <div class="stat-card indigo">
                <p class="stat-label">New Messages</p>
                <p class="stat-value">3</p>
              </div>
              <div class="stat-card purple">
                <p class="stat-label">Upcoming Events</p>
                <p class="stat-value">5</p>
              </div>
            </div>
            
            <div class="action-buttons">
              <button class="btn-primary">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </template>
  
  <style scoped>
  .home-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #ebf4ff 0%, #dbeafe 100%);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .home-card {
    width: 100%;
    max-width: 1024px;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    overflow: hidden;
  }
  
  .content-container {
    display: flex;
    flex-direction: column;
  }
  
  @media (min-width: 768px) {
    .content-container {
      flex-direction: row;
    }
  }
  
  .side-panel {
    display: none;
    background: linear-gradient(135deg, #2563eb 0%, #4338ca 100%);
    color: white;
    padding: 2.5rem;
  }
  
  @media (min-width: 768px) {
    .side-panel {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 33.333333%;
    }
  }
  
  .side-panel h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
  }
  
  .side-panel p {
    color: #bfdbfe;
    margin-bottom: 2rem;
    line-height: 1.6;
  }
  
  .side-panel-footer {
    font-size: 0.875rem;
    color: #bfdbfe;
  }
  
  .main-content {
    padding: 2.5rem;
    flex: 1;
  }
  
  .main-content h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 1rem;
  }
  
  .subtitle {
    color: #4b5563;
    font-size: 1.125rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  
  .stats-container {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  @media (min-width: 640px) {
    .stats-container {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .stat-card {
    background-color: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    border: 1px solid #f3f4f6;
  }
  
  .stat-card.blue {
    background-color: #eff6ff;
    border-color: #dbeafe;
  }
  
  .stat-card.indigo {
    background-color: #eef2ff;
    border-color: #e0e7ff;
  }
  
  .stat-card.purple {
    background-color: #f5f3ff;
    border-color: #ede9fe;
  }
  
  .stat-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #1f2937;
  }
  
  .stat-card.blue .stat-label {
    color: #1e40af;
  }
  
  .stat-card.indigo .stat-label {
    color: #3730a3;
  }
  
  .stat-card.purple .stat-label {
    color: #5b21b6;
  }
  
  .stat-value {
    font-size: 1.875rem;
    font-weight: 700;
    color: #1f2937;
    margin-top: 0.5rem;
  }
  
  .action-buttons {
    display: flex;
    justify-content: flex-end;
  }
  
  .btn-primary {
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 0.375rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .btn-primary:hover {
    background-color: #2563eb;
  }
  </style>