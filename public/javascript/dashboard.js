// ===== FUNCTION FOR ONGOING MEDICINE TABLE DATA ===== 
async function medicineData() {

  let medicineData = await fetch('/dashboard-data');
  medicineData = await medicineData.json();

  if (medicineData.length < 1) {
    document.getElementById('tbody').innerHTML = `<tr><td colspan="6">No data found</td></tr>`;
  } else {

    medicineData.forEach((medicine, index) => {
      if (medicine.recurring_type == null) {
        medicine.recurring_type = "One time"
        medicine.end_date = '-'
      }

      let html = `<tr>
                  <td>${++index}</td>
                  <td>${medicine.name}</td>
                  <td>${medicine.start_date.slice(0, 10)}</td>
                  <td>${medicine.end_date.slice(0, 10)}</td>
                  <td>${medicine.time}</td>
                  <td>${medicine.recurring_type}</td>
                </tr>`;

      document.getElementById('tbody').innerHTML += html;
    });
  }
}
