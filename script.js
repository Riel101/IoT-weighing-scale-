let ws;
let weightHistory = [];

// Initialize WebSocket
function initWebSocket() {
  ws = new WebSocket(`ws://${location.hostname}:81/`);

  ws.onopen = () => {
    updateStatus('Connected to ESP32', 'success');
  };

  ws.onclose = () => {
    updateStatus('Disconnected. Reconnecting...', 'error');
    setTimeout(initWebSocket, 2000);
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const weight = data.weight;
    const currency = (weight * 0.5).toFixed(2); // Currency conversion logic

    updateDisplay(weight, currency);
    updateChart(weight);
  };
}

// Update Status Message
function updateStatus(message, type) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = message;
  statusElement.style.color = type === 'success' ? '#0078D7' : '#FF0000';
}

// Update Display Values
function updateDisplay(weight, currency) {
  document.getElementById('weight').textContent = `${weight} kg`;
  document.getElementById('currency').textContent = `$${currency}`;
}

// Chart.js Initialization
const ctx = document.getElementById('historyChart').getContext('2d');
const historyChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      {
        label: 'Weight (kg)',
        data: [],
        borderColor: '#0078D7',
        borderWidth: 2,
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Weight (kg)',
        },
        beginAtZero: true,
      },
    },
  },
});

// Update Chart with New Data
function updateChart(weight) {
  const now = new Date().toLocaleTimeString();
  const labels = historyChart.data.labels;
  const data = historyChart.data.datasets[0].data;

  labels.push(now);
  data.push(weight);

  if (labels.length > 10) {
    labels.shift();
    data.shift();
  }

  historyChart.update();
}

// Initialize WebSocket Connection
initWebSocket();
