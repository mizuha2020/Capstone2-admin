import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
function DoughChart({ userList }) {
  const [array, setArray] = useState([]);
  useEffect(() => {
      userList.forEach((user) => setArray((array) => [...array, user.role]));
  }, [userList]);
  const counts = {};
  array.forEach(function (x) {
    counts[x] = (counts[x] || 0) + 1;
  });
  const data = {
    labels: ["User", "Admin", "Supporter"],
    datasets: [
      {
        label: "# of Votes",
        data: [counts["User"], counts["Admin"], counts["Supporter"]],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div>
      <Doughnut data={data} />
    </div>
  );
}

export default DoughChart;
