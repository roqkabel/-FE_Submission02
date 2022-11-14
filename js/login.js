$(function () {
  $("#loginForm").submit(function (e) {
    e.preventDefault();
    let $inputs = $("#loginForm .input");

    let values = {};
    $inputs.each(function () {
      values[this.name] = $(this).val();
    });

    appService.login(values);
  });
});
