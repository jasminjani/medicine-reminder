// ===== FUNCTION FOR PASSWORD VALIDATION =====
function passwordValidation() {
  let isvalid = true;

  let validated = document.querySelectorAll(".validated");

  let validateInput = document.querySelectorAll('.validateInput');

  // remove if any error message is in frontend
  if (validated?.length) {
    validated.forEach((item) => {
      item.remove();
    });
  }

  validateInput.forEach((field) => {

    let p = document.createElement("p");
    field.insertAdjacentElement("afterend", p);
    p.classList.add("validated");
    p.style.color = "red";
    p.style.margin = "0";
    p.style.fontSize = "12px";
    if (field.value.length < 8) {
      p.innerHTML = "password must be at least 8 characters";
      isvalid = false;
    }
    else if (field.value.search(/[a-zA-Z]/i) < 0) {
      p.innerHTML = "password must contain at least one letter";
      isvalid = false;
    }
    else if (field.value.search(/[0-9]/) < 0) {
      p.innerHTML = "password must contain at least one digit";
      isvalid = false;
    }
    else if (field.value.search(/[*?[#@$?]/) < 0) {
      p.innerHTML = "password must contain at least one special character";
      isvalid = false;
    }
    else {
      isvalid = true;
    }
  });

  return isvalid;
}

let submit = document.getElementById('submit');

submit.addEventListener("click", async (e) => {
  e.preventDefault();
  await passwordFun();
});

submit.addEventListener('keyup', async function (e) {
  try {
    if (e.key === 'Enter') {
      e.preventDefault();
      await passwordFun();
    }
  } catch (error) { console.error(error); }
});

// ===== FUNCTION FOR PASSWORD ADDITION =====
async function passwordFun() {
  try {

    if (passwordValidation()) {

      let password = document.getElementById('password').value;
      let verifyPassword = document.getElementById('verify_password').value;

      if (!(password == verifyPassword)) {
        let p = document.createElement("p");
        document.getElementById('verify_password').insertAdjacentElement("afterend", p);
        p.innerHTML = "password does not match";
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
      }
      else if (password == verifyPassword) {

        let form = document.getElementById('form');
        let formData = new URLSearchParams(new FormData(form));

        let activation = window.location.href.split('/').pop();
        let data = await fetch(`/add-password/${activation}`,
          {
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: "POST",
            body: formData
          });

        data = await data.json();

        document.getElementById('submit').style.display = 'none';
        document.getElementById('login').style.display = 'block';
      }
    }

  } catch (error) {
    console.error(error);
  }
}