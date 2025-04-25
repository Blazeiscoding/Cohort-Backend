class ApiClient {
  constructor() {
    this.baseURL = "http:localhost:8000/api/v1";
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  async customFetch(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}/${endpoint}`;
      const headers = { ...this.defaultHeaders, ...options.headers };
      const config = {
        ...options,
        headers,
        credentials: "include",
      };
      console.log(`fetching ${url}`);
      const response = await fetch(url, config);
      if (!response) {
        throw new Error("Api Error");
      }
      const data = response.json();
      return data;
    } catch (error) {
      console.error("Api Error", error);
      throw error;
    }
  }

  async signup(name, email, password) {
    return this.customFetch("/users/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
  }
  async login(email, password) {
    return this.customFetch("/users/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
  }

  async logout() {
    return this.customFetch("/users/logout", {
      method: "POST",
    });
  }

  async getProfile(name, email) {
    return this.customFetch("/users/me");
  }
}

const apiClient = new ApiClient();
export default apiClient;
