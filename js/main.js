$(function () {
  // dashboard chart

  let logout = $(".logout");

  logout.click(() => {
    appService.logoutUser();
  });

  //   check for logged in
  if (!appService.isLoggedIn()) {
    appService.logoutUser();
  }
});
