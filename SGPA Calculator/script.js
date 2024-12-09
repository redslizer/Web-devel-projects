let subjectCount = 1;
let creditsArray = [];

function addSubject() {
    subjectCount++;
    
    let newSubjectHtml = `
        <div class="input-group">
            <label for="grade${subjectCount}">Subject ${subjectCount} Grade:</label>
            <input type="text" class="grade" name="grade[]" required>
            <label for="credits${subjectCount}">Credits:</label>
            <input type="number" class="credits" name="credits[]" min="1" required>
            <button type="button" class="deleteBtn" onclick="deleteSubject(this)">Delete</button>
            <button type="button" class="addBtn" onclick="addSubject()">Add Subject</button>
        </div>
    `;
    
    let subjectsContainer = document.getElementById('subjectsContainer');
    let newSubjectElement = document.createElement('div');
    newSubjectElement.innerHTML = newSubjectHtml;
    subjectsContainer.appendChild(newSubjectElement);
    
    updateSubjectNumbers();
}

function deleteSubject(buttonElement) {
    let subjectDiv = buttonElement.parentElement;
    subjectDiv.remove();
    updateSubjectNumbers();
}

function updateSubjectNumbers() {
    let subjectGroups = document.querySelectorAll('.input-group');
    subjectGroups.forEach((group, index) => {
        let labels = group.querySelectorAll('label');
        labels[0].textContent = Subject ${index + 1} Grade:;
        labels[1].textContent = 'Credits:';
    });
}

function calculateSGPA() {
    let grades = document.querySelectorAll('.grade');
    let creditsInputs = document.querySelectorAll('.credits');
    let studentName = document.getElementById('studentName').value;
    let usn = document.getElementById('usn').value;
    
    let gradeValues = [];
    creditsArray = [];
    
    grades.forEach(grade => gradeValues.push(grade.value.toUpperCase()));
    creditsInputs.forEach(input => creditsArray.push(parseInt(input.value)));
    
    for (let i = 0; i < gradeValues.length; i++) {
        if (isNaN(creditsArray[i]) || creditsArray[i] < 1) {
            alert(Please enter a valid credit value for Subject ${i + 1}.);
            return;
        }
        if (!isValidGrade(gradeValues[i])) {
            alert(Please enter a valid grade (S, A, B, C, D, E, P, F) for Subject ${i + 1}.);
            return;
        }
    }
    
    let totalCredits = creditsArray.reduce((acc, val) => acc + val, 0);
    let totalGradePoints = 0;
    
    for (let i = 0; i < gradeValues.length; i++) {
        totalGradePoints += calculateGradePoint(gradeValues[i]) * creditsArray[i];
    }
    
    let sgpa = totalGradePoints / totalCredits;
    
    let resultElement = document.getElementById('result');
    resultElement.textContent = Your SGPA is: ${sgpa.toFixed(2)};
    
    saveDataToLocal(studentName, usn, sgpa.toFixed(2));
}

function refreshForm() {
    document.getElementById('studentName').value = "";
    document.getElementById('usn').value = "";
    
    let gradeInputs = document.querySelectorAll('.grade');
    let creditsInputs = document.querySelectorAll('.credits');
    
    gradeInputs.forEach(input => input.value = "");
    creditsInputs.forEach(input => input.value = "");
    
    creditsArray = [];
    
    let resultElement = document.getElementById('result');
    resultElement.textContent = "";
}

function isValidGrade(grade) {
    let validGrades = ["S", "A", "B", "C", "D", "E", "P", "F"];
    return validGrades.includes(grade);
}

function calculateGradePoint(grade) {
    switch (grade) {
        case "S": return 10;
        case "A": return 9;
        case "B": return 8;
        case "C": return 7;
        case "D": return 6;
        case "E": return 5;
        case "P": return 4;
        default: return 0;
    }
}

function saveDataToLocal(name, usn, sgpa) {
    let studentData = JSON.parse(localStorage.getItem('studentData')) || [];
    studentData.push({ name, usn, sgpa });
    localStorage.setItem('studentData', JSON.stringify(studentData));
}

function downloadCSV() {
    let studentData = JSON.parse(localStorage.getItem('studentData')) || [];
    if (studentData.length === 0) {
        alert("No data available to download.");
        return;
    }
    
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Name,USN,SGPA\n";
    studentData.forEach(row => {
        csvContent += ${row.name},${row.usn},${row.sgpa}\n;
    });
    
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "student_sgpa_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
