import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
// const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "bottom",
//     },
//     title: {
//       display: true,
//       text: "Favorites topic",
//     },
//   },
// };
function BarChart({ userList }) {
  const [array, setArray] = useState([]);
  useEffect(() => {
    userList.forEach((user) => {
      user.favorites.forEach((fav) =>
        setArray((array) => [...array, fav.name])
      );
    });
  }, [userList]);
  const counts = {};
  array.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  const data = {
    labels: ["Bussibess", "Travel", "Covid in VietNam", "Social", "Sport"],
    datasets: [
      {
        label: "subcriber",
        data: [
          counts["Bussibess"],
          counts["Travel"],
          counts["Covid in VietNam"],
          counts["Social"],
          counts["Sport"],
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div>
      <Bar data={data} />
    </div>
  );
}

export default BarChart;
