setTimeout(function () {
  document.querySelector(".msgBox").style.display = "none";
}, 4000);

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

document.querySelector("#bt1").addEventListener("click", () => {
  document.querySelector(
    "#bt1"
  ).innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
});

document.querySelector("#bt2").addEventListener("click", () => {
  document.querySelector(
    "#bt2"
  ).innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
});
