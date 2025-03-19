let currentMood = '';  // Store the current mood

// Select emoji buttons and add event listeners
const emojiButtons = document.querySelectorAll('.button');
const calendar = document.querySelector(".calneder");
const moodhistory = document.querySelector(".moodhistory");

// Load mood history from localStorage
function loadMoodHistory() {
  const storedMoodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];  // Retrieve saved history
  storedMoodHistory.forEach(entry => {
    displayMoodHistory(entry.mood, entry.date);  // Display stored mood history
  });
}

// Display mood history
function displayMoodHistory(mood, date) {
  const mooddetail = document.createElement('div');
  mooddetail.classList.add("mooddetail");

  const moodstatus = document.createElement('div');
  moodstatus.classList.add('moodstatus');
  moodstatus.innerText = mood;

  const moodtime = document.createElement("div");
  moodtime.classList.add('moodtime');
  moodtime.innerText = date;  // Display date

  mooddetail.appendChild(moodstatus);
  mooddetail.appendChild(moodtime);

  moodhistory.appendChild(mooddetail);
}

// Add event listener to each emoji button
emojiButtons.forEach(button => {
  button.addEventListener('click', function () {
    currentMood = button.getAttribute('data-mood');  // Get the selected mood
    
    const now = new Date();
    const formattedTime = getFormattedDate(now);  // Format date/time

    const newMoodEntry = { mood: currentMood, date: formattedTime };  // New mood entry

    // Update mood history in localStorage
    const storedMoodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    storedMoodHistory.push(newMoodEntry);
    localStorage.setItem('moodHistory', JSON.stringify(storedMoodHistory));

    updateCalendarMood(currentMood);  // Update today's calendar mood
    displayMoodHistory(currentMood, formattedTime);  // Display new mood history
  });
});

// Generate the calendar
function generateCalendar() {
  calendar.innerHTML = '';  // Clear existing content

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();  // Get current month (0-11)
  const currentYear = currentDate.getFullYear();

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Create header row with day names
  daysOfWeek.forEach(day => {
    const dayCell = document.createElement("div");
    dayCell.classList.add("header");
    dayCell.innerText = day;
    calendar.appendChild(dayCell);
  });

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Create empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");
    calendar.appendChild(emptyCell);
  }

  // Create cells for each day in the month
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.innerHTML = day;

    // Highlight today's date
    if (day === currentDate.getDate() && currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
      dayCell.classList.add("today");
    }

    // Check and apply mood for this day
    const storedMood = getMoodForDay(day, currentMonth, currentYear);
    if (storedMood) {
      applyMoodToDay(dayCell, storedMood);  // Apply background color based on stored mood
    }

    calendar.appendChild(dayCell);
  }

  const totalCells = firstDayOfMonth + totalDaysInMonth;  // Total cells in the calendar
  const fullGridCells = 42;  // Total cells for a complete calendar grid (6 rows * 7 columns)
  const totalEmptyCells = fullGridCells - totalCells;  // Calculate empty cells to complete the grid
  
  // Add empty cells to fill the calendar grid
  for (let i = 0; i < totalEmptyCells; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("empty");  // Empty cell styling
    calendar.appendChild(emptyCell);
  }
}

// Update today's date background color based on selected mood
function updateCalendarMood(currentMood) {
  const todayCell = document.querySelector(".calneder .today");  // Find today's calendar cell

  if (todayCell && currentMood) {
    switch (currentMood) {
      case 'Happy':
        todayCell.style.backgroundColor = 'green';  // Green for Happy mood
        break;
      case 'Sad':
        todayCell.style.backgroundColor = 'blue';  // Blue for Sad mood
        break;
      case 'Angry':
        todayCell.style.backgroundColor = 'red';  // Red for Angry mood
        break;
      case 'Chill':
        todayCell.style.backgroundColor = 'lightblue';  // Light blue for Chill mood
        break;
      case 'Hugging':
        todayCell.style.backgroundColor = 'purple';  // Purple for Hugging mood
        break;
      case 'Tired':
        todayCell.style.backgroundColor = 'gray';  // Gray for Tired mood
        break;
      default:
        todayCell.style.backgroundColor = '';  // Reset if no mood selected
        break;
    }
  }

  storeMoodForDay(currentMood);  // Save today's mood
}

// Apply mood color to a specific day cell
function applyMoodToDay(dayCell, mood) {
  switch (mood) {
    case 'Happy':
      dayCell.style.backgroundColor = 'green';  // Green for Happy
      break;
    case 'Sad':
      dayCell.style.backgroundColor = 'blue';  // Blue for Sad
      break;
    case 'Angry':
      dayCell.style.backgroundColor = 'red';  // Red for Angry
      break;
    case 'Chill':
      dayCell.style.backgroundColor = 'lightblue';  // Light Blue for Chill
      break;
    case 'Hugging':
      dayCell.style.backgroundColor = 'purple';  // Purple for Hugging
      break;
    case 'Tired':
      dayCell.style.backgroundColor = 'gray';  // Gray for Tired
      break;
    default:
      dayCell.style.backgroundColor = '';  // Reset to default
      break;
  }
}

// Store the selected mood for a specific day
function storeMoodForDay(mood) {
  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  // Retrieve existing mood data from localStorage
  const storedMoods = JSON.parse(localStorage.getItem('calendarMoods')) || {};

  // Store the mood for today
  storedMoods[`${year}-${month + 1}-${day}`] = mood;

  // Save updated moods in localStorage
  localStorage.setItem('calendarMoods', JSON.stringify(storedMoods));
}

// Retrieve the mood for a specific day
function getMoodForDay(day, month, year) {
  const storedMoods = JSON.parse(localStorage.getItem('calendarMoods')) || {};
  return storedMoods[`${year}-${month + 1}-${day}`];  // Return mood for the specified day
}

// Format current date (DD/MM/YYYY HH:MM AM/PM)
function getFormattedDate(now) {
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
}

// Generate and display the calendar
generateCalendar();

// Load mood history on page load
document.addEventListener('DOMContentLoaded', function () {
  loadMoodHistory();
});
