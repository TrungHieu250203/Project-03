const categoryAPI = "http://localhost:3000/category";
const productAPI = "http://localhost:3000/products";

//Hàm lấy về danh mục
function getCategory() {
  fetch(categoryAPI)
    .then((response) => response.json())
    .then((data) => {
      const html = data.map((item) => {
        return `
                    <div class="category-item">
                        <h3>${item}</h3>
                    </div>
                `;
      });
      document.querySelector("#category").innerHTML = html.join("");

      const category = document.querySelectorAll(".category-item");
      category.forEach((value) => {
        value.addEventListener("click", () => {
          const content = value.querySelector("h3").textContent;
          filterProduct(content);
        });
      });
    });
}
getCategory();

//Hàm lọc sản phẩm theo danh mục
function filterProduct(category) {
  fetch(productAPI)
    .then((response) => response.json())
    .then((data) => {
      const result = data.filter((item) => {
        return item.category === category;
      });
      displayProduct(result);
    });
}

//Hàm lấy về sản phẩm
function getProduct() {
  fetch(productAPI)
    .then((response) => response.json())
    .then((data) => {
      displayProduct(data);
    });
}
getProduct();

//Hàm hiển thị sản phẩm
function displayProduct(product) {
  const html = product.map((item) => {
    return `
            <div class="product-item">
                <img src="${item.thumbnail}" alt="">
                <div class="information">
                    <h3>${item.title}</h3>
                    <div class="sales">
                        <b>Price: ${item.price}</b>
                        <span>Discount: ${item.discountPercentage}%</span>
                    </div>
                </div>
            </div>
        `;
  });
  document.querySelector("#products").innerHTML = html.join("");
}

//Hàm tìm kiếm sản phẩm
function searchProduct() {
  const keyWord = document.querySelector("input").value.toLowerCase().trim();
  fetch(productAPI)
    .then((response) => response.json())
    .then((data) => {
      const result = data.filter((product) => {
        return product.title.toLowerCase().includes(keyWord);
      });
      displayProduct(result);
    });
}

//Thêm sự kiện khi người dùng tìm kiếm bằng nút tìm kiếm hoặc Enter
document.querySelector("#search-button").addEventListener("click", searchProduct);
document.querySelector("input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    searchProduct();
  }
});

//Các hàm sắp xếp sản phẩm theo mặc định - tăng dần - giảm dần - khuyến mãi
function defaultProduct() {
  getProduct();
}
document.querySelector("#default").addEventListener("click", defaultProduct);

function ascendingProduct() {
  fetch(productAPI)
    .then((response) => response.json())
    .then((data) => {
      const result = data.sort((a, b) => a.price - b.price);
      displayProduct(result);
    });
}
document.querySelector("#up").addEventListener("click", ascendingProduct);

function decreaseProduct() {
  fetch(productAPI)
    .then((response) => response.json())
    .then((data) => {
      const result = data.sort((a, b) => b.price - a.price);
      displayProduct(result);
    });
}
document.querySelector("#down").addEventListener("click", decreaseProduct);

function saleProduct() {
  fetch(productAPI)
    .then((response) => response.json())
    .then((data) => {
      const result = data.sort(
        (a, b) => b.discountPercentage - a.discountPercentage
      );
      displayProduct(result);
    });
}

document.querySelector("#sale").addEventListener("click", saleProduct);

// Phân trang

const productsPerPage = 10; // Số lượng sản phẩm trên mỗi trang
let currentPage = 1; // Trang hiện tại
let totalProducts = 0; // Tổng số sản phẩm
let totalPages = 0; // Tổng số trang

// Hàm lấy dữ liệu sản phẩm theo trang và giới hạn số lượng sản phẩm trên mỗi trang
function fetchProducts(page, limit) {
  const url = `${productAPI}?_page=${page}&_limit=${limit}`;
  fetch(url)
    .then((response) => {
      totalProducts = Number(response.headers.get("X-Total-Count"));
      totalPages = Math.ceil(totalProducts / productsPerPage);
      return response.json();
    })
    .then((data) => {
      displayProduct(data);
      updatePagination();
    });
}

// Hàm cập nhật phân trang
function updatePagination() {
  const pageIndicator = document.querySelector("#page");
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
  if (currentPage === 1) {
    prevButton.disabled = true;
  } else {
    prevButton.disabled = false;
  }

  if (currentPage === totalPages) {
    nextButton.disabled = true;
  } else {
    nextButton.disabled = false;
  }
}

// Hàm điều hướng đến trang trước
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchProducts(currentPage, productsPerPage);
  }
}

// Hàm điều hướng đến trang sau
function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    fetchProducts(currentPage, productsPerPage);
  }
}

// Thêm sự kiện cho nút trang trước và trang sau
document.querySelector("#prev").addEventListener("click", prevPage);
document.querySelector("#next").addEventListener("click", nextPage);

// Gọi hàm fetchProducts() để lấy dữ liệu sản phẩm ban đầu
fetchProducts(currentPage, productsPerPage);
