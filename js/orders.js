$(function () {
  let currentPage = 1;
  let totalRows = 50;

  let dashboardData = {};
  let chart = null;
  let table = null;
  let searchBtn = $("#search-btn");
  let searchInput = $("#search-input");
  let prevButton = $(".previous");
  let nextButton = $(".next");
  let currentPageText = $(".currentpage");
  let searchValue = "";
  let pageStatus = $(".pageStatus");
  let spinner = $(".lds-spinner");

  //   fetch dashboard data
  const handleFetch = async (page = 1, search = "") => {
    handleShowSpinner(true);
    let data = await appService.getRequest(`/orders?page=${page}&q=${search}`);
    if (data) {
      handleShowSpinner(false);
      currentPage = data?.page;
      totalRows = data?.total;
      handleSetCurrentPage(currentPage);
      handleRenderTable(data?.orders);
    }
  };

  const handleShowSpinner = (show) => {
    if (show) {
      spinner.show();
    } else {
      spinner.hide();
    }
  };

  handleFetch();

  // Handle form submit
  $("#search-form").submit((e) => {
    e.preventDefault();
    handleSearchValue();
  });

  const handleSearchValue = () => {
    let searchdata = searchInput.val();
    currentPage = 1;
    searchValue = searchdata;
    handleFetch(1, searchdata);
    handleSetCurrentPage(currentPage);
  };

  // handle next clicked
  prevButton.click(() => {
    let prevNumber = currentPage - 1;

    if (prevNumber == 0 && currentPage == 1) {
      return false;
    }
    handleFetch(prevNumber, searchValue);
    handleSetCurrentPage(prevNumber);
  });

  const handleSetCurrentPage = (number) => {
    currentPage = number;
    currentPageText.text(number);

    let totalPage = handleGetPages();

    if (totalPage == 0) {
      prevButton.addClass("disabled");
      nextButton.addClass("disabled");
    } else {
      prevButton.removeClass("disabled");
      nextButton.removeClass("disabled");
      
      // toggle Disabled previous button
      if (currentPage == 1) {
        prevButton.addClass("disabled");
      } else {
        prevButton.removeClass("disabled");
      }

      // toggle Disabled previous button
      if (currentPage == totalPage) {
        nextButton.addClass("disabled");
      } else {
        nextButton.removeClass("disabled");
      }
    }

    // set page status
    pageStatus.text(`${currentPage}/ ${totalPage}`);
  };

  nextButton.click(() => {
    let nextValue = currentPage + 1;
    handleFetch(nextValue, searchValue);
    handleSetCurrentPage(nextValue);
  });

  const handleGetPages = () => {
    let pages = (totalRows / 50).toFixed(0);
    return pages;
  };

  //   Setup Table
  const handleRenderTable = (data) => {
    //define table
    table = new Tabulator("#orders-table", {
      data: [...data],
      // autoColumns: true,
      columns: [
        {
          title: "Product Name",
          field: "product.name",
        },
        {
          title: "Date",
          field: "created_at",
          formatter: function (cell, formatterParams, onRendered) {
            var value = cell.getValue();
            value = dayjs(value).format("DD MMM ,YYYY");
            return value;
          },
        },
        {
          title: "Price",
          field: "",
        },
        {
          title: "Status",
          field: "status",
          formatter: function (cell, formatterParams, onRendered) {
            var value = cell.getValue();
            let content = "<span>Hello World</span>";
            if (value == "shipped") {
              content = `<span>${value}</span`;
            }
            if (value == "processing") {
              content = `<span class="text-danger">${value}</span`;
            }
            if (value == "delivered") {
              content = `<span class="text-success">${value}</span`;
            }
            return content;
          },
        },
      ],
      pagination: false,
      layout: "fitColumns",
      // paginationMode: "remote", //enable remote pagination
      // ajaxURL: appService.domainUrl + "/orders", //set url for ajax request
      // paginationSize: 10,
      // paginationInitialPage: 1,
      // height: "100%",
      width: "100%",
      paginationCounter: "rows",
    });
  };
});
