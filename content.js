// best coder - https://t.me/lIIIIIIIIllllII

var stickers = {};
var isIconEnabled = true; // Флаг для отслеживания состояния иконки

function getStickers() {
  return fetch('https://prices.csgotrader.app/latest/prices_v6.json')
    .then(response => response.json())
    .then(data => {
      for (var item in data) {
        if (item.startsWith('Sticker')) {
          if (data[item]['buff163']['starting_at'] !== null) {
            if (data[item]['buff163']['starting_at']['price'] !== null) {
              stickers[item] = data[item]['buff163']['starting_at']['price'];
            } else {
              stickers[item] = 0.01;
            }
          }
        }
      }
      return stickers;
    })
    .catch(error => {
      console.error('Ошибка:', error);
    });
}

getStickers().then(stickersData => {
  console.log(stickersData); // Выводим объект stickers в консоль

  function addMinBargainPrice() {
    var sellingRows = document.querySelectorAll("table tr.selling");
    for (var i = 0; i < sellingRows.length; i++) {
      var dataAssetInfo = sellingRows[i].getAttribute("data-asset-info");
      var dataAssetInfotoJson = JSON.parse(dataAssetInfo);
      var stickersInfo = dataAssetInfotoJson.info.stickers;
      var totalStickerPrice = 0; // Общая сумма стикеров
      var stickerlist = [];
      for (var j = 0; j < stickersInfo.length; j++) {
        var stickerName = stickersInfo[j].name;
        stickerlist.push(stickerName);
        var stickerFull = 'Sticker | ' + stickerName;
        if (stickersData.hasOwnProperty(stickerFull)) {
          var stickerPrice = stickersData[stickerFull];
          totalStickerPrice += stickerPrice;
        }
      }
      var dataOrderInfo = sellingRows[i].getAttribute("data-order-info");
      var dataOrderinfoJson = JSON.parse(dataOrderInfo);
      var lowestBargainPrice = dataOrderinfoJson.lowest_bargain_price;

      // Добавляем блок с общей стоимостью стикеров
      var firstTdElement = sellingRows[i].querySelector(".csgo_sticker.has_wear.t_Left");
      var existingDivTotalPrice = firstTdElement.querySelector(".total-price");
      if (totalStickerPrice !== 0) {
        if (existingDivTotalPrice) {
          existingDivTotalPrice.textContent = "Total_Price: " + totalStickerPrice.toFixed(2) + "$";
        } else {
          var newDivTotalPrice = document.createElement("div");
          newDivTotalPrice.textContent = "Total_Price: " + totalStickerPrice.toFixed(2) + "$";
          newDivTotalPrice.style.fontWeight = '700';
          newDivTotalPrice.classList.add("total-price");
          firstTdElement.appendChild(newDivTotalPrice);
        }
      }

      // Добавляем кнопку, которая будет искать похожие предметы на стиме с такими стикерами
      if (existingDivTotalPrice) {
        var buttonEL = sellingRows[i].getElementsByClassName("t_Left");
        if (buttonEL[0].querySelector(".steam")) {
          return;
        }
        (function (stickerlist) {
          var buttonElement = document.createElement("button");
          buttonElement.classList.add("steam");
          buttonElement.innerText = "Похожее на стиме";
          var link = createStickerLink(stickerlist);

          // Добавляем обработчик события клика на кнопку
          buttonElement.addEventListener("click", function () {
            window.open(link);
          });

          buttonEL[0].appendChild(buttonElement);
        })(stickerlist);
      }

      // Добавляем блок с минимальной ценой торга
      var tdElements = sellingRows[i].querySelectorAll("td.t_Left");
      var lastTdElement = tdElements[tdElements.length - 1];
      var existingDivMinBarg = lastTdElement.querySelector(".min-bargain-price");
      if (existingDivMinBarg) {
        existingDivMinBarg.textContent = "Min_Bagr = " + lowestBargainPrice + "¥";
      } else {
        var newDivMinBarg = document.createElement("div");
        newDivMinBarg.textContent = "Min_Bagr = " + lowestBargainPrice + "¥";
        newDivMinBarg.style.fontWeight = '700';
        newDivMinBarg.classList.add("min-bargain-price");
        lastTdElement.appendChild(newDivMinBarg);
      }
    }
  }

  function createStickerLink(stickerlist) {
    var link = "https://steamcommunity.com/market/search?q=\"";
    var allValuesAreSame = stickerlist.every(function (value) {
      return value === stickerlist[0];
    });

    // Проверяем условие
    if (allValuesAreSame) {
      // Обходим список и вставляем значения в ссылку
      stickerlist.forEach(function (value, index) {
        // Добавляем значение в ссылку
        link += encodeURIComponent(value);
        // Добавляем запятую, если это не последний элемент списка
        if (index < stickerlist.length - 1) {
          link += ",";
        }
      });
    } else {
      stickerlist.forEach(function (value, index) {
        // Добавляем значение в ссылку
        link += encodeURIComponent(value);
        // Добавляем запятую, если это не последний элемент списка
        if (index < stickerlist.length - 1) {
          link += "\"+\"";
        }
      });
    }

    // Добавляем остальные параметры к ссылке
    link += "\"&descriptions=1&category_730_ItemSet[]=any&category_730_Weapon[]=any&category_730_Quality[]=#p1_price_asc";
    return link;
  }

  function add_title_copy() {
    // изменяет title, добавляя 'Sticker | ' в начало и делает функцию копирования title
    var stickersDivs = document.querySelectorAll(".stickers");
    for (var s = 0; s < stickersDivs.length; s++) {
      var stickersDiv = stickersDivs[s];
      var titleEx = stickersDiv.getAttribute('title');
      var name = stickersDiv.getAttribute('name');
      var stickerFull = 'Sticker | ' + stickersDiv.getAttribute('title');
      if (titleEx.indexOf('Sticker') === -1) {
        if (stickersData.hasOwnProperty(stickerFull)) {
          var stickerPrice = stickersData[stickerFull];
        }
        stickersDiv.setAttribute('title', 'Sticker | ' + titleEx + " || " + stickerPrice + "$");
        stickersDiv.setAttribute('name', titleEx);
        stickersDiv.addEventListener('click', function () {
          var titleToCopy = this.getAttribute('name');
          navigator.clipboard.writeText(titleToCopy)
            .then(() => {
              console.log('Название успешно скопировано в буфер обмена');
            })
            .catch(error => {
              console.error('Ошибка при копировании названия:', error);
            });
        });
      }
    }
  }

  function handleUserInteraction(event) {
    // Ваш код для выполнения действий при движении мыши или прокрутке колесика мыши
    addMinBargainPrice();
    add_title_copy();
  }

  window.addEventListener("mousemove", handleUserInteraction);
  window.addEventListener("wheel", handleUserInteraction);

  // Добавляем обработчик события клика на иконку
  var iconElement = document.getElementById("my-icon");
  iconElement.addEventListener("click", toggleIcon);

  function toggleIcon() {
    if (isIconEnabled) {
      iconElement.src = "disabled-icon.png";
      isIconEnabled = false;
    } else {
      iconElement.src = "enabled-icon.png";
      isIconEnabled = true;
    }
  }
});