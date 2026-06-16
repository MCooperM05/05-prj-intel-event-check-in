// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// Track attendance
let count = 0;
const maxCount = 50;

// Handle Form
form.addEventListener("submit", function (event) {
  event.preventDefault();

  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, teamName);

  // Increment count
  count++;
  const totalCounter = document.getElementById("attendeeCount");
  totalCounter.textContent = count;
  console.log("Total check-ins: ", count);

  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  // // Show welcome message
  // const message = `🎉 Welcome, ${name} from ${teamName}!`;
  // const greetingElement = document.getElementById("greeting");
  // greetingElement.textContent = message;
  // greetingElement.style.display = "block";

  // Check if goal is reached
  if (count >= maxCount) {
    // Get team counts to find winning team
    const waterCount = parseInt(document.getElementById("waterCount").textContent);
    const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
    const powerCount = parseInt(document.getElementById("powerCount").textContent);

    // Find the team with the most attendees
    let winningTeam = "Team Water Wise";
    let maxTeamCount = waterCount;

    if (zeroCount > maxTeamCount) {
      winningTeam = "Team Net Zero";
      maxTeamCount = zeroCount;
    }
    if (powerCount > maxTeamCount) {
      winningTeam = "Team Renewables";
      maxTeamCount = powerCount;
    }

    // Display celebration message
    const greetingElement = document.getElementById("greeting");
    greetingElement.textContent = `🎊 Goal reached! ${winningTeam} is winning! 🎊`;
    greetingElement.style.display = "block";
    greetingElement.style.backgroundColor = "#fff3cd";
    greetingElement.style.color = "#856404";
    greetingElement.style.fontSize = "20px";
    greetingElement.style.fontWeight = "bold";

    // Disable the form
    form.style.opacity = "0.5";
    form.style.pointerEvents = "none";
    document.getElementById("checkInBtn").disabled = true;
  } else {
    // Show welcome message
    const message = `🎉 Welcome, ${name} from ${teamName}!`;
    const greetingElement = document.getElementById("greeting");
    greetingElement.textContent = message;
    greetingElement.style.display = "block";
    greetingElement.style.backgroundColor = "#e8f4fc";
    greetingElement.style.color = "#003c71";
    greetingElement.style.fontSize = "18px";
    greetingElement.style.fontWeight = "500";
  }

  form.reset();
});
