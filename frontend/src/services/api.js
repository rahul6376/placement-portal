export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

export const authService = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },
};

export const jobService = {
  getAllJobs: async (search = '') => {
    const url = search 
      ? `${API_BASE_URL}/jobs/search?title=${encodeURIComponent(search)}`
      : `${API_BASE_URL}/jobs`;
      
    const token = localStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    
    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error('Failed to fetch jobs');
    return response.json();
  },
  createJob: async (jobData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(jobData)
    });
    if (!response.ok) throw new Error('Failed to create job');
    return response.json();
  },
  updateJob: async (id, jobData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(jobData)
    });
    if (!response.ok) throw new Error('Failed to update job');
    return response.json();
  },
  deleteJob: async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to delete job');
  }
};

export const profileService = {
  getProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/profiles/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },
  saveProfile: async (profileData) => {
    const token = localStorage.getItem('token');
    const headers = { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    const response = await fetch(`${API_BASE_URL}/profiles`, {
      method: 'POST',
      headers,
      body: JSON.stringify(profileData),
    });
    if (!response.ok) throw new Error('Failed to save profile');
    return response.json();
  },
};

export const applicationService = {
  getStudentApplications: async (studentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/applications/student/${studentId}`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Failed to fetch applications');
    return response.json();
  },
  getAllApplications: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/applications`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch all applications');
    return response.json();
  },
  getJobApplications: async (jobId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/applications/job/${jobId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch job applications');
    return response.json();
  },
  applyForJob: async (applicationData) => {
    const token = localStorage.getItem('token');
    const headers = { 
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
    const response = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers,
      body: JSON.stringify(applicationData),
    });
    if (!response.ok) {
       const errData = await response.json().catch(() => null);
       throw new Error(errData?.message || 'Failed to apply for job');
    }
    return response.json();
  },
  updateStatus: async (applicationId, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update application status');
    return response.json();
  }
};

export const userService = {
  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    });
    if (!response.ok) throw new Error('Failed to fetch current user');
    return response.json();
  },
  getAllUsers: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch users');
    return response.json();
  },
  updateRole: async (userId, role) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ role })
    });
    if (!response.ok) throw new Error('Failed to update role');
    return response.json();
  }
};

export const messageService = {
  getConversation: async (user1Id, user2Id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages/conversation?user1Id=${user1Id}&user2Id=${user2Id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch conversation');
    return response.json();
  },
  sendMessage: async (messageData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(messageData)
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  }
};

export const orderService = {
  getOrdersByRole: async (role) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders/role/${role}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },
  getAllOrders: async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Failed to fetch all orders');
    return response.json();
  },
  createOrder: async (orderData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(orderData)
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
  }
};
