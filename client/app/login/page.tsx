"use client";

import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import API from '../api/axio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setError('');

  try {
    const response = await API.post('/auth/login', formData);
    
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    router.push('/schedule');
  } catch (err) {
    const axiosError = err as { response?: { data?: { message?: string } } };
    setError(axiosError.response?.data?.message || 'Authorization error');
  }
};

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-block">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required/>
        </div>
        <div>
          <label>Password:</label>
          <div className="login-password">
            <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required/>
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" className="login-button">Sign In</button>
      </form>
      <p className="login-register">
        Don&apos;t have an account? <b><Link href="/register" style={{ color: '#308d7f', textDecoration: 'none' }}>Sign up</Link></b>
      </p>
    </div>
  );
}