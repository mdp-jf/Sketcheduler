<template>
    <div class="sign-in-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo">A</div>
          <h2>Sign in to your account</h2>
          <p>Or <a href="#">create a new account</a></p>
        </div>
        
        <form @submit.prevent="handleSignin">
          <div class="form-group">
            <label for="email">Email address</label>
            <div class="input-container">
              <input
                id="email"
                type="email"
                v-model="email"
                required
                class="form-input"
                placeholder="you@example.com"
              />
            </div>
          </div>
  
          <div class="form-group">
            <div class="label-row">
              <label for="password">Password</label>
              <a href="#" class="forgot-link">Forgot your password?</a>
            </div>
            <div class="input-container">
              <input
                id="password"
                type="password"
                v-model="password"
                required
                class="form-input"
                placeholder="••••••••"
              />
            </div>
          </div>
  
          <div class="remember-me">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
            />
            <label for="remember-me">Remember me</label>
          </div>
  
          <button type="submit" class="btn-primary sign-in-button" @click="handleSignin">
            Sign in
          </button>
        </form>
        
        
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from "vue";
  import router from "../router/index";
  import { supabase } from "../lib/supabase";
  
  const email = ref("");
  const password = ref("");
  
  const handleSignin = async () => {
    try {
      // Use the Supabase provided method to handle the signin
      const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });
      if (error) throw error;
      router.push("/home");
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };
  </script>
  
  <style scoped>
  .sign-in-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #ebf4ff 0%, #dbeafe 100%);
    padding: 3rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .auth-card {
    max-width: 28rem;
    width: 100%;
    margin: 0 auto;
    background: white;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
    padding: 2rem;
  }
  
  .auth-header {
    text-align: center;
    margin-bottom: 2rem;
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
  
  .auth-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: #1f2937;
  }
  
  .auth-header p {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .auth-header a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
  }
  
  .auth-header a:hover {
    color: #2563eb;
  }
  
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-group label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.5rem;
    color: #4b5563;
  }
  
  .input-container {
    position: relative;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem 0.75rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  
  .form-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }
  
  .label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }
  
  .forgot-link {
    font-size: 0.875rem;
    color: #3b82f6;
    text-decoration: none;
  }
  
  .forgot-link:hover {
    color: #2563eb;
  }
  
  .remember-me {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
  }
  
  .remember-me input {
    margin-right: 0.5rem;
  }
  
  .remember-me label {
    font-size: 0.875rem;
    color: #4b5563;
  }
  
  .sign-in-button {
    width: 100%;
    padding: 0.75rem;
    font-weight: 500;
  }
  
  .social-section {
    margin-top: 1.5rem;
  }
  
  .divider {
    position: relative;
    text-align: center;
    margin: 1.5rem 0;
  }
  
  .divider::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    border-top: 1px solid #e5e7eb;
  }
  
  .divider span {
    position: relative;
    padding: 0 0.5rem;
    background-color: white;
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .social-buttons {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  
  .social-button {
    display: inline-flex;
    justify-content: center;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    background-color: white;
    color: #6b7280;
    transition: background-color 0.2s;
  }
  
  .social-button:hover {
    background-color: #f9fafb;
  }
  
  .social-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  </style>
  