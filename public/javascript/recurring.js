// ===== FUNCTION ON RECURRING TYPE CHANGE =====
function recurringTypeChange(value) {
  try {

    if (value == 'daily') {
      document.getElementById('day-dropdown').style.display = 'none';
      document.getElementById('day').classList.remove("validateInput");
    }
    if (value == 'weekly') {
      document.getElementById('day-dropdown').style.display = 'inline';
      document.getElementById('day').classList.add("validateInput");
    }

  } catch (error) {
    console.error(error);
  }
}

// ===== FUNCTION FOR MEDICINE FIELDS VALIDATION =====
function validate() {
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
    });

    return isvalid;

  } catch (error) {
    console.error(error);
  }
}

let addMedicine = document.getElementById('addMedicine')

addMedicine.addEventListener("click", async (e) => {
  e.preventDefault();
  await addreccuringFun();
});

addMedicine.addEventListener('keyup', async function (e) {
  try {
    if (e.key === 'Enter') {
      e.preventDefault();
      await addreccuringFun();
    }
  } catch (error) { console.error(error); }
});

// ===== FUNCTION FOR ADD MEDICINE =====
async function addreccuringFun() {
  try {

    if (validate()) {
      const form = document.getElementById('form');
      const formData = new URLSearchParams(new FormData(form));

      let data = await fetch('/add-medicine', {
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
    }

  } catch (error) {
    console.error(error);
  }
}
