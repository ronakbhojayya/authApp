setTimeout(function () {
  document.querySelector(".msgBox").style.display = "none";
}, 5000);

function loadSignUp() {
  document.querySelector(
    "#signUp"
  ).innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
}

function loadSignIn() {
  document.querySelector(
    "#signIn"
  ).innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
}
