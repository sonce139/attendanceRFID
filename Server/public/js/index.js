
const attendancesTable = document.querySelector("table")
const classSelect = document.getElementById("select_classes")

console.log("index.js")

classSelect.addEventListener("change", function (err) {
  fetch("/attendances").then(function (response) {
    response.json().then(function (data) {
      removeRows()
      
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          const attendance = data[i]

          if (attendance.class_id == classSelect.value) {
            const newRow =attendancesTable.insertRow(-1)
          
            indexCell = newRow.insertCell(0)
            const index = document.createTextNode(i+1)
            indexCell.appendChild(index);
  
            student_idCell = newRow.insertCell(1)
            const student_id = document.createTextNode(attendance.student_id)
            student_idCell.appendChild(student_id);
  
            timeCell = newRow.insertCell(2)
            const time = document.createTextNode(attendance.time)
            timeCell.appendChild(time);
          }
        }
      } else {
        
      }
    })
  })
})

function removeRows () {
  while (attendancesTable.rows.length > 1) {
    attendancesTable.deleteRow(1)
  }
}
