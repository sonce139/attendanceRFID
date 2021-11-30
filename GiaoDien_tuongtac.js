function fetchData() {
  fetch("https://attendance-rfid.herokuapp.com/attendances", {
    method: "GET",
  })
    .then((response) => response.json())
    .then((result) => {
      console.log("Success:", result);
      let html = "";
      if (result.length > 0) {
        result.forEach((user, index) => {
          let htmlSegment = `
          <tr>
          <td>${index + 1}</td>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.classesEnrolled[0]}</td>
          <td></td>
          </tr>
          `;
          html += htmlSegment;
        });
      }
      let container = document.getElementById("container");
      container.innerHTML = html;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
let select = document.getElementById("select-form");
select.addEventListener("change", fetchData);
