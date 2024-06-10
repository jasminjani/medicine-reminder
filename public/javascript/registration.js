let register = document.getElementById('register');



// ====== VALIDATION =======


function validate() {
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


    if (
      field.name == "phone_no" &&
      field.value.trim() !== "" &&
      (field.value.trim().length !== 10 ||
        isNaN(field.value) == true)
    ) {
      let p = document.createElement("p");
      field.insertAdjacentElement("afterend", p);
      p.innerHTML = "mobile number should be 10 digit integer";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }

    // date of birth validation
    if (field.name == "dob" && field.value.trim() !== "") {
      if (isNaN(new Date(field.value))) {
        let p = document.createElement("p");
        field.insertAdjacentElement("afterend", p);
        // year.parentElement.parentElement.insertAdjacentElement("afterend", p);
        p.innerHTML = "*Invalid Date";
        p.classList.add("validated");
        p.style.color = "red";
        p.style.margin = "0";
        p.style.fontSize = "12px";
        isvalid = false;
      }
    }
  });

  // ===== blood group validation =====
  if (document.getElementById('blood_group').name == "blood_group" && document.getElementById('blood_group').value.trim() !== "") {
    const bloodRegex = /^(A|B|AB|O)[+-]$/;
    if (!document.getElementById('blood_group').value.match(bloodRegex)) {
      let p = document.createElement("p");
      document.getElementById('blood_group').insertAdjacentElement("afterend", p);
      p.innerHTML = "Invalid blood group";
      p.classList.add("validated");
      p.style.color = "red";
      p.style.margin = "0";
      p.style.fontSize = "12px";
      isvalid = false;
    }
  }


  return isvalid;
}

register.addEventListener("click", async (e) => {
  e.preventDefault();
  await registrationFun();
});

register.addEventListener('keyup', async function (e) {
  try {
    if (e.key === 'Enter') {
      e.preventDefault();
      await registrationFun();
    }
  } catch (error) { console.error(error); }
});

// ===== FUNCTION FOR REGISTER USER =====
async function registrationFun() {
  try {

    if (validate()) {

      // async function register() {
      try {

        // option -1 get value of particular field and append in formData
        // let formData = new FormData();

        // let first_name = document.getElementById('first_name').value;
        // let last_name = document.getElementById('last_name').value;
        // let email = document.getElementById('email').value;
        // let blood_group = document.getElementById('blood_group').value;
        // let phone_no = document.getElementById('phone_no').value;
        // let dob = document.getElementById('dob').value;

        // formData.append("first_name", first_name)
        // formData.append("last_name", last_name)
        // formData.append("email", email)
        // formData.append("blood_group", blood_group)
        // formData.append("phone_no", phone_no)
        // formData.append("dob", dob)


        // optiion - 2 get value of all form together from form tag and give this value to FormData
        const form = document.getElementById('form');
        const formData = new URLSearchParams(new FormData(form));

        let data = await fetch('/add-user', {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          body: formData
        })

        data = await data.json();

        if (data.success) {
          window.location.href = `/login`;
        }

      } catch (error) {
        console.error(error);
      }
    }

  } catch (error) {
    console.error(error);
  }
}
