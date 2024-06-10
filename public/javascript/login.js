//  ===== FUNCTION FOR VALIDATE LOGIN FIELD =====
function validateLogin() {
  try {

    let isvalid = true;

    let validateInput = document.querySelectorAll(".validateInput");

    let validated = document.querySelectorAll(".validated");

    // remove if any error message is in frontend
    if (validated?.length) {
      validated.forEach((item) => {
        item.remove();
      });
    }

    // empty fields and email and phone number validation
    validateInput.forEach((field) => {
      if (field.value.trim() === "") {
        let p = document.createElement("p");
        field.insertAdjacentElement("afterend", p);
        p.innerHTML = "*required";
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
        isvalid = false;
      }

      if (field.name == "email" && field.value.trim() !== "") {
        const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!field.value.match(emailRegex)) {
          let p = document.createElement("p");
          field.insertAdjacentElement("afterend", p);
          p.innerHTML = "Invalid Email syntax";
          p.classList.add("validated");
          p.style.color = "red";
          p.style.margin = "0";
          p.style.fontSize = "12px";
          isvalid = false;
        }
      }
    });

    return isvalid;

  } catch (error) {
    console.error(error);
  }
}

let login = document.getElementById('login');

login.addEventListener("click", async (e) => {
  e.preventDefault();
  await logincheck();
});

login.addEventListener('keyup', async function (e) {
  try {
    if (e.key === 'Enter') {
      e.preventDefault();
      await logincheck();
    }
  } catch (error) { console.error(error); }
});

// ===== FUNCTION FOR LOGIN =====
async function logincheck() {
  try {

    if (validateLogin()) {
      const form = document.getElementById('form');
      const formData = new URLSearchParams(new FormData(form));

      let data = await fetch('/login', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'post',
        body: formData
      })

      data = await data.json();

      if (data.success) {
        window.location.href = `/dashboard`;
      }
      else {
        let p = document.createElement("p");
        document.getElementById('password').insertAdjacentElement("afterend", p);
        p.innerHTML = `${data.message}`;
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
      }
    }

  } catch (error) {
    console.error(error);
  }
}