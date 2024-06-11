// ===== FUNCTION FOR MEDICINE HISTORY TABLE DATA =====
async function medicineData() {

  let medicineData = await fetch('/get-history-data');
  medicineData = await medicineData.json();

  if (medicineData.length < 1) {
    document.getElementById('tbody').innerHTML = `<tr><td colspan="6">No data found</td></tr>`;
  } else {

    medicineData.forEach((medicine, index) => {
      if (medicine.recurring_type == null) {
        medicine.recurring_type = "One time"
        medicine.end_date = '-';
      }

      let html = `<tr>
                  <td>${++index}</td>
                  <td>${medicine.name}</td>
                  <td>${medicine.start_date.slice(0, 10)}</td>
                  <td>${medicine.end_date.slice(0, 10)}</td>
                  <td>${medicine.time}</td>
                  <td>
                    <p onclick="show('popup', '${medicine.id}')" class="details-btn">View</p>
                    <p onclick="deleteMedicine('${medicine.id}')" class="details-btn">Delete</p>
                  </td>
                </tr>`;

      document.getElementById('tbody').innerHTML += html;
    });
  }

}


// ===== GETTING ID OF POPUP =====
funcId = function (id) {
  try {
    return document.getElementById(id);
  } catch (error) {
    console.error(error);
  }
}

// ===== SHOW POPUP FUNCTION =====
let show = async function (id, medicine_id) {
  try {
    const url = `/particular-history`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ medicine_id: medicine_id }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const result = await response.json();
    let html;
    if (result.length < 1) {
      html = `<div class="medicine-name-section">
              <div class="medicine-card">
                <h3> Data Not Found !! </h3>
              </div>
            </div>
            <p class="details-btn" onclick="hide('popup')"> Close </p>`;

    } else {

      if (result.recurring_type == null) {
        result.recurring_type = "One time"
        result.end_date = '-';
      }
      let days = [];
      if (result.day == null) {
        days.push('-');
      }
      else {
        result.day.split(',').forEach((day) => {
          if (day == '0') { days.push(' sunday') }
          if (day == '1') { days.push(' monday') }
          if (day == '2') { days.push(' tuesday') }
          if (day == '3') { days.push(' wednesday') }
          if (day == '4') { days.push(' thursday') }
          if (day == '5') { days.push(' friday') }
          if (day == '6') { days.push(' saturday') }
        })
      }

      html = `<div class="medicine-name-section">
            <div class="medicine-card">
              <h3> ${result.name}
              </h3>
              <div class="medicine-detail">
                <div class="medicine-more-detail">
                  <p><span class="bold-text">Start Date :</span>
                    ${result.start_date.slice(0, 10)}
                  </p>
                  <p><span class="bold-text">End Date :</span>
                    ${result.end_date.slice(0, 10)}
                  </p>
                  <p><span class="bold-text">Day :</span>
                    ${days}
                  </p>
                </div>
                <div class="medicine-more-detail">
                  <p><span class="bold-text">Time :</span>
                    ${result.time}
                  </p>
                  <p><span class="bold-text">schedule :</span>
                    ${result.medication_timing}
                  </p>
                  <p><span class="bold-text">Type :</span>
                    ${result.recurring_type}
                  </p>
                </div>
              </div>
              <div class="description">
                <p><span class="bold-text">Description :</span>
                  ${result.description ?? "<span style='color:red'>No Data Found</span>"}
                </p>
              </div>
            </div>
          </div>

          <p class="details-btn" onclick="hide('popup')"> Close </p>`;
    }

    funcId(id).innerHTML = html;
    funcId(id).style.display = 'block';

  } catch (error) {
    console.error(error);
  }
}


// ===== HIDE POPUP FUNCTION =====
let hide = function (id) {
  try {
    funcId(id).style.display = 'none';
  } catch (error) {
    console.error(error);
  }
}


let deleteMedicine = async (medicine_id) => {

  await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0969da",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Delete it!"
  }).then(async (result) => {
    if (result.isConfirmed) {

      let response = await fetch(`/delete-medicine`, {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ medicine_id: medicine_id }),
      });
      // let response = await fetch(`/delete-medicine/${medicine_id}`);
      // response = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: "Deleted!",
          text: "medicine deleted successfully.",
          icon: "success"
        });
        location.reload();
      }
    }
  });
}
