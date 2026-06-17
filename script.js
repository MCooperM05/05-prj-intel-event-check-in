// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");

// LocalStorage key
const STORAGE_KEY = "attendanceData";

// Default state used only if nothing is saved yet
const defaultState = {
  count: 0,
  teamCounts: { water: 0, zero: 0, power: 0 },
  attendees: [],
};

// Load saved state from localStorage, falling back to defaults
function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return { ...defaultState };
  try {
    const parsed = JSON.parse(saved);
    return {
      count: parsed.count ?? defaultState.count,
      teamCounts: { ...defaultState.teamCounts, ...parsed.teamCounts },
      attendees: Array.isArray(parsed.attendees) ? parsed.attendees : [],
    };
  } catch {
    return { ...defaultState };
  }
}

// Save current state to localStorage
function saveState() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ count, teamCounts, attendees }),
  );
}

// Track attendance (restored from localStorage if available)
let { count, teamCounts, attendees } = loadState();
const maxCount = 50;

// Render attendee list
function renderAttendeeList() {
  const attendeeList = document.getElementById("attendeeList");
  attendeeList.innerHTML = "";
  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.className = "attendee-list-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "attendee-item-name";
    nameSpan.textContent = attendee.name;

    const teamSpan = document.createElement("span");
    teamSpan.className = "attendee-item-team";
    teamSpan.textContent = attendee.teamName;

    listItem.appendChild(nameSpan);
    listItem.appendChild(teamSpan);
    attendeeList.appendChild(listItem);
  });
}

// Push the restored state into the DOM on page load
function renderInitialState() {
  const totalCounter = document.getElementById("attendeeCount");
  totalCounter.textContent = count;

  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;

  document.getElementById("waterCount").textContent = teamCounts.water;
  document.getElementById("zeroCount").textContent = teamCounts.zero;
  document.getElementById("powerCount").textContent = teamCounts.power;

  renderAttendeeList();

  if (count >= maxCount) {
    form.style.opacity = "0.5";
    form.style.pointerEvents = "none";
    document.getElementById("checkInBtn").disabled = true;
  }
}

renderInitialState();

// Handle Form
form.addEventListener("submit", function (event) {
  event.preventDefault();
  // Get form values
  const name = nameInput.value;
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;
  console.log(name, teamName);
  console.log(team);
  // Increment count
  count++;
  teamCounts[team] = (teamCounts[team] || 0) + 1;
  attendees.push({ name: name, teamName: teamName });
  const totalCounter = document.getElementById("attendeeCount");
  totalCounter.textContent = count;
  console.log("Total check-ins: ", count);
  // Update progress bar
  const percentage = Math.round((count / maxCount) * 100) + "%";
  const progressBar = document.getElementById("progressBar");
  progressBar.style.width = percentage;
  // Update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = teamCounts[team];
  // Render attendee list
  renderAttendeeList();
  // Persist updated counts
  saveState();
  // Check if goal is reached
  if (count >= maxCount) {
    // Get team counts to find winning team(s)
    const waterCount = teamCounts.water;
    const zeroCount = teamCounts.zero;
    const powerCount = teamCounts.power;
    // Find the maximum count
    const maxTeamCount = Math.max(waterCount, zeroCount, powerCount);
    // Find all teams with the maximum count
    const winningTeams = [];
    if (waterCount === maxTeamCount) {
      winningTeams.push("Team Water Wise");
    }
    if (zeroCount === maxTeamCount) {
      winningTeams.push("Team Net Zero");
    }
    if (powerCount === maxTeamCount) {
      winningTeams.push("Team Renewables");
    }
    // Create celebration message based on tie or single winner
    let celebrationMessage = "";
    if (winningTeams.length > 1) {
      celebrationMessage = `🎊 Goal reached! It's a tie between ${winningTeams.join(" and ")}! 🎊`;
    } else {
      celebrationMessage = `🎊 Goal reached! ${winningTeams[0]} wins! 🎊`;
    }
    // Display celebration message
    const greetingElement = document.getElementById("greeting");
    greetingElement.textContent = celebrationMessage;
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
    // Define team colors
    const teamColors = {
      water: "#e8f7fc",
      zero: "#ecfdf3",
      power: "#fff7ed",
    };
    greetingElement.textContent = message;
    greetingElement.style.display = "block";
    greetingElement.style.backgroundColor = teamColors[team];
    greetingElement.style.color = "#003c71";
    greetingElement.style.fontSize = "18px";
    greetingElement.style.fontWeight = "500";
  }
  form.reset();
});
