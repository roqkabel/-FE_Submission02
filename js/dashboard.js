$(function () {
  let dashboardData = {};
  let chart = null;

  //   fetch dashboard data
  const handleFetch = async () => {
    let data = await appService.getRequest("/dashboard");

    if (data) {
      dashboardData = data.dashboard;
      handleChartData(data.dashboard, (type = "day"));
      handleRenderTable(dashboardData?.bestsellers);
    }
  };

  handleFetch();

  // revenue switch handler
  $("#switcher").on("change", function () {
    if ($(this).is(":checked")) {
      let switchStatus = $(this).is(":checked");
      if (switchStatus) {
        handleSwitchDataType("year");
      }
    } else {
      handleSwitchDataType("day");
    }
  });
  const handleSwitchDataType = (type) => {
    chart.destroy();
    handleChartData(dashboardData, type);
  };

  //   setUp Charts
  const handleChartData = (data, type = "day") => {
    let rawValue =
      type == "day" ? data.sales_over_time_week : data.sales_over_time_year;
    let results = Object.values(rawValue);

    let daysList = [];

    let number = 0;
    let total = results.reduce((arr, obj) => {
      number++;
      if (type == "day") {
        if (number == 1) {
          daysList.push(`Today`);
        } else if (number == 2) {
          daysList.push(`Yesterday`);
        } else {
          daysList.push(`Day ${number}`);
        }
      } else {
        if (number == 1) {
          daysList.push(`This month`);
        } else if (number == 2) {
          daysList.push(`Last Month`);
        } else {
          daysList.push(`Month ${number}`);
        }
      }
      return [...arr, obj.total];
    }, []);

    let options = {
      chart: {
        height: "300px",
        type: "bar",
      },
      plotOptions: {
        bar: {
          columnWidth: "30%",
        },
      },
      series: [
        {
          name: "sales",
          data: [...total],
        },
      ],
      xaxis: {
        categories: [...daysList],
      },
    };

    chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
  };

  //   Setup Table

  const handleRenderTable = (data) => {
    //define table
    new Tabulator("#bestseller-table", {
      data: [...data],
      //   autoColumns: true,
      columns: [
        {
          title: "Product Name",
          field: "product.name",
        },
        {
          title: "Price",
          field: "",
        },
        {
          title: "#Units sold",
          field: "units",
        },
        {
          title: "Revenue",
          field: "revenue",
        },
      ],
      layout: "fitColumns",
      responsiveLayout: true,
      height: "400px",
      width: "100%",
      pagination: true,
      paginationCounter: "rows",
    });
  };
});
