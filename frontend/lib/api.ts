import { authenticatedFetch, API_BASE_URL } from './supabase'

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth-login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
    return response.json()
  },

  register: async (username: string, email: string, password: string, name?: string) => {
    const response = await fetch(`${API_BASE_URL}/auth-register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email, password, name }),
    })
    return response.json()
  },

  logout: async () => {
    // Supabase handles logout automatically
    return { success: true }
  }
}

// User Profile API
export const userAPI = {
  getProfile: async (userId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/user-profile/${userId}`)
    return response.json()
  },

  updateProfile: async (userId: string, profileData: any) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/user-profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(profileData),
    })
    return response.json()
  }
}

// Moon Calendar API
export const moonAPI = {
  getCurrentPhase: async () => {
    const response = await fetch(`${API_BASE_URL}/moon-calendar/current`)
    return response.json()
  },

  getPhases: async () => {
    const response = await fetch(`${API_BASE_URL}/moon-calendar/phases`)
    return response.json()
  },

  getCalendar: async () => {
    const response = await fetch(`${API_BASE_URL}/moon-calendar`)
    return response.json()
  }
}

// Charts API
export const chartsAPI = {
  getCharts: async (userId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/charts?user_id=${userId}`)
    return response.json()
  },

  createChart: async (chartData: any) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/charts`, {
      method: 'POST',
      body: JSON.stringify(chartData),
    })
    return response.json()
  },

  updateChart: async (chartId: string, chartData: any) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/charts/${chartId}`, {
      method: 'PUT',
      body: JSON.stringify(chartData),
    })
    return response.json()
  },

  deleteChart: async (chartId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/charts/${chartId}`, {
      method: 'DELETE',
    })
    return response.json()
  }
}

// Matching API
export const matchingAPI = {
  getProfiles: async (userId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/matching/profiles/${userId}`)
    return response.json()
  },

  analyzeCompatibility: async (user1Id: string, user2Id: string, relationshipType: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/matching/analyze`, {
      method: 'POST',
      body: JSON.stringify({ user1Id, user2Id, relationshipType }),
    })
    return response.json()
  },

  likeUser: async (userId: string, targetUserId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/matching/like`, {
      method: 'POST',
      body: JSON.stringify({ userId, targetUserId }),
    })
    return response.json()
  },

  passUser: async (userId: string, targetUserId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/matching/pass`, {
      method: 'POST',
      body: JSON.stringify({ userId, targetUserId }),
    })
    return response.json()
  }
}

// Coaching API
export const coachingAPI = {
  requestSession: async (sessionData: any) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/coaching/session-request`, {
      method: 'POST',
      body: JSON.stringify(sessionData),
    })
    return response.json()
  },

  getSessions: async (userId: string) => {
    const response = await authenticatedFetch(`${API_BASE_URL}/coaching/sessions/${userId}`)
    return response.json()
  }
}

// Knowledge API
export const knowledgeAPI = {
  getItems: async (type?: string) => {
    const url = type ? `${API_BASE_URL}/knowledge?type=${type}` : `${API_BASE_URL}/knowledge`
    const response = await fetch(url)
    return response.json()
  },

  getItem: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/knowledge/${id}`)
    return response.json()
  }
}
