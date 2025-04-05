let workouts = [];
let totalCalories = 0;
let totalWorkouts = 0;
let progressChart = null;

if (localStorage.getItem('workouts')) {
  workouts = JSON.parse(localStorage.getItem('workouts'));
  updateDashboard();
  updateChart();
  updateWorkoutLog();
}

function addWorkout() {
  const name = document.getElementById('workout-name').value.trim();
  const calories = parseFloat(document.getElementById('calories-burned').value);
  const datetime = document.getElementById('workout-date').value;

  if (name && !isNaN(calories) && calories > 0 && datetime) {
    const workout = {
      name,
      calories,
      date: new Date(datetime).toLocaleDateString()
    };

    workouts.push(workout);
    localStorage.setItem('workouts', JSON.stringify(workouts));

    updateDashboard();
    updateChart();
    updateWorkoutLog();

    document.getElementById('workout-name').value = '';
    document.getElementById('calories-burned').value = '';
    document.getElementById('workout-date').value = '';
  } else {
    alert("Please enter valid workout details with positive calories and a date.");
  }
}

function updateDashboard() {
  totalCalories = workouts.reduce((total, workout) => total + workout.calories, 0);
  totalWorkouts = workouts.length;

  document.getElementById('total-calories').innerText = totalCalories;
  document.getElementById('total-workouts').innerText = totalWorkouts;
}

function updateChart() {
  const ctx = document.getElementById('progressChart').getContext('2d');

  if (progressChart) {
    progressChart.destroy();
  }

  const labels = workouts.map(workout => workout.date);
  const data = workouts.map(workout => workout.calories);

  progressChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Calories Burned',
        data: data,
        borderColor: '#FF5733',
        backgroundColor: 'rgba(255, 87, 51, 0.2)',
        fill: true,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        }
      },
      aspectRatio: 1.5
    }
  });
}

function updateWorkoutLog() {
  const log = document.getElementById("workout-log");
  log.innerHTML = '';

  workouts.slice().reverse().forEach((workout, indexFromEnd) => {
    const index = workouts.length - 1 - indexFromEnd;

    const item = document.createElement('li');
    item.innerHTML = `
      <strong>${workout.name}</strong> — ${workout.calories} cal<br/>
      <small>${workout.date}</small><br/>
      <button onclick="deleteWorkout(${index})">🗑 Delete</button>
    `;
    log.appendChild(item);
  });
}

function deleteWorkout(index) {
  if (confirm("Are you sure you want to delete this workout?")) {
    workouts.splice(index, 1);
    localStorage.setItem('workouts', JSON.stringify(workouts));
    updateDashboard();
    updateChart();
    updateWorkoutLog();
  }
}