import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const GraphComponent = ({ sellList, transactionList }) => {
  // Récupération et fusion des dates de sellList et transactionList
  const sellDates = sellList.map(item => new Date(item.date));
  const transactionDates = transactionList.map(item => new Date(item.date));
  const allDates = Array.from(new Set([...sellDates, ...transactionDates])).sort((a, b) => a - b);

  // Formater les dates en chaîne de caractères
  const formattedDates = allDates.map(date => date.toLocaleDateString());

  // Création des données pour les deux courbes
  const sellTotalPrices = allDates.map(date => {
    const sellItem = sellList.find(item => new Date(item.date).toLocaleDateString() === date.toLocaleDateString());
    return sellItem ? sellItem.total_price : 0;
  });

  const transactionTotalPrices = allDates.map(date => {
    const transactionItem = transactionList.find(item => new Date(item.date).toLocaleDateString() === date.toLocaleDateString());
    return transactionItem ? transactionItem.total_price : 0;
  });

  const data = {
    labels: formattedDates,
    datasets: [
      {
        label: 'Sell Total Price',
        data: sellTotalPrices,
        borderColor: 'green',
        backgroundColor: 'rgba(0, 255, 0, 0.5)',
        fill: false,
      },
      {
        label: 'Transaction Total Price',
        data: transactionTotalPrices,
        borderColor: 'red',
        backgroundColor: 'rgba(255, 0, 0, 0.5)',
        fill: false,
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
        text: 'Sell vs Transaction Total Prices',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Total Price',
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default GraphComponent;
