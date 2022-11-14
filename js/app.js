class AppService {
  domainUrl;
  tokenIdName = "authToken";
  refreshTokenIdName = "refreshToken";

  constructor() {
    this.domainUrl = "https://freddy.codesubmit.io";
  }

  login(loginData) {
    axios
      .post(this.domainUrl + "/login", { ...loginData })
      .then((res) => {
        this.setToken(res.data);
        window.location.assign("/dashboard.html");
      })
      .catch((err) => this.handleError(err));
  }

  getRequest(path) {
    return axios
      .get(this.domainUrl + path, {
        headers: {
          Authorization: "Bearer " + this.getToken(),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => this.handleRequestError(err));
  }

  handleError(err) {
    if (err.response?.status == 401) {
      this.logoutUser();
    }
    alertify.error("Invalid login credentials.");
  }

  handleRequestError(err) {
    if (err.response?.status == 401) {
      this.requestRefreshToken();
    }
  }

  requestRefreshToken() {
    axios
      .post(
        this.domainUrl + "/refresh",
        {},
        {
          headers: {
            Authorization: "Bearer " + this.getRefreshToken(),
          },
        }
      )
      .then((res) => {
        let token = res.data;
        localStorage.setItem(this.tokenIdName, token.access_token);
        location.reload();
      })
      .catch((err) => this.handleError(err));
  }

  logoutUser() {
    this.removeToken();
    window.location.assign("/index.html");
  }

  setToken(token) {
    localStorage.setItem(this.tokenIdName, token.access_token);
    localStorage.setItem(this.refreshTokenIdName, token.refresh_token);
    return true;
  }
  getToken() {
    return localStorage.getItem(this.tokenIdName);
  }
  getRefreshToken() {
    return localStorage.getItem(this.refreshTokenIdName);
  }

  removeToken() {
    localStorage.removeItem(this.tokenIdName);
    localStorage.removeItem(this.refreshTokenIdName);
    return true;
  }
}

const appService = new AppService();
