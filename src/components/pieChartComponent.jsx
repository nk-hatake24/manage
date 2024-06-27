import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChartComponent = ({ budgetData }) => {
  const totalPrevisions = budgetData.reduce((sum, item) => sum + item.previsions, 0);
  const totalRealBudget = budgetData.reduce((sum, item) => sum + item.real_budget, 0);

  const data = {
    labels: ['Previsions', 'Real Budget'],
    datasets: [
      {
        data: [totalPrevisions, totalRealBudget],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Total Budget (Previsions vs Real Budget)',
      },
    },
  };

  return <Pie data={data} options={options} />;
};

export default PieChartComponent;
