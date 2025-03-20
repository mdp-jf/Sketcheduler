<template>
  <div class="maintenance-container">
    <div class="maintenance-card">
      <div class="logo">A</div>
      <h1>Site Under Maintenance</h1>
      <p>We're currently performing updates to our registration system.</p>
      <p>
        Existing users can still <RouterLink to="/sign-in">sign in</RouterLink>.
      </p>
    </div>
  </div>
</template>

<style scoped>
.maintenance-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #ebf4ff 0%, #dbeafe 100%);
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.maintenance-card {
  max-width: 32rem;
  width: 100%;
  margin: 0 auto;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  text-align: center;
}

.logo {
  width: 4rem;
  height: 4rem;
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1rem;
}

h1 {
  margin-bottom: 1rem;
  color: #1f2937;
}

p {
  margin-bottom: 0.5rem;
  color: #4b5563;
}

a {
  color: #3b82f6;
  font-weight: 500;
  text-decoration: none;
}
</style>
