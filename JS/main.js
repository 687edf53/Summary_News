document.addEventListener("DOMContentLoaded",async function () {
  const apiKey = "8291dfe8e8msh3d939de8b1351c3p1d9d3cjsneb40e2378c19";
  const apiHost = "arabic-news-api.p.rapidapi.com";
  const apiUrl = "https://arabic-news-api.p.rapidapi.com/aljazeera";

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": apiHost,
    },
  };

  async function getData() {
    try {
      const response = await fetch(apiUrl, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error(error);
      throw new Error("Failed to fetch data from the API.");
    }
  }

  async function displayNews() {
    try {
      const data = await getData();
      const newsContainer = document.querySelector(".container");
      const preloader = document.querySelector(".preloader");
      const navLinks = document.querySelectorAll(".nav-links li a");
      const allNews = [];

      let titleOfNewsSource = document.createElement("h2");
      titleOfNewsSource.classList.add("source-name");
      titleOfNewsSource.textContent = "موقع الجزيرة";
      newsContainer.appendChild(titleOfNewsSource);

      preloader.style.display = "none";

      const uniqueHeadlines = new Set();
      data.results.forEach((newsItem) => {
        if (newsItem.headline && !uniqueHeadlines.has(newsItem.headline)) {
          uniqueHeadlines.add(newsItem.headline);

          const newsElement = document.createElement("div");
          newsElement.classList.add("news-item");
          newsElement.dataset.source = "aljazeera";

          const newsMetaTag = document.createElement('meta')
          newsMetaTag.setAttribute('itemprop','theNews')
          newsMetaTag.content = 'theNewsElement'
          newsElement.appendChild(newsMetaTag);

          const spanSource = document.createElement("span");
          spanSource.appendChild(document.createTextNode("موقع الجزيرة"));
          spanSource.classList.add("source");

          const headline = document.createElement("h4");
          headline.textContent = newsItem.headline;

          const link = document.createElement("a");
          link.href = newsItem.url.replace("aljazeera.net", "ajnet.me");
          link.target = "_blank";
          link.textContent = "عرض التفاصيل";
          const metaTag = document.createElement('meta')
          metaTag.setAttribute('itemprop','newsLink')
          metaTag.content = newsItem.url.replace("aljazeera.net", "ajnet.me");
          link.appendChild(metaTag)

          newsElement.appendChild(headline);
          newsElement.appendChild(link);
          newsElement.appendChild(spanSource);
          allNews.push(newsElement);
        }
      });

      allNews.forEach((news) => newsContainer.appendChild(news));

      navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          newsContainer.innerHTML = "";
          allNews.forEach((news) => {
            if (news.children[0].textContent.includes(link.textContent)) {
              newsContainer.appendChild(news);
            }
          });
        });
      });

      const searchBtn = document.querySelector(".search-btn");
      const searchInput = document.querySelector(".search-input");

      searchBtn.addEventListener("click", () => {
        newsContainer.innerHTML = "";
        const searchText = searchInput.value.trim();
        allNews.forEach((news) => {
          if (news.children[0].textContent.includes(searchText)) {
            newsContainer.appendChild(news);
          }
        });
      });

      navLinks[0].addEventListener("click", () => {
        newsContainer.innerHTML = "";
        allNews.forEach((news) => {
          newsContainer.appendChild(news);
        });
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Call the function to display news
  displayNews();

  // Start Search
  const searchIcon = document.querySelector(".fa-search");
  const searchContainer = document.querySelector(".search");

  searchIcon.addEventListener("click", () => {
    searchContainer.classList.toggle("show");
  });

  let timeoutId;
  const searchInput = document.querySelector(".search-input");

  searchInput.addEventListener("input", () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      document.querySelector(".search-btn").click();
    }, 300); // Debounce time: 300ms
  });

  // End Search
});
