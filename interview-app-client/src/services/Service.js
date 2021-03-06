import config from "../config/config";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Request-Method": "*",
  "Access-Control-Request-Headers": "*",
  Authorization: `Bearer ${
    localStorage.getItem("token")
      ? localStorage.getItem("token").replaceAll('"', "")
      : null
  }`,
};

function joinURL(baseUrl, uri) {
  return `${baseUrl}/${uri}`;
}

/**
 * ApiFactory is a class which is used to build instance for consuming multiple services
 * Depending on client needs.
 */
class ApiFactory {
  constructor(apiUrl) {
    this.domain = apiUrl;
  }

  /**
   * Creates instance for using resources service api
   */
  static getResourceApiInstance(params) {
    return new ApiFactory(config.RESOURCES);
  }

  /**
   * Creates instance for using authentication service
   */
  static getAuthServiceInstance(params) {
    return new ApiFactory(config.AUTH_SERVICE);
  }

  request(url, method = "POST", data = null) {
    url = joinURL(this.domain, url);
    const options = {
      credentials: "same-origin",
      headers,
      method,
    };

    if (data != null) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options);
  }

  abortableRequest(url, method = "POST", data = null, signal) {
    url = joinURL(this.domain, url);
    const options = {
      signal,
      credentials: "same-origin",
      headers,
      method,
    };

    if (data != null) {
      options.body = JSON.stringify(data);
    }

    return fetch(url, options);
  }

  async get(url, id, abortSignal) {
    const method = "GET";
    if (id) {
      url = `${url}/${id}`;
    }

    const res = abortSignal
      ? await this.abortableRequest(url, method, null, abortSignal).then(
          (res) => {
            this.handleStatusCode(res.status);
            return res.json();
          }
        )
      : await this.request(url, method).then((res) => {
          this.handleStatusCode(res.status);
          return res.json();
        });
    return res;
  }

  async post(url, data) {
    const method = "POST";
    const res = await this.request(url, method, data);
    return res;
  }

  async patch(url, data) {
    const fullURL = joinURL(this.domain, data);
    const method = "PATCH";
    const res = await this.request(url, method, data);
    return res;
  }

  handleStatusCode(statusCode) {
    if (statusCode == 401) {
      localStorage.clear();
      window.location.href = "login";
    }
    if (statusCode == 500) {
      throw { message: "Server currently unavailable." };
    }
    if (statusCode == 404) {
      throw { message: "Resource not found" };
    }
  }
}

export default ApiFactory;
