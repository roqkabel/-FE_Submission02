$(function () {
  // dashboard chart
  var options = {
    chart: {
      height: "300px",
      type: "bar",
    },
    plotOptions: {
        bar:{
            columnWidth: '30%',
        }
    },
    series: [
      {
        name: "sales",
        data: [90, 40, 105, 50, 49, 60, 70, 91, 125],
      },
    ],
    xaxis: {
      categories: [
        "Today",
        "Yesterday",
        "Day 3",
        "Day 4",
        "Day 5",
        "Day 6",
        "Day 7",
        "Day 8",
        "Day 9",
      ],
    },
  };

  var chart = new ApexCharts(document.querySelector("#chart"), options);

  chart.render();
});
