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

  getRequest() {
    axios
      .get(this.domainUrl + path, {
        headers: {
          Authorization: "Bearer " + this.getToken,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }

  handleError(err) {
    if (err.response?.status == 401) {
      this.logoutUser();
    }
    alertify.error("Invalid login credentials.");
  }

  logoutUser() {
    this.removeToken();
  }

  setToken(token) {
    localStorage.setItem(this.tokenIdName, token.access_token);
    localStorage.setItem(this.refreshTokenIdName, token.refresh_token);
    return true;
  }
  getToken() {
    return localStorage.getItem(this.tokenIdName);
  }

  removeToken() {
    localStorage.removeItem(this.tokenIdName);
    localStorage.removeItem(this.refreshTokenIdName);
    return true;
  }
}

const appService = new AppService();
