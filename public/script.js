function fetchNames() {
    const value = document.getElementById("valueInput").value;
    
    if (!value) {
        alert("Please enter a value.");
        return;
    }

    fetch(`/fetch-names?value=${value}`)
        .then(response => response.json())
        .then(data => {
            const resultList = document.getElementById("resultList");
            resultList.innerHTML = ""; // Clear previous results

            if (data.length === 0) {
                resultList.innerHTML = "<li>No matches found.</li>";
            } else {
                data.forEach(name => {
                    const li = document.createElement("li");
                    li.textContent = name;
                    resultList.appendChild(li);
                });
            }
        })
        .catch(error => console.error("Error fetching data:", error));
}
