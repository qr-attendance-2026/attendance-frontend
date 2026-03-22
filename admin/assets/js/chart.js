new Chart(document.getElementById('chart'), {
  type: 'line',
  data: {
    labels: ['T2','T3','T4','T5','T6'],
    datasets: [{
      label: 'Attendance',
      data: [10,20,15,30,25],
      borderColor: '#22c55e',
      backgroundColor: 'rgba(34,197,94,0.2)',
      fill: true,
      tension: 0.4
    }]
  },
  options: {
    plugins: {
      legend: {
        labels: { color: '#fff' }
      }
    },
    scales: {
      x: { ticks: { color: '#aaa' }},
      y: { ticks: { color: '#aaa' }}
    }
  }
});