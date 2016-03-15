/*jslint sub: true, todo: true */
/*global _, window, parseInt, isNaN, $, jQuery, extend, Options, Service, LocalStorage, FrameElement, Popup, setTimeout,
 Booking, Buying, declineRussianCityToGenitive, setInterval, clearInterval, ActualizeProcess, SERVICE_EXPIRE,
 toFormattedPrice, WhereToBuy, library, Paginator, Form, LISTS, Sender, FormNewConcept, isRussiaCountryName,
 COUNT_OF_TOURISTS, roundPrice, RUSSIA_COUNTRY_ID, DateWrapper, config, Hash, screen, TripadvisorReviews, ReviewTabs,
 RESOURCES_ROOT
*/

/**
 * Класс карточки тура.
 *
 * @class
 * @extends Popup
 * @name Popup.Card
 */
Popup.Card = Popup.$extend({

    /**
     * Признак того, что линейная актуализация готова.
     *
     * @private
     * @field
     * @name Popup.Card#isLineAuthorizationReady
     * @type {Boolean|null}
     */
    isLineAuthorizationReady : false,

    /**
     * Данные о туре для давления к сравнению.
     *
     * @private
     * @field
     * @name Popup.Card#compareTourData
     * @type {Object|null}
     */
    compareTourData : null,

    /**
     * Экземпляр отправщика формы заявки.
     *
     * @private
     * @field
     * @name Popup.Card#tourOrderSender
     * @type {Sender.Form.TourOrder|null}
     */
    tourOrderSender : null,

    /**
     * Текущая вкладка.
     *
     * @private
     * @field
     * @name Popup.Card#currentInset
     * @see Popup.Card#getCurrentInset
     * @type {String|null}
     */
    currentInset : null,

    /**
     * Офисы турагенства.
     *
     * @private
     * @field
     * @name Popup.Card#offices
     * @type {Service.Main.GetOffices.List|null}
     */
    offices : null,

    /**
     * Идентификатор запроса.
     *
     * @private
     * @field
     * @name Popup.Card#requestId
     * @see Popup.Card#getRequestId
     * @type {String|null}
     */
    requestId : null,

    /**
     * Идентификатор туроператора.
     *
     * @private
     * @field
     * @name Popup.Card#sourceId
     * @see Popup.Card#getSourceId
     * @type {String|null}
     */
    sourceId : null,

    /**
     * Идентификатор страны назначения.
     *
     * @private
     * @field
     * @name Popup.Card#countryId
     * @see Popup.Card#getCountryId
     * @type {String|null}
     */
    countryId : null,

    /**
     * Идет ли запрос от сайта
     *
     * @private
     * @field
     * @name Popup.Card#isSiteRequest
     * @see Popup.Card#getIsSiteRequest
     * @type {String|null}
     */
    isSiteRequest: null,

    /**
     * Идентификатор города вылета.
     *
     * @private
     * @field
     * @name Popup.Card#townFromId
     * @see Popup.Card#getTownFromId
     * @type {String|null}
     */
    townFromId : null,

    /**
     * Цена.
     *
     * @private
     * @field
     * @name Popup.Card#price
     * @see Popup.Card#getPrice
     * @type {String|null}
     */
    price : null,

    /**
     * Количество ночей.
     *
     * @private
     * @field
     * @name Popup.Card#nights
     * @see Popup.Card#getNights
     * @type {String|null}
     */
    nights : null,

    /**
     * Количество взрослых мест.
     *
     * @private
     * @field
     * @name Popup.Card#adults
     * @see Popup.Card#getAdults
     * @type {Number|null}
     */
    adults : null,

    /**
     * Количество детей.
     *
     * @private
     * @field
     * @name Popup.Card#kids
     * @see Popup.Card#getKids
     * @type {Number|null}
     */
    kids : null,

    /**
     * Массив возрастов детей.
     *
     * Индекс - номер ребенка.
     *
     * @private
     * @field
     * @name Popup.Card#kidsAges
     * @see Popup.Card#getKidsAges
     * @type {Array|null}
     */
    kidsAges : null,

    /**
     * Отель.
     *
     * @private
     * @field
     * @name Popup.Card#hotelId
     * @see Popup.Card#getHotelId
     * @type {String|null}
     */
    hotelId : null,

    /**
     * Город (курорт).
     *
     * @private
     * @field
     * @name Popup.Card#townId
     * @see Popup.Card#getTownId
     * @type {String|null}
     */
    townId : null,

    /**
     * Включен ли перелет.
     *
     * @private
     * @field
     * @name Popup.Card#isTicketsIncluded
     * @see Popup.Card#getIsTicketsIncluded
     * @type {String|null}
     */
    isTicketsIncluded : null,

    /**
     * Валюта.
     *
     * @private
     * @field
     * @name Popup.Card#currency
     * @see Popup.Card#getCurrency
     * @type {String|null}
     */
    currency : null,

    /**
     * Идентификатор цены.
     *
     * @private
     * @field
     * @name Popup.Card#offerId
     * @see Popup.Card#getOfferId
     * @type {String|null}
     */
    offerId : null,

    /**
     * Экземпляр класса полей бронирования.
     *
     * @private
     * @field
     * @name Popup.Card#tourOrderForm
     * @type {FormNewConcept.TourOrder|null}
     */
    tourOrderForm : null,

    /**
     * Форма заказа.
     *
     * @private
     * @field
     * @name Popup.Card#claimForm
     * @type {Form.Claim|null}
     */
    claimForm : null,

    /**
     * Призкак, если форма покупки по пластиковым картам имеет прямую
     * авторизацию.
     *
     * @private
     * @field
     * @name Popup.Card#lineAuthorization
     * @see Popup.Card#isLineAuthorization
     * @type {Boolean|null}
     */
    lineAuthorization : null,

    /**
     * Кэш ответа GetSettings для этой карточки.
     *
     * @private
     * @field
     * @name Popup.Card#settingsResponse
     * @see Popup.Card#getSettingsResponse
     * @type {Service.Claims.GetSettings.Response|null}
     */
    settingsResponse : null,

    /**
     * Функции обратного вызова ожидающие ответа.
     *
     * @private
     * @field
     * @name Popup.Card#settingsResponseCallbacks
     * @type {Function[]|null}
     */
    settingsResponseCallbacks : null,

    /**
     * Признак того, что обзоры разрешены.
     *
     * @private
     * @field
     * @name Popup.Card#isReviewsAllowed
     * @type {Boolean|null}
     */
    isReviewsAllowed : null,

     /**
     * Количество туристов.
     *
     * @private
     * @field
     * @name Popup.Card#personsCount
     * @type {Number|null}
     */
    personsCount : null,

    /**
     * Признак горящих туров.
     *
     * @private
     * @field
     * @name Popup.Card#showcase
     * @type {Number}
     */
    showcase : 0,

    /**
     * Валюта в которой отбражается карточка.
     *
     * @private
     * @field
     * @name Popup.Card#cardCurrency
     * @type {Boolean|null}
     */
    cardCurrency : null,

    /**
     * Признак того, что нужно показывать форму заказа.
     *
     * @private
     * @field
     * @name Popup.Card#isDisplayClaimForm
     * @type {Boolean|null}
     */
    isDisplayClaimForm : null,

    /**
     * Дополнительная высота под ios.
     * Нужна для того, чтобы когда пользователь устанавливал курсор в элемент ввода и в следствии этого
     * фрейм скролило вверх границы фрема не выходили за границы области в которой он скролится и не происходило из-за этого
     * глюка, когда страницу скролит в самый вверх.
     *
     * todo : Вообще нужно принципиально решать проблему скролов под ios. Через лабину скролов под мобильники или другим образом....
     *
     * @private
     * @field
     * @name Popup.Card#additionalIOSHeight
     * @type {Number}
     */
    additionalIOSHeight : 1500,

    /**
     * Признак того, что включено распространение в социальных сетях.
     *
     * @private
     * @field
     * @name Popup.Card#isSocialNetworkSharingEnabled
     * @type {Boolean|null}
     */
    isSocialNetworkSharingEnabled : null,

    /**
     * Кэш короткой ссылки.
     *
     * @private
     * @field
     * @name Popup.Card#shortShareURL
     * @type {String|null}
     */
    shortShareURL : null,

    /**
     * Массив обработчиков, ждущих короткую ссылку.
     *
     * @private
     * @field
     * @name Popup.Card#shortShareCallbacks
     * @type {String|null}
     */
    shortShareCallbacks : null,

    /**
     * Получить признак того, что включено
     * распространение в социальных сетях.
     *
     * @public
     * @function
     * @name Popup.Card#getIsSocialNetworkSharingEnabled
     * @returns {Boolean|null}
     */
    getIsSocialNetworkSharingEnabled : function () {
        'use strict';
        return this.isSocialNetworkSharingEnabled;
    },

    /**
     * Установить класс удаления из сравнения.
     * Вызывается тогода, когда есть подтверждение того, что операция успешно произведена.
     *
     * @public
     * @function
     * @name Popup.Card#setRemoveFromCompareHint
     * @return {Popup.Card}
     */
    setRemoveFromCompareHint : function () {
        'use strict';
        var addCompare = $(this.getContainer()).find(".add-compare");
        addCompare.addClass("add-compare_remove");
    },

    /**
     * Установить класс добалвения к сравнению.
     * Вызывается тогода, когда есть подтверждение того, что операция успешно произведена.
     *
     * @public
     * @function
     * @name Popup.Card#setAddToCompareHint
     * @return {Popup.Card}
     */
    setAddToCompareHint : function () {
        'use strict';
        var addCompare = $(this.getContainer()).find(".add-compare");
        addCompare.removeClass("add-compare_remove");
    },

    /**
     * Установить класс ожидания для кнопки добавления к сравнению.
     *
     * @public
     * @function
     * @name Popup.Card#setWaitToCompareHint
     * @return {Popup.Card}
     */
    setWaitToCompareHint : function () {
        'use strict';
        var addCompare = $(this.getContainer()).find(".add-compare");
        addCompare.addClass("add-compare_wait");
    },

    /**
     * Сбросить класс ожидания для кнопки добавления к сравнению.
     *
     * @public
     * @function
     * @name Popup.Card#unsetWaitForCompareHint
     * @return {Popup.Card}
     */
    unsetWaitToCompareHint : function () {
        'use strict';
        var addCompare = $(this.getContainer()).find(".add-compare");
        addCompare.removeClass("add-compare_wait");
    },

    /**
     * Получить заголовок для шаринга.
     *
     * @public
     * @function
     * @name Popup.Card#getShareTitle
     * @param {Service.Main.ActualizePrice.Response} response
     * @param {Number} price
     * @return {String}
     */
    getShareTitle : function (response, price) {
        'use strict';
        var template         = this.getTemplate(),
            dateStart        = response.getCheckIn(),
            dateEnd          = response.getCheckOut(),
            result           = template.fetch("shareTitle", {
                'city'             : response.getDepartCityName(),
                'country'          : response.getCountryName(),
                'dateStart'        : dateStart && dateStart.format('j M'),
                'dateEnd'          : dateEnd   && dateEnd.format('j M'),
                'price'            : toFormattedPrice(price),
                'currencyOriginal' : response.getOriginalCurrencyName(),
                'currencyAlias'    : response.getCurrencyAlias()
            });
        return result;
    },

    /**
     * Втавить кнопку VK.
     *
     * @public
     * @function
     * @name Popup.Card#insertTwitterShareButton
     * @param {Service.Main.ActualizePrice.Response} response Ответ сервиса актуализации цены.
     * @param {Number} price Цена.
     * @return {Popup.Card}
     */
    insertTwitterShareButton : function (response, price) {
        'use strict';
        var self            = this,
            buttonContainer = this.getContainer().find('#twitter-share-button');
        this.getShortShareURL(function (shortLink) {
            self.getWindow()['twttr']['widgets']['createShareButton'](
                shortLink,
                buttonContainer.get(0),
                {
                    'size' : "large",
                    'text' : self.getShareTitle(response, price)
                }
            );
        });
    },

    /**
     * Втавить кнопку VK.
     *
     * @public
     * @function
     * @name Popup.Card#insertOKShareButton
     * @param {Service.Main.ActualizePrice.Response} response Ответ сервиса актуализации цены.
     * @param {Number} price Цена.
     * @return {Popup.Card}
     */
    insertOKShareButton : function (response, price) {
        'use strict';
        var hash = extend({'isSharingURL' : 1}, Hash.$create().getItems()),
            url  = Browser.$create().getLocation(window.location, false, hash);
        this.getWindow()['OK']['CONNECT']['insertShareWidget'](
            "ok-share-button",
            url,
            "{width:30,height:35,st:'rounded',sz:30,nt:1,nc:1}" // Настройки внешнего вида.
        );
    },

    /**
     * Вставить кнопку полной ссылки.
     *
     * @public
     * @function
     * @name Popup.Card#initializeFullLinkButton
     * @return {Popup.Card}
     */
    initializeFullLinkButton : function () {
        'use strict';
        var fullLinkShareButtonBox = this.getContainer().find('#full-link-share-button').parent();
        this.getShortShareURL(function (shortLink) {
            fullLinkShareButtonBox.find('input').val(shortLink);
        });
    },

    /**
     * Получить короткую ссылку для шаринга текущей карточки, асинхронно.
     *
     * @public
     * @function
     * @name Popup.Card#getShareURL
     * @param {Function} callback Функция возвращающая ссылку ассинхронно.
     * @return {Popup.Card}
     */
    getShortShareURL : function (callback) {
        'use strict';
        var self = this;
        function getCurrentURL () {
            var browser          = Browser.$create(),
                hash             = Hash.$create().getItems(),
                url;
            // Дополняем специальным параметром.
            hash = extend({'isSharingURL' : 1}, hash);
            url  = browser.getLocation(window.location, false, hash);
            // Сжимем url.
            url = formatToPunycodeLink(url);
            return url;
        }
        if (this.shortShareURL) {
            callback(this.shortShareURL);
        } else {
            this.shortShareCallbacks = this.shortShareCallbacks || [];
            if (this.shortShareCallbacks.length === 0) {
                Service.ShortLink.GetShortLink.$create().call({
                    'op'  : 'encode',
                    'url' : getCurrentURL()
                }, function (shortLinkResponse) {
                    var shortLink = shortLinkResponse.getLink();
                    // Сохраняем ссылочку.
                    self.shortShareURL = shortLink;
                    // Обрабатываем тех, кто уже дал запрос.
                    _.each(self.shortShareCallbacks, function (callback) {
                        callback(shortLink);
                    });
                    // Очищаем стек ожидающих.
                    self.shortShareCallbacks = null;
                });
            }
            this.shortShareCallbacks.push(callback);
        }
    },

    /**
     * Открыть попапчик-окно со другой страницей.
     *
     * @public
     * @function
     * @name Popup.Card#openPopupWindow
     * @param {String} url Ссылка, которую требуется открыть.
     * @return {Popup.Card}
     */
    openPopupWindow : function (url) {
        'use strict';
        var popup,
            popupName   = '_blank',
            width       = 626,
            height      = 436,
            left        = (screen.width - width) / 2,
            top         = (screen.height - height) / 2,
            popupParams = 'scrollbars=0, resizable=1, menubar=0, left=' + left + ', top=' + top + ', width=' + width + ', height=' + height + ', toolbar=0, status=0';
        popup = window.open(url, popupName, popupParams);
        popup.focus();
        return this;
    },

    /**
     * Обработчик по клику на кнопку вк.
     *
     * @public
     * @function
     * @name Popup.Card#vkShareButtonClickHandler
     * @param {Event} event Экземпляр события нажатия на кнопку.
     * @return {Popup.Card}
     */
    vkShareButtonClickHandler : function (event) {
        var url = $(event.target).closest('#vk-share-button').data('href');
        if (url) {
            this.openPopupWindow(url);
        }
        return this;
    },

    /**
     * Обработчик по клику на ссылку сравнения.
     *
     * @public
     * @function
     * @name Popup.Card#compareClickHandler
     * @param {Event} event Экземпляр события нажатия на кнопку.
     * @return {Popup.Card}
     */
    compareClickHandler : function (event) {
        'use strict';
        var target = $(event.target),
            button = target.closest(".js-add-compare");
        if (!button.is(".add-compare_wait") && !target.closest(".js-error-message").length) { // Если в процессе ожидания, то ничего не делаем.
            // Выполняем операцию, только если нажали не на сообщение.
            if (button.is(".add-compare_remove")) { // Удаление из корзины.
                // !emit Popup.Card.removeFromCompare
                this.syncEmit("removeFromCompare", {
                    'tour' : this.compareTourData
                });
            } else {  //Добавление в корзину.
                // !emit Popup.Card.addToCompare
                this.syncEmit("addToCompare", {
                    'tour' : this.compareTourData
                });
            }
        }
    },

    /**
     * Показать ошибку сравнения.
     *
     * @public
     * @function
     * @name Popup.Card#showComparisonErrorMessage
     * @param {Number} maxTourCount Максимальное колитчество туров.
     * @return {Popup.Card}
     */
    showComparisonErrorMessage : function (errorMessage) {
        'use strict';
        var comparisonButton = this.getContainer().find(".js-add-compare");
        comparisonButton.find(".js-error-message").html(errorMessage);
        comparisonButton.addClass("tooltip-info_show");
    },

    /**
     * Инициализировать ссылку для вк.
     *
     * @public
     * @function
     * @name Popup.Card#initializeVkShareButtonURL
     * @param {Service.Main.ActualizePrice.Response} response Ответ сервиса актуализации цены.
     * @param {Number} price Цена.
     * @return {Popup.Card}
     */
    initializeVkShareButtonURL : function (response, price) {
        'use strict';
        var self = this;
        this.getShortShareURL(function (shortLink) {
            var url,
                countryId        = response.getCountryId(),
                hotelImagesCount = response.getHotelImagesCount(),
                hotelId          = response.getHotelId(),
                browser     = Browser.$create(),
                shareButton = self.getContainer().find('#vk-share-button'),
                pageUrl     = shortLink,
                title       = self.getShareTitle(response, price),
                description = response.getOriginalTourName(),
                image       = [
                    browser.getProtocol(),
                    self.getHotelImageSrc(hotelImagesCount, hotelId, countryId, 208, 245),
                    "?punycode=",
                    browser.getPunycode()
                ].join("");
            url = 'https://vk.com/share.php?';
            url += 'url=' + encodeURIComponent(pageUrl);
            url += '&title=' + encodeURIComponent(title);
            url += '&description=' + encodeURIComponent(description);
            url += '&image=' + encodeURIComponent(image);
            url += '&noparse=true';
            shareButton.data('href', url);
        });
        /*
        // todo : Удалить, если не понадобится.
        var self             = this,
            browser          = Browser.$create(),
            countryId        = response.getCountryId(),
            hotelImagesCount = response.getHotelImagesCount(),
            hotelId          = response.getHotelId();
        this.getShortShareURL(function (shortLink) {
            var shareButton     = self.getContainer().find('#vk-share-button'),
                shareButtonOldA = shareButton.children();
            shareButton.html(self.getWindow()['VK']['Share'].button({
                'url'         : shortLink,
                'title'       : self.getShareTitle(response, price),
                'description' : response.getOriginalTourName(),
                'image'       : [
                    browser.getProtocol(),
                    self.getHotelImageSrc(hotelImagesCount, hotelId, countryId, 208, 245),
                    "?punycode=",
                    browser.getPunycode()
                ].join(""),
                'noparse'     : true
            }, { // вторым параметром - внешний вид.
                'type'        : "custom",
                'text'        : ""
            }));
            shareButton.children()
                .attr("class", shareButtonOldA.attr("class"))
                .attr("title", shareButtonOldA.attr("title"))
                .css("display", shareButtonOldA.css("display"));
        });
         */
        return this;
    },

    /**
     * Табы отзывов.
     *
     * @private
     * @field
     * @name Popup.Card#reviewTabs
     * @type {ReviewTabs}
     */
    reviewTabs : null,

    /**
     * Получить признак того, что необходимо отображать форму заказа.
     *
     * @public
     * @function
     * @name Popup.Card#getIsDisplayClaimForm
     * @return {Boolean}
     */
    getIsDisplayClaimForm : function () {
        'use strict';
        var cardCurrency,
            billingCurrency,
            settingsResponse,
            currencies;
        if (this.isDisplayClaimForm === null) {
            cardCurrency     = this.cardCurrency;
            settingsResponse = this.settingsResponse;
            billingCurrency = settingsResponse.getBillingCurrencyAlias();
            currencies       = ['RUB', 'RUR'];
            this.isDisplayClaimForm = this.isLineAuthorization() !== null &&
                this.isDefaultsUseCard() &&
                !this.isDefaultsUseWhereToBuy() &&
                (_.indexOf(currencies, this.cardCurrency) !== -1 || // Или рубль.
                    cardCurrency === billingCurrency);              // Или валюта тура должна совпадать с валютой запроса.
        }
        return this.isDisplayClaimForm;
    },

    /**
     * Получить признак того, что возможно отобразить цену для оплаты онлайн.
     *
     * @public
     * @function
     * @name Popup.Card#isPossibleToRenderOnlinePaymentHint
     * @return {Boolean}
     */
    isPossibleToRenderOnlinePaymentHint : function () {
        'use strict';
        return this.getDefaultsPricingModifierSchemeId() && this.isDefaultsUseCard();
    },

    /**
     * Отобразить цену оплаты онлайн.
     *
     * @public
     * @function
     * @name Popup.Card#renderOnlinePaymentHint
     * @param {Number} currentPrice Текущая цена.
     * @param {String} currency Валюта.
     * @return {void}
     */
    renderOnlinePaymentHint : function (currnetPrice, currency) {
        'use strict';
        var self = this,
            container = self.getContainer(),
            options = {
                'price'           : currnetPrice,
                'pricingSchemeId' : self.getDefaultsPricingModifierSchemeId()
            };
        container = container.find('#pricingModifierSchemePrice');
        container.hide();
        Service.Claims.GetPriceByScheme.$create().call(options, function (response) {
            var content,
                template,
                isError   = response.isError(),
                price     = response.getPrice();
            if (!isError && price) {
                template = self.getTemplate();
                content = template.fetch("onlinePaymentHint", {
                    'price'    : price,
                    'currency' : currency
                });
                container.html(content);
                container.show();
                self.afterClaimFormReady(function () {
                    self.claimForm.refreshPrepayment(price, currency);
                });
            }
        });
    },

    /**
     * Выполнить после того как форма заказа будет готова.
     *
     * @public
     * @function
     * @name Popup.Card#afterClaimFormReady
     * @param {Function} callback Функция обратного вызова.
     * @return {void}
     */
    afterClaimFormReady : function (callback) {
        'use strict';
        if (!this.claimForm) {
            this.once("claimFormReady", callback);
        } else {
            callback();
        }
    },

    /**
     * Получить файлы стилей.
     *
     * @public
     * @function
     * @name Popup.Card#getDefaultsFilesForPopup
     * @return {void}
     */
    getDefaultsFilesForPopup : function () {
        'use strict';
        // Файлы тем пятого модуля не должны прицепляться к карточке.
        var cardTheme,
            localConfig,
            themePath     = "/public/module-5.0/search/theme/",
            themeRegExp   = new RegExp(themePath),
            currentTheme  = _.find(this.getDefaultsFiles(), function (file) {
                return themeRegExp.test(file);
            }),
            defaultsFiles = _.filter(this.getDefaultsFiles(), function (file) {
                return !(new RegExp("/public/module-5.0/search/theme/").test(file)) &&
                    !(new RegExp("/public/module-5.0/search/common.min.css").test(file));
            });
        // Для модуля 5 необходимо прицеплять к карточке особый стиль, который расширяет функционал карточки
        // и соответствует текущей теме модуля.
        currentTheme = (currentTheme || "").replace(new RegExp("[\\s\\S]*" + themePath), "").split(".")[0] || "default";
        // Убираем префикс тем 2015 года, если нужно.
        currentTheme = currentTheme.replace('_dec2015', "");
        if (/franchise/.test(currentTheme)) { // Франшизная темя имеет дефолт.
            currentTheme = "default";
        }
        try {
            localConfig = config || this;
        } catch (error) {
            localConfig = this;
        }
        // Проверяем, что у нас 5ка.
        if (localConfig.getDefaultsSolution() === "module50") {
            cardTheme = this.getTemplate().fetch("module5CardTheme", {
                'resourcesRoot' : RESOURCES_ROOT,
                'theme'         : currentTheme
            });
        }
        if (cardTheme) {
            defaultsFiles.push(cardTheme);
        }
        return defaultsFiles;
    },

    /**
     * Запустить похожий поиск.
     *
     * @public
     * @function
     * @name Popup.Card#emitStartSimilarSearch
     * @return {void}
     */
    emitStartSimilarSearch : function () {
        'use strict';
        // !emit Card.startSimilarSearch
        this.syncEmit("startSimilarSearch", {});
    },

    /**
     * Создать кнопку для запуска похожего поиска.
     * Создаем только для 5ки.
     *
     * @public
     * @function
     * @name Popup.Card#createSimilarSearchButtonAsNeeded
     * @return {Popup.Card}
     */
    createSimilarSearchButtonAsNeeded : function () {
        'use strict';
        var hash                = Hash.$create(),
            template            = this.getTemplate(),
            container           = this.getContainer(),
            similarSearchButton = container.find("#similar-search-button-container");
        try {
            // Размещаем кнопку только для 5ки.
            // Создаем кнопку только, если в хэше есть isSharingURL.
            if (config.getDefaultsSolution() === "module50" && hash.hasItem("isSharingURL")) {
                similarSearchButton.html(template.fetch("similarSearchButton", {}));
            }
        } catch (error) {}
        return this;
    },

    /**
     * Создать отзывы.
     *
     * @public
     * @function
     * @name Popup.Card#createReviews
     * @param {Number} hotelId Идентификатор отеля.
     * @return {void}
     */
    createReviews : function (hotelId) {
        'use strict';
        var container     = this.getContainer(),
            sletatReviews = Paginator.HotelReviews.$create({
                'container'             : container.find("#hotel-comments"),
                'templateName'          : "reviewsPaginator",
                'contentTemplateName'   : "reviewItems",
                'initPageNumber'        : 1,
                'countOfItemsOnPage'    : 5,
                'pageButtonCount'       : 5,
                'buttonCountToCurrent'  : 2,
                'showControls'          : true,
                'extendableButtonCount' : true,
                'hotelId'               : hotelId
            }, this),
            reviewTabs = ReviewTabs.$create({
                'hotelId'       : hotelId,
                'sletatReviews' : sletatReviews,
                'frame'         : this
            });
        this.reviewTabs = reviewTabs;
        return this;
    },

    /**
     * Конструктор.
     *
     * @public
     * @function
     * @name Popup.Card#$init
     * @param {FrameElement} parent Родительский элемент.
     * @param {Object|Options} options Параметры.
     * @param {Number} options.requestId Идентификатор запроса.
     * @param {Number} options.sourceId Идентификатор туроператора.
     * @param {Number} options.offerId Идентификатор цены.
     * @param {Number} options.townFromId Идентификатор города вылета.
     * @param {Number} options.countryId Идентификатор страны, по которой производился запрос.
     * @param {Number} options.townFromId Идентификатор города вылета.
     * @param {Number} options.showcase Признак горящих туров.
     * @param {Number} options.price Цена
     * @param {Number} options.nights Количество ночей
     * @param {Number} options.adults Количество взрослых мест.
     * @param {Number} options.kids Количество детей.
     * @param {Number} options.kid1 Возраст первого ребенка.
     * @param {Number} options.kid2 Возраст второго ребенка.
     * @param {Number} options.kid3 Возраст третьего ребенка.
     * @param {Number} options.hotelId Отель.
     * @param {Number} options.townId Город (курорт).
     * @param {Boolean} options.isSocialNetworkSharingEnabled Признак того, что включено распространение в социальных сетях.
     * @param {Boolean} options.isTicketsIncluded Включен ли перелет.
     * @param {Number} options.vkGroupId Номер группы vk.com откуда запущено приложение
     * @param {UserEmitter} userEvents Объект пользовательских событий.
     * @return {void}
     */
    $init : function (parent, options, userEvents) {
        'use strict';
        var self                   = this,               // Ссылка на текущий объект
            template               = this.getTemplate(), // Ссылка на объект шаблонов.
            files                  = [],
            whereToBuyInitSettings = {},                 // Параметры инициализации раздела "Где купить".
            requestId,                                   // Идентификатор запроса.
            sourceId,                                    // Идентификатор туроператора.
            offerId,                                     // Идентификатор цены.
            countryId,                                   // Идентификатор страны назначения.
            isSiteRequest,
            townFromId,                                  // Идентификатор города вылета.
            price,                                       // Цена
            nights,                                      // Количество ночей
            adults,                                      // Количество взрослых мест.
            kids,                                        // Количество детей.
            kid1,                                        // Возраст первого ребенка.
            kid2,                                        // Возраст второго ребенка.
            kid3,                                        // Возраст третьего ребенка.
            hotelId,                                     // Отель.
            townId,                                      // Город (курорт).
            currency,                                    // Валюта.
            isTicketsIncluded,                           // Включен ли перелет.
            showcase,                                    // Признак горящих туров.
            detailActualizeProcess,                      // Ссылка на объект процесса детальной актуализации.
            isSocialNetworkSharingEnabled,               // Признак того, что включено распространение в социальных сетях.
            vkGroupId;                                   // Идентификатор группы vk.com
            // Обновить блок содержащиё информацию о схемах оплаты.

        // Крепим обработчики к текущему контексту.
        this.onGetSettingsResponseHandler                         = this.bindAll(this.onGetSettingsResponseHandler);
        this.lineAuthorizationInitializeAfterCurrencyReadyHandler = this.bindAll(this.lineAuthorizationInitializeAfterCurrencyReadyHandler);

        if (!(parent instanceof FrameElement)) {
            // Проверяем, что родительский элемент верного типа.
            throw new ReferenceError('Первый параметр не верного типа, ожидается объект типа FrameElement.');
        }

        // Расширяем параметры текущего объекта.
        if (options instanceof Options) {
            // Расширяем параметры такимже объектом.
            this.getOptions().extend(options);
        } else {
            // Расширяем параметры простым объектом.
            this.getOptions().addItems(options);
        }

        // Параметры конструктора.
        options = this.getOptions();

        // Родительский элемент.
        this.parent = parent;
        // Идентификатор запроса поиска.
        requestId = parseInt(String(options.getItem('requestId')), 10) || 0;
        // Идентификатор туроператора.
        sourceId = parseInt(String(options.getItem('sourceId')), 10) || 0;
        // Идентификатор цены.
        offerId = parseInt(String(options.getItem('offerId')), 10) || 0;
        // Идентификатор страны назначения.
        countryId = parseInt(String(options.getItem('countryId')), 10) || 0;
        // Идентификатор города вылета.
        townFromId = parseInt(String(options.getItem('townFromId')), 10) || 0;
        // Получаем признак горящих туров.
        showcase = parseInt(String(options.getItem('showcase')), 10) || 0;
        // Список файлов стилей.
        if (options.hasItem('files') && options.getItem('files') instanceof Array) {
            files = options.getItem('files');
        }
        // Идентификатор группы vk.com
        if (options.hasItem('vkGroupId')) {
            vkGroupId = parseInt(String(options.getItem('vkGroupId')), 10) || 0;
        }

        // Запрос от модуля
        isSiteRequest = false;
        // Идентификатор города вылета.
        townFromId = parseInt(String(options.getItem('townFromId')), 10) || 0;
        // Цена
        price = parseInt(String(options.getItem('price')), 10) || 0;
        // Количество ночей
        nights = parseInt(String(options.getItem('nights')), 10) || 0;
        // Количество взрослых мест.
        adults = parseInt(String(options.getItem('adults')), 10) || 0;
        // Количество детей.
        kids = parseInt(String(options.getItem('kids')), 10) || 0;
        // Возраста детей.
        kid1 = parseInt(String(options.getItem('kid1')), 10) || null;
        kid2 = parseInt(String(options.getItem('kid2')), 10) || null;
        kid3 = parseInt(String(options.getItem('kid3')), 10) || null;
        // Отель
        hotelId = parseInt(String(options.getItem('hotelId')), 10) || 0;
        // Город (курорт)
        townId = parseInt(String(options.getItem('townId')), 10) || 0;
        // Валюта
        currency = String(options.getItem('currency') || '');
        // Включен ли перелет
        isTicketsIncluded = options.getItem('isTicketsIncluded') || false;
        // Признак того, что включено распространение в социальных сетях.
        isSocialNetworkSharingEnabled = options.getItem('isSocialNetworkSharingEnabled') || false;

        this.requestId                     = requestId;
        this.offerId                       = offerId;
        this.sourceId                      = sourceId;
        this.countryId                     = countryId;
        this.isSiteRequest                 = isSiteRequest.toString();
        this.townFromId                    = townFromId;
        this.price                         = price;
        this.nights                        = nights;
        this.adults                        = adults;
        this.kids                          = kids;
        this.hotelId                       = hotelId;
        this.townId                        = townId;
        this.currency                      = currency;
        this.showcase                      = showcase;
        this.isTicketsIncluded             = isTicketsIncluded;
        this.isSocialNetworkSharingEnabled = isSocialNetworkSharingEnabled;

        if (this.kids > 0) {
            this.kidsAges = [kid1, kid2, kid3];
        }

        // Параметры родительского класса.
        options.extend(parent.getOptions());

        // Дополняе параметры контентом.
        options.setItem('content',
            // Готовим загрузчик карточки тура,
            // как первоначальный контент для попапа.
            template.fetch('cardLoader', {
                'requestId' : requestId, // Идентификатор запроса поиска.
                'sourceId'  : sourceId,  // Идентификатор туроператора.
                'offerId'   : offerId,   // Идентификатор цены.
                'countryId' : countryId  // Идентификатор страны назначения.
            }));

        // Инициируем событие открытия карточки тура.
        userEvents.emit('tourCard', {});

        // Конструктор родительского класса.
        this.$super(options, function () {
            var container        = this.getContainer(),
                htmlDocument     = this.getDocument(),
                document         = $(htmlDocument),
                agencyContact1   = self.getDefaultsAgencyContact1(), // Контакты агенства для левой колонки.
                agencyContact2   = self.getDefaultsAgencyContact2(); // Контакты агенства для основного блока контента.

            document.mouseover(function (event) {
                var target    = $(event.target),
                    claimForm = self.getClaimForm();
                if (claimForm && claimForm.isInContainer(target)) {
                    claimForm.mouseover(event);
                }
            });

            document.change(function (event) {
                var target  = $(event.target),
                    tourOrderForm = self.getTourOrderForm(),
                    claimForm     = self.getClaimForm();
                if (tourOrderForm && tourOrderForm.isInContainer(target)) {
                    tourOrderForm.getFieldSet().change(event);
                }
                if (claimForm && claimForm.isInContainer(target)) {
                    claimForm.getFieldSet().change(event);
                }
            });
            document.click(function (event) {
                var target = $(event.target);
                if (target.closest('#vk-share-button').length) {
                    self.vkShareButtonClickHandler(event);
                    return false; // Обязательно вернуть false для того, чтобы работало под ios, как минимум.
                }
                self.callAsync(function () {
                    var target        = $(event.target),
                        parents       = target.parents(),
                        tourOrderForm = self.getTourOrderForm(),
                        claimForm     = self.getClaimForm();
                    if (!target.closest(".js-add-compare .js-error-message").length) {
                        container.find(".js-add-compare").removeClass("tooltip-info_show");
                    }
                    self.updateIOSFrameHeight();
                    if (target.closest(".js-add-compare").length) {
                        self.compareClickHandler(event);
                    }
                    // Обработка работы скрепок.
                    if (target.is(".js-clip-button") || target.is(".js-clip-close")) {
                        target.closest(".js-clip-container").toggleClass("clip_open");
                    }
                    if (target.is(".js-similar-search-button")) {
                        self.emitStartSimilarSearch();
                    }
                    if (target.closest(".js-show-sold-tour").length) {
                        self.getContainer().find(".js-tour-is-sold-container").hide(); // Скрываем лишний контейнер.
                    }
                    // Проверяем, что есть форма и что клик был произведён по форме.
                    if (tourOrderForm) {
                        if (tourOrderForm.isInContainer(target)) {
                            tourOrderForm.click(event);
                        } else {
                            tourOrderForm.outsideClick(event);
                        }
                    }
                    if (claimForm) {
                        if (claimForm.isInContainer(target)) {
                            claimForm.click(event);
                        } else {
                            claimForm.outsideClick(event);
                        }
                    }
                    if (target.is('input[type=radio]')) {
                        // Обрабатываем асинхронно события клика по радио-кнопкам.
                        self.getInputElement(String(target.attr('name') || '')).
                            each(function () {
                                var parent = $(this).parent();
                                if (parent.is('label')) {
                                    if (this.checked) {
                                        parent.addClass('checked');
                                    } else {
                                        parent.removeClass('checked');
                                    }
                                }
                            });
                    } else if (target.is('a.popup-close') || target.is('body')) {
                        // Останавливаем процесс детальной актуализации.
                        if (detailActualizeProcess) {
                            detailActualizeProcess.stop();
                        }
                    }
                    if (parents.is('a') && parents.is('#shortcut-images')) {
                        // Клики по маленьким фотографиям, отображение в большой
                        (function () {
                            var index   = parents.attr('data-index'),
                                element = document.find('#main-image img'),
                                value   = element.attr('src');
                            element.attr('src', value.
                                replace(/_\d+(_\d+_\d+_\d+\.jpg)/, '_' + index + '$1'));
                        }());
                    } else if ((target.is('a.menu-item') || target.parent().is('a.menu-item')) && parents.is('div#menu')) {
                        // Клики по пунктам меню.
                        (function () {
                            var menu    = target.parents('div#menu'),
                                id      = String(target.attr('id') || target.parent().attr('id') || ''),
                                type    = id.split(/^menu-/i).join(''),
                                hotelId = parseInt(String(menu.attr('data-hotel-id') || '0'), 10);
                            menu.attr('class', id);
                            self.emit('changeItem', {
                                'type'    : type,
                                'hotelId' : hotelId
                            });
                        }());
                    } else if (parents.is('div#payment-menu')) {
                        // Выбор меню оплаты или заказа.
                        if (target.is('a.payment-item') || parents.is('a.payment-item')) {
                            (function () {
                                var value = '';
                                target.add(parent).each(function () {
                                    var attr = String($(this).attr('data-value') || '') || null;
                                    if ($(this).is('a.payment-item') && attr && !value) {
                                        value = attr;
                                    }
                                });
                                if (value) {
                                    self.getContainer().find('div#payment-menu').
                                        attr('class', value);
                                }
                            }());
                        }
                    } else if (target.is('#buy-office') || parents.is('#buy-office')) {
                        // Переход к форме обыкновенного заказа.
                        self.getContainer().find('div#payment-menu').
                            attr('class', 'order');
                        (function () {
                            // Анимируем переход вниз страницы и выставляем фокус на первом input.
                            var html        = $(self.getDocument()).find('html'),
                                body        = $(self.getDocument()).find('body'),
                                nameInput   = $(self.getDocument()).find('input#booking-name');
                            html.add(body).animate({
                                'scrollTop' : document.find('#payment-menu').offset().top
                            }, 'slow', function () {
                                $(nameInput).focus();
                            });
                        }());
                    } else if (target.is('#buy-online') || parents.is('#buy-online')) {
                        // Переход к форме покупки через пластик.
                        self.getContainer().find('div#payment-menu').
                            attr('class', 'card');
                        (function () {
                            // Анимируем переход вниз страницы и выставляем фокус на первом input.
                            var html        = $(self.getDocument()).find('html'),
                                body        = $(self.getDocument()).find('body'),
                                nameInput   = $(self.getDocument()).find('.buyer-adults > .buyer-person .input > input[name="FirstName"]')[0];
                            html.add(body).animate({
                                'scrollTop' : document.find('#payment-menu').offset().top
                            }, 'slow', function () {
                                $(nameInput).focus();
                            });
                        }());
                    } else if (target.is('.oil-taxes-tooltip-box .tooltip-info')) {
                        (function () {
                            var tooltips = self.getContainer().find('.oil-taxes-tooltip-box .tooltip-info');
                            tooltips = tooltips.filter(function (index, val) {
                                return val !== target.get(0);
                            });
                            tooltips.removeClass('tooltip-info_show');
                            target.toggleClass('tooltip-info_show');
                        }());
                    }
                    // Обработка закрытия тултипов при кликаз за пределами тултипа.
                    (function () {
                        function hasOpenOilTaxTooltips() {
                            return self.getContainer().find('.oil-taxes-tooltip-box .tooltip-info.tooltip-info_show');
                        }
                        if (!target.is('.oil-taxes-tooltip-box .tooltip-info')
                                && !parents.is('.oil-taxes-tooltip-box .tooltip-info') && hasOpenOilTaxTooltips()) {
                            self.getContainer().find('.oil-taxes-tooltip-box .tooltip-info.tooltip-info_show').removeClass('tooltip-info_show');
                        }
                    }());
                });
            });
            function focusIn(event) {
                var target        = event.target || event.srcElement,
                    tourOrderForm = self.getTourOrderForm(),
                    claimForm     = self.getClaimForm();
                if (tourOrderForm && tourOrderForm.isInContainer(target)) { // Делегируем форме заявки.
                    tourOrderForm.getFieldSet().focusIn(event);
                } else if (claimForm && claimForm.isInContainer(target)) {
                    claimForm.getFieldSet().focusIn(event);
                }
            }
            function focusOut(event) {
                var target        = event.target || event.srcElement,
                    tourOrderForm = self.getTourOrderForm(),
                    claimForm     = self.getClaimForm();
                if (tourOrderForm && tourOrderForm.isInContainer(target)) { // Делегируем форме заявки.
                    tourOrderForm.getFieldSet().focusOut(event);
                } else if (claimForm && claimForm.isInContainer(target)) {
                    claimForm.getFieldSet().focusOut(event);
                }
            }
            if (htmlDocument.addEventListener) {
                htmlDocument.addEventListener('focus', focusIn, true);
                htmlDocument.addEventListener('blur',  focusOut,  true);
            } else { // Для IE.
                htmlDocument.attachEvent('onfocusin',  focusIn);
                htmlDocument.attachEvent('onfocusout', focusOut);
            }
            // Показываем фрейм.
            self.show();
            // Делаем запрос на получение информации о туре.
            Service.Main.ActualizePrice.$create({
                'useCache'       : self.isDefaultsUseLocalStorage(),
                'cacheExpire'    : self.getDefaultsStorageExpire(),
                'cacheNamespace' : self.getDefaultsStorageNamespace()
            }).call({
                'sourceId'          : sourceId,  // Идентификатор тур оператора.
                'offerId'           : offerId,   // Идентификатор цены.
                'countryId'         : countryId, // Идентификатор страны назначения.
                'requestId'         : requestId, // Идентификатор запроса поиска.
                'showcase'          : showcase,  // Признак горящих туров.
                'isSiteRequest'     : isSiteRequest,
                'townFromId'        : townFromId,
                'price'             : price,
                'nights'            : nights,
                'adults'            : adults,
                'kids'              : kids,
                'hotelId'           : hotelId,
                'townId'            : townId,
                'currency'          : currency,
                'isTicketsIncluded' : isTicketsIncluded,
                'vkGroupId'         : vkGroupId
            }, function (response) {
                // Если карточку уже уничтожили - ничего не делаем, чтобы не вызвать ошибок.
                if (self.getIsCardInDestroying()) {
                    return;
                }
                if (!response.isError() && response.getIsFound() && response.getData() !== null) {
                    var roMealId = _.filter(LISTS.MEALS, function (element) { return element['caption'] === "RO" })[0]["value"],
                        isTourPrice               = showcase && self.isDefaultsIsTourPrice(), // Показывать ли полную цену за тур для горящих туров
                        list                      = response.getList(),
                        placementOriginal         = String(list[22]),
                        placementId               = parseInt(list[40], 10),
                        placementName             = String(list[41]),
                        placementDescr            = String(list[50]),
                        placementLowerCase        = placementDescr.toLocaleLowerCase(),
                        mealsId                   = parseInt(list[38], 10),
                        mealsName                 = String(list[39]),
                        mealsDescr                = String(list[49]),
                        mealsLowerCase            = mealsDescr.toLocaleLowerCase(),
                        numberOriginal            = String(list[9]),
                        numberId                  = parseInt(list[36], 10),
                        numberName                = String(list[37]),
                        dateStart                 = response.getCheckIn(),
                        dateEnd                   = response.getCheckOut(),
                        price                     = roundPrice(list[19]) || 0, // Цена в запрошенной валюте.
                        currencyOriginal          = response.getOriginalCurrencyName(),
                        currencyAlias             = response.getCurrencyAlias(),
                        adults                    = parseInt(String(list[53]), 10) || 0, // Количество взрослых
                        kids                      = parseInt(String(list[54]), 10) || 0, // Количество детей
                        pricePerson               = roundPrice(price / (adults + kids)), // цена за тур на душу человека.
                        hotelId                   = response.getHotelId(),
                        visaInfo                  = response.getVisaInfo().getListToOutput(),
                        oilTaxes                  = response.getOilTaxes().getList(),
                        useOrder                  = self.isDefaultsUseOrder(),
                        countryName               = response.getCountryName(),
                        departCityName            = response.getDepartCityName(),
                        currency                  = currencyAlias || currencyOriginal,
                        localConfig,
                        cachedBookingFields,
                        cachedBuyingFields,
                        priceBeforeDiscount       = null,   // Цена тура до скидки.
                        pricePersonBeforeDiscount = null;   // Цена за человека до скидки.
                    try {
                        localConfig = config || self;
                    } catch (error) {
                        localConfig = self;
                    }
                    // Формируем объект тура для отправки в корзину сравнения.
                    self.compareTourData = {
                        'sourceId'      : sourceId,
                        'offerId'       : offerId,
                        'requestId'     : requestId,
                        'tourId'        : response.getTourId()
                    };
                    oilTaxes = self.prepareOilTaxesForRendering(
                        self.filterOilTaxesByTouristsAges(self.filterZeroOilTaxes(oilTaxes))
                    );
                    self.cardCurrency = currencyAlias;
                    self.emit("cardCurrencyReady");
                    // Если горящие туры и показывть цену за тур
                    if (isTourPrice) {
                        pricePerson     = price;                            // Цена за 1 человека - это полученная от сервиса цена.
                        price           = price * (COUNT_OF_TOURISTS || 2); // Полная цена получается умножением цены на количество туристов (обычно их 2)
                    }
                    if (self.isDefaultsUseLocalStorage()) {
                        cachedBookingFields = self.getLocalStorage().getItem('bookingForm');
                        cachedBuyingFields = self.getLocalStorage().getItem('buyingForm');
                    }
                    // Если включена опция скидок и есть размер скидки,
                    // то добавлем ее в шаблон.
                    if (self.isDefaultsUseFakeDiscount() && self.getDefaultsFakeDiscount()) {
                        // Предыдущая цена.
                        // Приводим в границы допустимого диапазона, чтобы не подуелить на 0.
                        priceBeforeDiscount       = roundPrice(price / (1 - Math.max(0, Math.min(0.99, self.getDefaultsFakeDiscount()))));
                        // Предыдущая цена на человека.
                        pricePersonBeforeDiscount = roundPrice(isTourPrice ? (priceBeforeDiscount / (COUNT_OF_TOURISTS || 2)) : parseInt(priceBeforeDiscount / (adults + kids), 10));
                    }
                    // Устанавливаем заголовок страницы.
                    if (self.isDefaultsUseTitle()) {
                        self.setTitle((response.getHotelName() || response.getOriginalHotelName()) +
                            ' / ' + (response.getCountryName() || response.getOriginalCountryName()));
                    }
                    // Устанавливаем кол-во туристов.
                    self.personsCount = response.getPersonsCount();
                    self.afterIsLineAuthorizationReady(function () {
                        // Рисуем контент карточки тура в сплывающем окне.
                        container.find('#content').html(template.fetch('cardTour', {
                            'isToRussiaTour'            : isRussiaCountryName(response.getOriginalCountryName()),
                            'requestIdRequest'          : requestId,
                            'sourceIdRequest'           : sourceId,
                            'offerIdRequest'            : offerId,
                            'currencyAlias'             : currencyAlias,    // Слинкованная валюта цены.
                            'currencyOriginal'          : currencyOriginal, // Оригинальная валюта туроператора.
                            'countryIdRequest'          : response.getCountryId(),
                            'hotelOriginal'             : response.getOriginalHotelName(),
                            'hotelStop'                 : response.getHotelStop(),
                            'hotelId'                   : response.getHotelId(),
                            'hotelName'                 : response.getHotelName(),
                            'hotelLink'                 : response.getHotelLink(),
                            'hotelImage'                : response.getHotelPreviewLink(),
                            'hotelImagesCount'          : response.getHotelImagesCount(),
                            'countryOriginal'           : response.getOriginalCountryName(),
                            'countryId'                 : response.getCountryId(),
                            'countryName'               : response.getCountryName(),
                            'tourName'                  : response.getOriginalTourName(),
                            'tourId'                    : response.getTourId(),
                            'departCityOriginal'        : response.getDepartCityName(),
                            'departCityId'              : response.getDepartCityId(),
                            'departCityName'            : declineRussianCityToGenitive(response.getDepartCityName()),
                            'townOriginal'              : response.getOriginalResortName(),
                            'townId'                    : response.getResortId(),
                            'townName'                  : response.getResortName(),
                            'nights'                    : response.getNights(),
                            'dateStart'                 : dateStart && dateStart.format('j M'), // Если есть приводим к формату. день + месяц в родительном падаже
                            'dateEnd'                   : dateEnd   && dateEnd.format('j M'),   // Если есть приводим к формату. день + месяц в родительном падаже
                            'placementOriginal'         : placementOriginal,
                            'placementId'               : placementId > 0 ? placementId : 0,
                            'placementName'             : placementName,
                            'placementDescr'            : placementDescr,
                            'placementLowerCase'        : placementLowerCase,
                            'mealsOriginal'             : response.getOriginalMealName(),
                            'mealsId'                   : mealsId > 0 ? mealsId : 0,
                            'mealsName'                 : mealsName,
                            'mealsDescr'                : mealsDescr,
                            'mealsLowerCase'            : mealsLowerCase,
                            'roMealId'                  : roMealId,                            // Идентификатор питания "Без Питания".
                            'numberOriginal'            : numberOriginal,
                            'numberId'                  : numberId,
                            'numberName'                : numberName,
                            'enabledTicketsInTourPrice' : response.isTicketsIncluded(),        // Билеты включены в цену.
                            'havePlacesInHotel'         : response.getHotelStop(),
                            'flightThereBusiness'       : response.getBusinessTicketsDepart(), // Билеты бизнес-класса туда (0 — нет, 1 — есть, 2 — по запросу).
                            'flightThereEconom'         : response.getEconomTicketsDepart(),   // Билеты эконом-класса туда (0 — нет, 1 — есть, 2 — по запросу).
                            'flightBackBusiness'        : response.getBusinessTicketsReturn(), // Билеты бизнес-класса обратно (0 — нет, 1 — есть, 2 — по запросу).
                            'flightBackEconom'          : response.getEconomTicketsReturn(),   // Билеты эконом-класса обратно (0 — нет, 1 — есть, 2 — по запросу).
                            'stars'                     : response.getOriginalStarInteger(),   // Получить значение звезд целым числом.
                            'adults'                    : adults,
                            'kids'                      : kids,
                            'price'                     : toFormattedPrice(price),
                            'pricePerson'               : toFormattedPrice(pricePerson),
                            'priceBeforeDiscount'       : toFormattedPrice(priceBeforeDiscount),
                            'pricePersonBeforeDiscount' : toFormattedPrice(pricePersonBeforeDiscount),
                            'isUsePricePerson'          : isTourPrice || self.isUsePricePersonForOutput(), // Если горящие туры и показывть цену за тур - показть обе цены, иначе берем параметр для стандартного модуля
                            'useManyOffices'            : self.isDefaultsUseManyOffices(),
                            'buyingType'                : self.getDefaultsBuyingType(),
                            'useOrder'                  : useOrder,
                            'useCard'                   : self.getIsDisplayClaimForm(),
                            'isHotTours'                : showcase === 1,
                            'useDetailActualization'    : self.isDefaultsUseDetailActualization(),
                            'isUseWhereToBuy'           : self.isDefaultsUseWhereToBuy(),
                            'isLineAuthorization'       : self.isLineAuthorization(),
                            // Контакты турагенства для левой колонки.
                            'contact1Valid'             : agencyContact1.isValid(), // Признак валидности.
                            'contact1Content'           : agencyContact1.getHtml(), // Контент контактов.
                            // Контакты турагенства для формы.
                            'contact2Valid'             : agencyContact2.isValid(), // Признак валидности.
                            'contact2Content'           : agencyContact2.getHtml(),  // Контент контактов.
                            // Информация о заказчике
                            'buyingPhone'               : (cachedBuyingFields && cachedBuyingFields['buying-phone'])      ? cachedBuyingFields['buying-phone']      : '',
                            'buyingFio'                 : (cachedBuyingFields && cachedBuyingFields['fio'])               ? cachedBuyingFields['fio']               : '',
                            'buyingPassport'            : (cachedBuyingFields && cachedBuyingFields['passport'])          ? cachedBuyingFields['passport']          : '',
                            'buyingPassportEmission'    : (cachedBuyingFields && cachedBuyingFields['passport-emission']) ? cachedBuyingFields['passport-emission'] : '',
                            'buyingAddress'             : (cachedBuyingFields && cachedBuyingFields['address'])           ? cachedBuyingFields['address']           : '',
                            'buyingEmail'               : (cachedBuyingFields && cachedBuyingFields['email'])             ? cachedBuyingFields['email']             : '',
                            // Признак, что карточка может выделяться мышью. Напрямую зависит
                            // от признака использования контекстного меню.
                            'isSelectable'              : self.isDefaultsUseContextMenu(),
                            // Получить список топливных сборов сгруппированных по авиакомпании и валюте
                            // с нахождением минимальной и максимальной цены в каждой группе.
                            'visaRanges'                : visaInfo,
                            'oilTaxes'                  : oilTaxes,
                            'useComparison'             : localConfig.isDefaultsUseComparison(),
                            'phonePrefix'               : self.getPhonePrefix(),
                            'isUseFakeDiscount'         : self.isDefaultsUseFakeDiscount() && self.getDefaultsFakeDiscount(),
                            'discount'                  : parseInt(Math.round(self.getDefaultsFakeDiscount() * 100), 10),
                            'sexList'                   : LISTS.SEXS, // Список полов.
                            'isSocialNetworkSharingEnabled' : self.getIsSocialNetworkSharingEnabled()
                        }));
                        // !emit Popup.Card.fulled
                        self.syncEmit("fulled", {
                            'tour' : self.compareTourData
                        });
                        // Показываем сам попап.
                        container.css('opacity', 1);

                        if (useOrder) {
                            (function () {
                                var tourOrderForm;
                                // Экземпляр формы.
                                self.tourOrderForm = tourOrderForm = FormNewConcept.TourOrder.$create({
                                    'getOfficesCallback'     : function (callback) {        // Связывает через переленную области видимостиформу и карту, делает обратную связь. todo: сделать хранилище глобальным, чтобы измежать таких ситуаций.
                                        self.getOffices(callback);
                                    },
                                    'offerId'                : offerId,
                                    'isUseManyOffices'       : self.isDefaultsUseManyOffices(),
                                    'isUseWhereToBuy'        : self.isDefaultsUseWhereToBuy(),
                                    'officeId'               : self.getDefaultsOfficeId(),
                                    'isManyOfficesNonHeight' : self.isDefaultsManyOfficesNonHeight(),
                                    'manyOfficesHeight'      : self.getDefaultsManyOfficesHeight(),
                                    'localStorage'           : self.getLocalStorage(),
                                    'container'              : container.find("#form-order"),
                                    'renderer'               : self.getTemplate(),
                                    'templateName'           : 'formOrder',
                                    'userEvents'             : userEvents,
                                    'saveMethodType'         : 0,
                                    'renderOptions'          : {
                                        'useManyOffices'  : self.isDefaultsUseManyOffices(),
                                        'phonePrefix'     : self.getPhonePrefix(),
                                        'isUseWhereToBuy' : self.isDefaultsUseWhereToBuy()
                                    }
                                });

                                // Создаём отправщик формы.
                                self.tourOrderSender = Sender.Form.TourOrder.$create({
                                    'source'           : tourOrderForm,
                                    'applicationFrame' : self.getParent(),
                                    'staticOptions'    : {
                                        'requestId'      : requestId,
                                        'sourceId'       : sourceId,
                                        'offerId'        : offerId,
                                        'countryName'    : countryName,
                                        'cityFromName'   : departCityName,
                                        'currencyAlias'  : currency
                                    }
                                });
                            }());
                        }
                        // Если в модуле используется форма заявки, то создаём ее и ее отправщик.
                        self.afterIsLineAuthorizationReady(function () {
                            var claimForm;
                            if (self.getIsDisplayClaimForm()) {
                                self.claimForm = claimForm = FormNewConcept.Claim.$create({
                                    'container'     : container.find("#form-card"),
                                    'renderer'      : self.getTemplate(),
                                    'templateName'  : 'formClaim',
                                    'parent'        : self,
                                    'userEvents'    : userEvents,
                                    'localStorage'  : self.getLocalStorage(),
                                    'renderOptions' : {
                                        'adults'              : adults,
                                        'kids'                : kids,
                                        'isLineAuthorization' : self.isLineAuthorization(),
                                        'phonePrefix'         : self.getPhonePrefix(),
                                        'sexList'             : LISTS.SEXS // Список полов.
                                    }
                                });
                                self.claimFormSender = Sender.Form.Claim.$create({
                                    'source'              : claimForm,
                                    'applicationFrame'    : self.getParent(),
                                    'isLineAuthorization' : self.isLineAuthorization(),
                                    'staticOptions'       : {
                                        "SourceId"         : sourceId,
                                        "OfferId"          : offerId,
                                        "RequestId"        : requestId,
                                        "InitialURL"       : String(window.location),
                                        "AffiliateProgram" : self.getAffilitateProgram()
                                    }
                                });
                                self.emit("claimFormReady");
                            }
                        });
                        // Включаем "Где купить".
                        if (self.isDefaultsUseWhereToBuy()) {
                            whereToBuyInitSettings.departCityId   = response.getDepartCityId();
                            whereToBuyInitSettings.departCityName = response.getDepartCityName();
                        }
                        // Делаем запрос к сервису и получаем информацию об отеле.
                        if (hotelId) {
                            Service.Main.GetHotelInfo.$create({
                                'useCache'       : self.isDefaultsUseLocalStorage(),
                                'cacheExpire'    : self.getDefaultsStorageExpire(),
                                'cacheNamespace' : self.getDefaultsStorageNamespace()
                            }).call({
                                'showcase' : showcase,
                                'hotelId'  : hotelId
                            },
                                function (response) {
                                    var groups         = [],
                                        smallMap       = container.find('#map-small').get(0),
                                        latitude       = response.getLatitude(),
                                        longitude      = response.getLongitude(),
                                        weathers       = [];
                                    // Если карточку уже уничтожили - ничего не делаем, чтобы не вызвать ошибок.
                                    if (self.getIsCardInDestroying()) {
                                        return;
                                    }
                                    container.find('div.hotel-info').addClass('show');
                                    response.getFacilities().forEach(function (element) {
                                        var items = [];
                                        // Собираем все внутренние элементы группы удобств.
                                        element.getFacilities().forEach(function (element) {
                                            items.push({
                                                'id'   : element.getId(),
                                                'hit'  : element.getHit(),
                                                'name' : element.getName()
                                            });
                                        });
                                        // Добавляем группу удобств в список.
                                        if (element.getId() !== 6) {
                                            // Берем все, кроме пляжной линии.
                                            // TODO: выпилить этот кастыль, по хорошему этот фикс должен быть на стороне dotnet !!!
                                            groups.push({
                                                'id'    : element.getId(),   // Идентификатор группы удобств.
                                                'name'  : element.getName(), // Название группы удобств.
                                                'items' : items              // Элементы группы удобств.
                                            });
                                        }
                                    });
                                    // Рисуем контент на странице тура.
                                    container.find('#content-services').
                                        html(template.fetch('hotelServices', {
                                            'groups' : groups
                                        }));
                                    // Получаем список погоды в виде обыкновенного массива.
                                    response.getCurrentWeather().forEach(function (weather) {
                                        weathers.push(weather.getOptions());
                                    });
                                    container.find('#content-description').
                                        html(template.fetch('hotelDescription', {
                                            'address'              : this.getAddress(),
                                            'hotelPhone'           : this.getHotelPhone(),
                                            'hotelFax'             : this.getHotelFax(),
                                            'hotelEmail'           : this.getHotelEmail(),
                                            'hotelSite'            : this.getSite(),
                                            'hotelRoomsCount'      : this.getHotelRoomsCount(),
                                            'hotelAirportDistance' : this.getHotelAirportDistance(),
                                            'description'          : this.getDescriptionAsText(),
                                            'weathers'             : weathers
                                        }));
                                    // Показываем маленькую карту.
                                    if (latitude && longitude) {
                                        self.initMap(function (maps) {
                                            var position,     // Объект позиции на карте.
                                                map,          // Экземпляр карты.
                                                marker,       // Экземпляр отметки на карте.
                                                zoomOfSmallMap,
                                                localStorage; // Локальное хранилище.
                                            if ($(smallMap).is(':empty')) {
                                                localStorage   = self.getLocalStorage();
                                                zoomOfSmallMap = localStorage.getItem("zoomOfSmallMap");
                                                zoomOfSmallMap = parseInt(zoomOfSmallMap, 10);
                                                // Получаем зум.
                                                // Проверяем, что зум в допустимых границах и правильно разпарсился.
                                                if (isNaN(zoomOfSmallMap)) {
                                                    zoomOfSmallMap = self.$self.DEFAULT_MAP_ZOOM; // Устанавливаем по умолчанию.
                                                }
                                                // Позици отеля на карте.
                                                position = new maps['LatLng'](latitude, longitude);
                                                // Создаем карту текущего расположения отеля.
                                                map = new maps['Map'](smallMap, {
                                                    'zoom'      : zoomOfSmallMap,
                                                    'center'    : position,
                                                    'mapTypeId' : maps['MapTypeId']['ROADMAP']
                                                });
                                                maps.event.addListener(map, 'zoom_changed', function () {
                                                    localStorage
                                                        .setItem("zoomOfSmallMap", map.getZoom());
                                                });
                                                // Ставим маркер отеля на карту.
                                                marker = new maps['Marker']({
                                                    'position' : position,
                                                    'map'      : map
                                                });
                                            }
                                        });

                                    }
                                    // Проставляем значение рейтинга отеля.
                                    container.find('#hotel-rate').
                                        html(template.fetch('hotelRate', {
                                            'rate' : parseFloat(this.getHotelRate().toFixed(1))
                                        }));
                                    // !emit Popup.Card.fulled
                                    self.syncEmit("fulled", {
                                        'tour' : self.compareTourData
                                    });
                                    // Проставляем координаты большой карты.
                                    container.find('#google-map').
                                        attr('data-longitude', this.getLongitude()).
                                        attr('data-latitude', this.getLatitude());
                                });

                            /*
                             Делаем запрос на получение информации о отзывах, если есть разрешение.
                             Чтобы получить разрешение нужна специальная лицензия.
                             */
                            if (self.getIsReviewsAllowed()) {
                                self.createReviews(hotelId);
                            } else {
                                // Скрываем таб с отзывами, т.к. они не доступны.
                                self.hideReviewsTab();
                            }
                        }
                        // Получаем список офисов текущего турагенства. Эта
                        // конструкция будет работать только в том случае, если
                        // задана и разрешена многоофисность и не включен режим "где купить".
                        if (self.isDefaultsUseDetailActualization()) {
                            (function () {
                                // Обработчик на случай пустого ответа (например: тур по какой-то причине не был найден) или
                                // случай с ошибкой по таймауту.
                                var emptyDataOrTimeoutHandler = function () {
                                    self.getContainer().find('.tour-details-loader').each(function () {
                                        $(this).addClass('hidden');
                                    });
                                    self.getContainer().find('div.flight-details').each(function () {
                                        $(this).removeClass('hidden');
                                    });
                                    // Показать контейнер с текстом о составе тура
                                    container.find("#resources-representation-text").html('Не удалось уточнить полный состав тура у туроператора.');
                                    self.getContainer().find('#resources-representation-text').show();
                                };
                                // Создаем объект запрашивающий детальную информацию о туре.
                                detailActualizeProcess = ActualizeProcess.$create({
                                    'useCache'      : self.isDefaultsUseLocalStorage(),
                                    'cacheExpire'   : self.getDefaultsStorageExpire(),
                                    'cacheNamespace': self.getDefaultsStorageNamespace(),
                                    'sourceId'      : sourceId,   // Идентификатор тур оператора.
                                    'offerId'       : offerId,    // Идентификатор цены.
                                    'countryId'     : countryId,  // Идентификатор страны назначения.
                                    'townFromId'    : townFromId, // Идентификатор города вылета.
                                    'requestId'     : requestId,  // Идентификатор запроса поиска.
                                    'currency'      : currency,   // Валюта.
                                    'showcase'      : showcase    // Признак горящих туров.
                                });
                                // Показываем лоадеры.
                                self.getContainer().find('.tour-details-loader').each(function () {
                                    $(this).removeClass('hidden');
                                });
                                // Скрыть контейнер с текстом о составе тура
                                self.getContainer().find('#resources-representation-text').hide();
                                // Подписываемся на событие завершения, в результате которого отображаем обновленную информацию.
                                detailActualizeProcess.bind('complete', function (event) {
                                    var response    = (event.hasOwnProperty('data')) ? event['data'] : null,
                                        isRussia    = countryId === RUSSIA_COUNTRY_ID,
                                        isTourSold,
                                        hasFlights,
                                        adults,                             // количество взрослых в туре.
                                        kids,                               // количество детей в туре.
                                        actualizePrice,                     // цена тура.
                                        pricePerson,                        // цена за тур на человека.
                                        priceBeforeDiscount       = null,   // Цена тура до скидки.
                                        businessTicketsDepart,
                                        economTicketsDepart,
                                        businessTicketsReturn,
                                        economTicketsReturn,
                                        pricePersonBeforeDiscount = null, // Цена за человека до скидки.
                                        resourcesRepresentation,
                                        isHotelStop,
                                        visaInfo = response.getVisaInfo().getListToOutput(),
                                        oilTaxes = response.getOilTaxes().getList();
                                    // Если карточку уже уничтожили - ничего не делаем, чтобы не вызвать ошибок.
                                    if (self.getIsCardInDestroying()) {
                                        return;
                                    }
                                    oilTaxes = self.prepareOilTaxesForRendering(
                                        self.filterOilTaxesByTouristsAges(self.filterZeroOilTaxes(oilTaxes))
                                    );
                                    if (response) {
                                        adults         = response.getAdults();
                                        kids           = response.getKids();
                                        actualizePrice = response.getPrice();
                                        pricePerson    = roundPrice(actualizePrice / (adults + kids));
                                        isHotelStop    = response.getHotelStop() === 1;

                                        // Если горящие туры и показывть цену за тур
                                        if (isTourPrice) {
                                            pricePerson     = actualizePrice;                               // Цена за 1 человека - это полученная от сервиса цена.
                                            actualizePrice  = actualizePrice * (COUNT_OF_TOURISTS || 2);    // Полная цена получается умножением цены на количество туристов (обычно их 2)
                                        }

                                        businessTicketsDepart = response.getBusinessTicketsDepart();
                                        economTicketsDepart   = response.getEconomTicketsDepart();
                                        businessTicketsReturn = response.getBusinessTicketsReturn();
                                        economTicketsReturn   = response.getEconomTicketsReturn();
                                        isTourSold            = !businessTicketsDepart && !economTicketsDepart && !businessTicketsReturn && !economTicketsReturn && isHotelStop;
                                        hasFlights            = (!!businessTicketsDepart || !!economTicketsDepart) || (!!businessTicketsReturn || !!economTicketsReturn);

                                        // Если нет билетов и места в отеле - тур продан.
                                        if (isTourSold) {
                                            (function () {
                                                var leftBox = container.find('.left-box');
                                                if (leftBox.length && !leftBox.hasClass("sold")) {
                                                    leftBox.addClass("sold");
                                                }
                                            }());

                                            (function () {
                                                var localConfig,
                                                    isModule5;
                                                try { // Пытаемся схватить глобальный конфиг.
                                                    localConfig = config || self;
                                                } catch (error) { // Если не удалось, то используем текущий фрейм.
                                                    localConfig = self;
                                                }
                                                isModule5 = localConfig.getDefaultsSolution() === 'module50';
                                                // Создание кнопки для проброса запуска похожего поиска.
                                                if (Hash.$create().hasItem("isSharingURL") && isModule5) { // Скрываем другие кнопки, только если есть isSharingURL в хэше. // Только для 5 модуля делаем кнопки.
                                                    // Скрываем блок оплаты, т.к. оплатить уже невозможно.
                                                    self.getContainer().find("#payment-block").hide();
                                                    self.createSimilarSearchButtonAsNeeded();
                                                    self.getContainer().find(".js-similar-search-button").show(); // Показываем кнопки найти похожий тур.
                                                    // Показываем особое сообщение.
                                                    self.getContainer().find(".js-tour-is-sold-container").show();
                                                }
                                            }());
                                        }

                                        // Если включена опция скидок и есть размер скидки,
                                        // то добавлем ее в шаблон.
                                        if (self.isDefaultsUseFakeDiscount() && self.getDefaultsFakeDiscount()) {
                                            // Предыдущая цена.
                                            // Приводим в границы допустимого диапазона, чтобы не подуелить на 0.
                                            priceBeforeDiscount       = roundPrice(actualizePrice / (1 - Math.max(0, Math.min(0.99, self.getDefaultsFakeDiscount()))));
                                            // Предыдущая цена на человека.
                                            pricePersonBeforeDiscount = roundPrice(isTourPrice ? (priceBeforeDiscount / (COUNT_OF_TOURISTS || 2)) : parseInt(priceBeforeDiscount / (adults + kids), 10));
                                        }
                                        // Скрываем лоадеры.
                                        self.getContainer().find('.tour-details-loader').each(function () {
                                            $(this).addClass('hidden');
                                        });
                                        // Показать контейнер с текстом о составе тура
                                        self.getContainer().find('#resources-representation-text').show();
                                        // Отображение информации о составе тура
                                        resourcesRepresentation = response.getResources().getResourcesListAsString(isRussia, mealsId === roMealId, isHotelStop, hasFlights);
                                        if (resourcesRepresentation) {
                                            container.find("#other-resources-text").html(resourcesRepresentation);
                                        }
                                        // Отображаем информацию по перелету "туда"
                                        container.find('#flight-there').html(template.fetch('actualizedFlightsDetails', {
                                            'isMobile'      : Browser.$create().isMobile(),
                                            'flightInfo'    : response.getThereFlightDefinition(),
                                            'direction'     : 'туда',
                                            'flightBusiness': businessTicketsDepart, // Билеты бизнес-класса туда (0 — нет, 1 — есть, 2 — по запросу).
                                            'flightEconom'  : economTicketsDepart    // Билеты эконом-класса туда (0 — нет, 1 — есть, 2 — по запросу).
                                        }));
                                        // Отображаем информацию по перелету "обратно".
                                        container.find('#flight-back').html(template.fetch('actualizedFlightsDetails', {
                                            'isMobile'      : Browser.$create().isMobile(),
                                            'flightInfo'    : response.getBackFlightDefinition(),
                                            'direction'     : 'обратно',
                                            'flightBusiness': businessTicketsReturn, // Билеты бизнес-класса обратно (0 — нет, 1 — есть, 2 — по запросу).
                                            'flightEconom'  : economTicketsReturn    // Билеты эконом-класса обратно (0 — нет, 1 — есть, 2 — по запросу).
                                        }));
                                        // Отображаем информацию по отелю.
                                        container.find('#have-places-in-hotel').html(template.fetch('actualizedHotelPlaces', {
                                            'havePlacesInHotel' : response.getHotelStop() // 0 - есть места в отеле, 1 - в отеле стоп (нет мест), 2 - места в отеле по запросу => см. ActualizePrice/Response
                                        }));
                                        // Обновляем цену, только в том, члучае, если она пришла в ответе.
                                        if (actualizePrice) {
                                            // Если пришла цена, то топливные сборы были учтены в ней.
                                            (function () {
                                                var oilTaxesTooltipBox = self.getContainer().find('.oil-taxes-tooltip-box');
                                                if (_.keys(oilTaxes).length) {
                                                    oilTaxesTooltipBox.html(
                                                        template.fetch('oilTaxTooltip', {
                                                            'taxes'   : oilTaxes,
                                                            'caption' : 'Топливные сборы',
                                                            'useBr'   : visaInfo && visaInfo.length
                                                        }) + ((actualizePrice > price) ? // Если актуализированная цена больше текущей (т.е. это признак того, что доплаты были гарантированно включены в актуализированной цене и не были включены в цене до актуализации), То выводим предыдущую цену.
                                                            template.fetch('visaAndOldOilTaxTooltip', {
                                                                'taxes'   : [{
                                                                    'currency'      : currencyAlias,
                                                                    'isSinglePrice' : true,
                                                                    'price'         :  toFormattedPrice(price)
                                                                }],
                                                                'caption' : 'Цена без сборов',
                                                                'useBr'   : visaInfo && visaInfo.length
                                                            }) : '')
                                                    );
                                                } else {
                                                    if (visaInfo.length) {
                                                        oilTaxesTooltipBox.hide();
                                                    } else {
                                                        self.getContainer().find('#surcharges-container').hide();
                                                    }
                                                }
                                            }());
                                            container.find('#tour-properties-payment .price').html(template.fetch('actualizedPrice', {
                                                'currencyAlias'             : response.getCurrencyAlias(),        // Слинкованная валюта цены.
                                                'currencyOriginal'          : response.getOriginalCurrencyName(), // Оригинальная валюта туроператора.
                                                'price'                     : toFormattedPrice(actualizePrice),
                                                'pricePerson'               : toFormattedPrice(pricePerson),
                                                'priceBeforeDiscount'       : toFormattedPrice(priceBeforeDiscount),
                                                'pricePersonBeforeDiscount' : toFormattedPrice(pricePersonBeforeDiscount),
                                                'isUseFakeDiscount'         : self.isDefaultsUseFakeDiscount() && self.getDefaultsFakeDiscount(),
                                                'isUsePricePerson'          : isTourPrice || self.isUsePricePersonForOutput(), // Если горящие туры и показывть цену за тур - показть обе цены, иначе берем параметр для стандартного модуля
                                                'discount'                  : parseInt(Math.round(self.getDefaultsFakeDiscount() * 100), 10),
                                                'isHotTours'                : showcase === 1
                                            }));
                                            container.find('#price-checked-online').show();
                                            self.afterIsLineAuthorizationReady(function () {
                                                // Обновляем предоплаты.
                                                if (self.getIsDisplayClaimForm()) {
                                                    self.afterClaimFormReady(function () {
                                                        self.claimForm.refreshPrepayment(actualizePrice, response.getCurrencyAlias());
                                                    });
                                                    // self.refreshOptions(actualizePrice, response.getCurrencyAlias());
                                                }
                                            });
                                        } else {
                                            // Если цена не пришла, то выводим обычный вариант.
                                            (function () {
                                                var oilTaxesTooltipBox = self.getContainer().find('.oil-taxes-tooltip-box');
                                                if (_.keys(oilTaxes).length) {
                                                    oilTaxesTooltipBox.html(
                                                        template.fetch('oilTaxTooltip', {
                                                            'taxes'   : oilTaxes,
                                                            'caption' : 'Топливные сборы',
                                                            'useBr'   : visaInfo && visaInfo.length
                                                        })
                                                    );
                                                } else {
                                                    if (visaInfo.length) {
                                                        oilTaxesTooltipBox.hide();
                                                    } else {
                                                        self.getContainer().find('#surcharges-container').hide();
                                                    }
                                                }
                                            }());
                                        }
                                        // Делаем рабочей подсказку сборов.
                                        self.getContainer().find('.tour-price-additional-info .tooltip-box').removeClass('disabled');
                                        // Обновляем цену в соответствии со схемой, если есть идентификатор схемы.
                                        if (self.isPossibleToRenderOnlinePaymentHint()) {
                                            self.renderOnlinePaymentHint(actualizePrice, currency);
                                        }
                                        // !emit Popup.Card.fulled
                                        self.syncEmit("fulled", {
                                            'tour' : self.compareTourData
                                        });
                                    }
                                });
                                detailActualizeProcess.bind('tourNotFound', emptyDataOrTimeoutHandler);
                                detailActualizeProcess.bind('timeout', emptyDataOrTimeoutHandler);
                                detailActualizeProcess.bind('error', emptyDataOrTimeoutHandler);
                                // Запускаем процес детальной актуализации.
                                detailActualizeProcess.start();
                            }());
                        }
                        self.afterIsLineAuthorizationReady(function () {
                            if (self.getIsDisplayClaimForm()) {
                                self.afterClaimFormReady(function () {
                                    self.claimForm.refreshPrepayment(response.getPrice(), response.getCurrencyAlias());
                                });
                            }
                        });
                        // Обновляем цену в соответствии со схемой, если есть идентификатор схемы.
                        if (self.isPossibleToRenderOnlinePaymentHint()) {
                            self.renderOnlinePaymentHint(price, currency);
                        }
                        // Инициализируем кнопку вконтакте.
                        if (self.isSocialNetworkSharingEnabled) {
                            self.initializeVkShareButtonURL(response, price);
                            self.insertTwitterShareButton(response, price);
                            self.insertOKShareButton(response, price);
                            self.initializeFullLinkButton();
                        }
                    });
                } else {
                    // Убираем добавку, т.к. в этом случае форм нет.
                    // Экранная клавиатура не потребуется.
                    // И за одно все содержимое будет на одной странице.
                    self.additionalIOSHeight = 0;
                    // Добавляем особый класс если тур не найден.
                    $(self.getDocument()).find("#card").addClass("tour-undefined");
                    (function () {
                        var localConfig;
                        try { // Пытаемся схватить глобальный конфиг.
                            localConfig = config || self;
                        } catch (error) { // Если не удалось, то используем текущий фрейм.
                            localConfig = self;
                        }
                        // Запрашиваемого тура нет в системе.
                        container.find('#content').html(template.fetch('cardTourActualizePriceError', {
                            'isShowFindSimilarButton' : localConfig.getDefaultsSolution() === 'module50'
                        }));
                        // !emit Popup.Card.fulled
                        self.syncEmit("fulled", {
                            'tour' : self.compareTourData
                        });
                    }());
                    // Показываем сам попап.
                    container.css('opacity', 1);
                    // Создание кнопки для того, чтобы пробрасывать событие того, что требуется похожий поиск.
                    self.createSimilarSearchButtonAsNeeded();
                }
            });
        });

        // Событие смены вкладки.
        this.bind('changeItem', function (event) {
            var localStorage,
                zoomOfSmallMap,
                data       = event['data'] || {},
                type       = data['type'] ? String(data['type']) : '',
                hotelId    = parseInt(String(data['hotelId']), 10) || 0,
                mapElement = self.getContainer().find('#google-map').get(0);
            if (type === 'map' && $(mapElement).is(':empty')) {
                // Дожидаемся загрузки карты.
                (function (maps) {
                    var position, // Объект позиции на карте.
                        map,      // Экземпляр карты.
                        longitude = Number($(mapElement).attr('data-longitude')) || 0,
                        latitude  = Number($(mapElement).attr('data-latitude')) || 0,
                        marker;   // Экземпляр отметки на карте.

                    localStorage   = self.getLocalStorage();
                    zoomOfSmallMap = localStorage.getItem("zoomOfLargeMap");
                    zoomOfSmallMap = parseInt(zoomOfSmallMap, 10);

                    // Получаем зум.
                    // Проверяем, что зум в допустимых границах и правильно разпарсился.
                    if (isNaN(zoomOfSmallMap)) {
                        zoomOfSmallMap = self.$self.DEFAULT_MAP_ZOOM; // Устанавливаем по умолчанию.
                    }

                    // Позици отеля на карте.
                    position = new maps['LatLng'](latitude, longitude);
                    // Создаем карту текущего расположения отеля.
                    map = new maps['Map'](mapElement, {
                        'zoom'      : zoomOfSmallMap,
                        'center'    : position,
                        'mapTypeId' : maps['MapTypeId']['ROADMAP']
                    });
                    maps.event.addListener(map, 'zoom_changed', function () {
                        localStorage
                            .setItem("zoomOfLargeMap", map.getZoom());
                    });
                    // Ставим маркер отеля на карту.
                    marker = new maps['Marker']({
                        'position' : position,
                        'map'      : map
                    });
                }(library['maps']));
            } else if (type === 'wtb' && self.getContainer().find('#wtb-filters').is(':empty')) {
                WhereToBuy.$create(self, {
                    'departCityId'      : whereToBuyInitSettings.departCityId,
                    'departCityName'    : whereToBuyInitSettings.departCityName
                });
            } else if (type === 'comments') { // Открытие комментариев.
                self.reviewTabs.open(); // Пробрасываем открытие.
                userEvents.emit('hotelReviewsSelected', {});
            }
        });
        this.lineAuthorizationInitialize();
    },

    /**
     * Обработчик получения ответа от GetSettings.
     *
     * @private
     * @field
     * @name Popup.Card#onGetSettingsResponseHandler
     * @type {Function}
     */
    onGetSettingsResponseHandler : function (response) {
        'use strict';
        this.lineAuthorization = response.isLineAuthorization();
        this.isLineAuthorizationReady = true;
        this.emit('isLineAuthorizationReady');
    },


    /**
     * Обработчик инициализации прямой авторизации после готовности валюты.
     *
     * @private
     * @field
     * @name Popup.Card#lineAuthorizationInitializeAfterCurrencyReadyHandler
     * @type {Function}
     */
    lineAuthorizationInitializeAfterCurrencyReadyHandler : function () {
        'use strict';
        this.getSettingsResponse(this.onGetSettingsResponseHandler);
    },

    /**
     * Инициализировать прямую авторизацию.
     *
     * @public
     * @function
     * @name Popup.Card#lineAuthorizationInitialize
     * @return {void}
     */
    lineAuthorizationInitialize : function () {
        'use strict';
        this.afterCurrencyReady(this.lineAuthorizationInitializeAfterCurrencyReadyHandler);
    },

    /**
     * Выполнить обработчик после того как будет готова валюта.
     *
     * @public
     * @function
     * @name Popup.Card#afterCurrencyReady
     * @param {Function} callback Функция обратного вызова.
     * @return {Popup.Card}
     */
    afterCurrencyReady : function (callback) {
        'use strict';
        if (this.cardCurrency !== null) {
            this.once("cardCurrencyReady", callback);
        } else {
            callback();
        }
        return this;
    },

    /**
     * Выполнить после того, как прямая авторизация будет готова.
     *
     * @public
     * @function
     * @name Popup.Card#afterIsLineAuthorizationReady
     * @param {Function} callback Функция обратного вызова.
     * @return {void}
     */
    afterIsLineAuthorizationReady : function (callback) {
        'use strict';
        if (!this.isLineAuthorizationReady) {
            this.once('isLineAuthorizationReady', callback);
        } else {
            callback();
        }
    },

    /**
     * Призкак, если форма покупки по плпстиковым картам имеет прямую авторизацию.
     *
     * @public
     * @function
     * @name Popup.Card#isLineAuthorization
     * @see Popup.Card#lineAuthorization
     * @return {Boolean|null}
     */
    isLineAuthorization : function () {
        'use strict';
        return this.lineAuthorization;
    },

    /**
     * Метод подготавливающий массив сборов к отображению.
     *
     * @private
     * @function
     * @name Popup.Card#prepareOilTaxesForRendering
     * @param {Array} taxesList Массив сборов.
     * @return {Object}
     */
    prepareOilTaxesForRendering : function (taxesList) {
        'use strict';

        /**
         * Функция фильтрующая массив сборов по авиакомпании.
         *
         * @private
         * @function
         * @name getTaxesByAirline
         * @param {String} airline Авиакомпания.
         * @param {Array} taxes Массив сборов.
         * @return {Array}
         */
        function getTaxesByAirline (airline, taxes) {
            return _.filter(taxes, function (tax) { return tax.getAirline() === airline; });
        }

        /**
         * Функция фильтрующая массив сборов по валюте.
         *
         * @private
         * @function
         * @name getTaxesByCurrency
         * @param {String} currency Валюта.
         * @param {Array} taxes Массив сборов.
         * @return {Array}
         */
        function getTaxesByCurrency (currency, taxes) {
            return _.filter(taxes, function (tax) { return tax.getCurrency() === currency; });
        }

        /**
         * Функция возвращающая массив валют представленных в переданном наборе сборов.
         *
         * @private
         * @function
         * @name getPresentCurrencies
         * @param {Array} taxes Массив сборов.
         * @return {Array}
         */
        function getPresentCurrencies (taxes) {
            return _.reduce(taxes, function (sum, tax) {
                var currency = tax.getCurrency();
                if (sum.indexOf(currency) === -1) {
                    sum.push(currency);
                }
                return sum;
            }, []);
        }

        /**
         * Функция возвращающая массив авиакомпаний представленных в переданном наборе сборов.
         *
         * @private
         * @function
         * @name getPresentAirlines
         * @param {Array} taxes Массив сборов.
         * @return {Array}
         */
        function getPresentAirlines (taxes) {
            return _.reduce(taxes, function (sum, tax) {
                var airline = tax.getAirline();
                if (sum.indexOf(airline) === -1) {
                    sum.push(airline);
                }
                return sum;
            }, []);
        }

        /**
         * Функция возвращающая массив сборов для которых не представлен возраст пассажиров.
         *
         * @private
         * @function
         * @name getTaxesWithoutPassengersAge
         * @param {Array} taxes Массив сборов.
         * @return {Array}
         */
        function getTaxesWithoutPassengersAge (taxes) {
            return _.filter(taxes, function (tax) { return tax.getAgeFrom() === null && tax.getAgeTo() === null; });
        }

        /**
         * Функция возвращающая массив сборов для которых представлен возраст пассажиров.
         *
         * @private
         * @function
         * @name getTaxesWithPassengersAge
         * @param {Array} taxes Массив сборов.
         * @return {Array}
         */
        function getTaxesWithPassengersAge (taxes) {
            return _.filter(taxes, function (tax) { return tax.getAgeFrom() !== null || tax.getAgeTo() !== null; });
        }

        /**
         * Функция возвращающая сборы в подготовленном для отображения виде.
         *
         * @private
         * @function
         * @name groupTaxesWithoutAgeForRendering
         * @param {Array} taxes Массив сборов.
         * @return {Object}
         */
        function groupTaxesWithoutAgeForRendering (taxes) {
            function getTaxPrice(tax) {
                return tax.getPrice();
            }
            var result = null;
            if (taxes.length) {
                result = {
                    minPrice    : _.min(taxes, getTaxPrice).getPrice(),
                    maxPrice    : _.max(taxes, getTaxPrice).getPrice(),
                    ageFrom     : null,
                    ageTo       : null
                };
            }
            return result;
        }

        var result = null;
        if (taxesList.length) {
            result = _.reduce(getPresentAirlines(taxesList), function (map, airline) {
                airline = airline ? airline : '';
                var taxesByAirline = getTaxesByAirline(airline, taxesList),
                    currenciesForAirline = getPresentCurrencies(taxesByAirline);
                map[airline] = _.reduce(currenciesForAirline, function (sum, currency) {
                    var taxesByAirlineAndCurrency = getTaxesByCurrency(currency, taxesByAirline),
                        groupedTaxesWithoutAges = groupTaxesWithoutAgeForRendering(getTaxesWithoutPassengersAge(taxesByAirlineAndCurrency)),
                        groupedTaxesWithAges;
                    groupedTaxesWithoutAges = groupedTaxesWithoutAges ? [groupedTaxesWithoutAges] : [];
                    groupedTaxesWithAges = _.reduce(getTaxesWithPassengersAge(taxesByAirlineAndCurrency), function (list, tax) {
                        list.push({
                            minPrice: tax.getPrice(),
                            maxPrice: tax.getPrice(),
                            ageFrom: tax.getAgeFrom(),
                            ageTo: tax.getAgeTo()
                        });
                        return list;
                    }, []);
                    sum[currency] = _.union(groupedTaxesWithoutAges, groupedTaxesWithAges);
                    return sum;
                }, {});
                return map;
            }, {});
            // Ставим сборы без авиакомпании первыми в списке.
            if (result['']) {
                result = _.extend({}, {'': result['']}, result);
            }
        }
        return result;
    },

    /**
     * Метод фильтраци нулевых топливных сборов.
     *
     * @private
     * @function
     * @name Popup.Card#filterZeroOilTaxes
     * @param {Array} oilTaxesList Массив топливных сборов.
     * @return {Array}
     */
    filterZeroOilTaxes : function (oilTaxesList) {
        'use strict';
        return _.filter(oilTaxesList, function (tax) { return !!tax.getPrice(); });
    },

    /**
     * Метод фильтраци топливных сборов по возрасту детей в туре.
     *
     * @private
     * @function
     * @name Popup.Card#filterOilTaxesByTouristsAges
     * @param {Array} oilTaxesList Массив топливных сборов.
     * @return {Array}
     */
    filterOilTaxesByTouristsAges : function (oilTaxesList) {
        'use strict';

        /**
         * Функция проверяющая, что топливный сбор применим к переданному набору возрастой детей.
         *
         * @private
         * @function
         * @name isTaxValidForInputKidsAges
         * @param {Object} tax топливный сбор.
         * @param {Array} agesList Массив возрастов.
         * @return {Boolean}
         */
        function isTaxValidForInputKidsAges (tax, agesList) {
            var result  = true,
                ageFrom = tax.getAgeFrom(),
                ageTo   = tax.getAgeTo();
            if (agesList.length) {
                // Проверяем чтобы сбор проходил по возрасту хотя бы для одного из детей.
                result = _.filter(agesList, function (age) {
                        var result = true;
                        if (ageFrom !== null && ageTo !== null) {
                            result = ageFrom <= age && ageTo > age;
                        } else if (ageFrom !== null && ageTo === null) {
                            result = ageFrom <= age;
                        } else if (ageFrom === null && ageTo !== null) {
                            result = ageTo > age;
                        }
                        return result;
                    }).length > 0;
            } else {
                // Проверяем, что в отстствие детей мы не пропустим сбор предазначеный туристам,
                // чей возраст меньше 18 лет.
                if (ageTo !== null) {
                    // Тут проверяем, что именно "больше", поскольку приходит "не включительно".
                    result = ageTo > 18;
                }
            }
            return result;
        }

        /**
         * Функция проверяющая, что топливный сбор, если имеет возраст, то этот возраст не превышает 18 лет.
         *
         * @private
         * @function
         * @name isTaxForKid
         * @param {Object} tax топливный сбор.
         * @return {Boolean}
         */
        function isTaxForKid (tax) {
            var result  = true,
                ageFrom = tax.getAgeFrom(),
                ageTo   = tax.getAgeTo();
            if (ageFrom !== null && ageTo !== null) {
                result = ageFrom < 18 && ageTo <= 18;
            } else if (ageFrom !== null && ageTo === null) {
                result = ageFrom < 18;
            } else if (ageFrom === null && ageTo !== null) {
                result = ageTo <= 18;
            } else {
                result = true;
            }
            return result;
        }

        var result      = _.clone(oilTaxesList),
            kidsAges    = _.filter(this.getKidsAges(), function (age) { return age !== null; });
        if (kidsAges) {
            result = _.filter(result, function (tax) {
                var result = true;
                if (isTaxForKid(tax)) {
                    result = isTaxValidForInputKidsAges(tax, kidsAges);
                }
                return result;
            });
        }
        return result;
    },

    /**
     * Ассинхронно получить ответ сервиса GetSettings для этой карточки.
     *
     * @public
     * @function
     * @name Popup.Card#getSettingsResponse
     * @see Popup.Card#settingsResponse
     * @return {void}
     */
    getSettingsResponse : function (callback) {
        'use strict';
        /*
             Чтобы не делать лишних запросов к сервису, храним все обработчики до получения ответа,
             а по получению вызываем их и сохраняем объект ответа.
        */
        var self = this;
        if (this.settingsResponse === null) {
            /*
                 Если нет закэшированного ответа сервиса,
                 то сохраняем калбэк в массив до возвращения ответа.
              */
            if (!this.settingsResponseCallbacks) {
                /*
                     Если каллбэк первый в стеке, то создаем стек и вызываем сервис.
                     Остальные калбеки просто попадут в стек, но не вызовут сервис,
                     т.к. стек существует.
                 */
                this.settingsResponseCallbacks = [];
                Service.Claims.GetSettings.$create().call(this.getRequestId(), this.getOfferId(), this.getSourceId(), function (response) {
                    // Получаем все обработчики ответа.
                    var callbacks = self.settingsResponseCallbacks;
                    // Удаляем стек.
                    self.settingsResponseCallbacks = null;
                    // Кэшируем ответ.
                    self.settingsResponse = response;
                    if (callbacks && callbacks.length) {
                        // Вызываем обработчики.
                        _.each(callbacks, function (callback) {
                            callback(response);
                        });
                    }
                });
            }
            // Добавление обработчика в стек. Все обработчики из стека будут вызваны по получению ответа.
            this.settingsResponseCallbacks.push(callback);
        } else if (this.settingsResponse instanceof Service.Claims.GetSettings.Response) {
            // Если уже есть закэшированный ответ сервиса, то возвращаем его.
            callback(this.settingsResponse);
        }
    },

    /**
     * Получить идентификатор запроса.
     *
     * @public
     * @function
     * @name Popup.Card#getRequestId
     * @see Popup.Card#requestId
     * @type {String}
     */
    getRequestId : function () {
        'use strict';
        return this.requestId;
    },

    /**
     * Получить идентификатор туроператора.
     *
     * @public
     * @function
     * @name Popup.Card#getSourceId
     * @see Popup.Card#sourceId
     * @type {String}
     */
    getSourceId : function () {
        'use strict';
        return this.sourceId;
    },

    /**
     * Получить идентификатор страны назначения.
     *
     * @public
     * @function
     * @name Popup.Card#getCountryId
     * @see Popup.Card#countryId
     * @type {String}
     */
    getCountryId : function () {
        'use strict';
        return this.countryId;
    },

    /**
     * Получить идентификатор города вылета.
     *
     * @public
     * @function
     * @name Popup.Card#getTownFromId
     * @see Popup.Card#townFromId
     * @type {String}
     */
    getTownFromId : function () {
        'use strict';
        return this.townFromId;
    },

    /**
     * Получить идентификатор цены.
     *
     * @public
     * @function
     * @name Popup.Card#getOfferId
     * @see Popup.Card#offerId
     * @type {String}
     */
    getOfferId : function () {
        'use strict';
        return this.offerId;
    },

    /**
     * Получить значение идет ли запрос от сайта
     *
     * @public
     * @function
     * @name Popup.Card#getIsSiteRequest
     * @see Popup.Card#isSiteRequest
     * @type {String}
     */
    getIsSiteRequest : function () {
        'use strict';
        return this.isSiteRequest;
    },

    /**
     * Получить цену.
     *
     * @private
     * @field
     * @name Popup.Card#getPrice
     * @see Popup.Card#price
     * @type {String}
     */
    getPrice: function () {
        'use strict';
        return this.price;
    },

    /**
     * Получить количество ночей.
     *
     * @private
     * @field
     * @name Popup.Card#getNights
     * @see Popup.Card#nights
     * @type {String}
     */
    getNights: function () {
        'use strict';
        return this.nights;
    },

    /**
     * Получить количество взрослых мест.
     *
     * @private
     * @field
     * @name Popup.Card#getAdults
     * @see Popup.Card#adults
     * @type {Number}
     */
    getAdults: function () {
        'use strict';
        return this.adults;
    },

    /**
     * Получить количество детей.
     *
     * @private
     * @field
     * @name Popup.Card#getKids
     * @see Popup.Card#kids
     * @type {Number}
     */
    getKids: function () {
        'use strict';
        return this.kids;
    },

    /**
     * Получить массив возрастов детей.
     *
     * @private
     * @field
     * @name Popup.Card#getKidsAges
     * @see Popup.Card#kidsAges
     * @type {Array}
     */
    getKidsAges: function () {
        'use strict';
        return this.kidsAges;
    },

    /**
     * Получить отель.
     *
     * @private
     * @field
     * @name Popup.Card#getHotelId
     * @see Popup.Card#hotelId
     * @type {String}
     */
    getHotelId: function () {
        'use strict';
        return this.hotelId;
    },

    /**
     * Получить город (курорт).
     *
     * @private
     * @field
     * @name Popup.Card#getTownId
     * @see Popup.Card#townId
     * @type {String}
     */
    getTownId: function () {
        'use strict';
        return this.townId;
    },

    /**
     * Получить значение включен ли перелет.
     *
     * @private
     * @field
     * @name Popup.Card#getIsTicketsIncluded
     * @see Popup.Card#isTicketsIncluded
     * @type {String}
     */
    getIsTicketsIncluded: function () {
        'use strict';
        return this.isTicketsIncluded;
    },

    /**
     * Получить значение валюты.
     *
     * @private
     * @field
     * @name Popup.Card#getCurrency
     * @see Popup.Card#currency
     * @type {String}
     */
    getCurrency : function () {
        'use strict';
        return this.currency;
    },

    /**
     * Получить текущую вкладку.
     *
     * @public
     * @function
     * @name Popup.Card#getCurrentInset
     * @see Popup.Card#currentInset
     * @return {String|null}
     */
    getCurrentInset : function () {
        'use strict';
        return this.currentInset;
    },

    /**
     * Получить офисы турагенства.
     *
     * @public
     * @function
     * @name Popup.Card#getOffices
     * @see FrameElement#isDefaultsUseManyOffices
     * @param {Function} callback Обработчик запроса получения офисов.
     * @return {void}
     */
    getOffices : function (callback) {
        'use strict';
        var self    = this,
            offices = this.offices;
        if (offices !== null) {
            this.callAsync(function () {
                // Вызываем обработчик, если задан.
                if (typeof callback === 'function') {
                    callback.call(offices, offices);
                }
            });
        } else {
            this.$super(function (offices) {
                self.offices = offices;
                // Вызываем обработчик, если задан.
                if (typeof callback === 'function') {
                    callback.call(offices, offices);
                }
            });
        }
    },

    /**
     * Получить экземпляр класса полей бронирования.
     *
     * @public
     * @function
     * @name Popup.Card#getTourOrderForm
     * @return {FormNewConcept.TourOrder|null}
     */
    getTourOrderForm : function () {
        'use strict';
        return this.tourOrderForm;
    },

    /**
     * Получить форму заказа.
     *
     * @public
     * @function
     * @name Popup.Card#getClaimForm
     * @returns {Form.Claim|null}
     */
    getClaimForm : function () {
        'use strict';
        return this.claimForm;
    },

    /**
     * Признак того, что отзывы разрешены.
     *
     * @private
     * @function
     * @name Popup.Card#getIsReviewsAllowed
     * @return {Boolean}
     */
    getIsReviewsAllowed : function () {
        'use strict';
        var isReviewsAllowed = this.isReviewsAllowed;
        /*
         Пока не будет установлено это поле класса - обзоры разрешены.
         Оно будет установлено после первого запроса к сервису комментариев,
         если сервис запретит комментарии, то дальнейшие вызовы сервиса не будут производиться.
         */
        if (typeof isReviewsAllowed !== 'boolean') {
            return true;
        }
        return isReviewsAllowed;
    },

    /**
     * Установить признак того, что обзоры разрешены.
     *
     * @public
     * @function
     * @name Popup.Card#setReviewsAllowed
     * @param {Boolean} isReviewsAllowed Признак того, что обзоры разрешены, для установки.
     * @return {void}
     */
    setReviewsAllowed : function (isReviewsAllowed) {
        'use strict';
        if (isReviewsAllowed === undefined) {
            throw new ReferenceError('Нет параметра для установки значения признака, того, что есть лицензия на отзывы.');
        }
        if (typeof isReviewsAllowed !== 'boolean') {
            throw new TypeError('Параметр для установки значения признака, того, что есть лицензия на обзоры неправильного типа.');
        }
        this.isReviewsAllowed = isReviewsAllowed;
    },

    /**
     * Метод скрывающий таб с отзывами.
     *
     * @public
     * @function
     * @name Popup.Card#hideReviewsTab
     * @return {void}
     */
    hideReviewsTab : function (isReviewsAllowed) {
        'use strict';
        var container = this.getContainer();
        container.find('#menu-comments').parent().hide();
        // Проверяем, открыта ли сейчас вкладка отзывов и если да, то переключаемся на первую вкладку.
        if (container.find('#menu #content-comments').css('display') !== 'none') {
            container.find('[id^="menu-"]:first').click();
        }
    },

    /**
     * Получить признак того, что нужно использовать цену на человека при выводе.
     *
     * @public
     * @function
     * @name Popup.Card#isUsePricePersonForOutput
     * @returns {Boolean}
     */
    isUsePricePersonForOutput : function () {
        'use strict';
        // Для горящих туров всегда false.
        return (this.personsCount > 1 && !this.showcase) ? this.isDefaultsUsePricePerson() : false; // Если на одного человека, то выводим без цены на человека.
    },


    $static : {
        /**
         * Время отображения информации об успешной отправке заявки (создании заказа).
         *
         * @public
         * @constant
         * @name Popup.Card.TIME_OF_SUCCESS_MESSAGE
         * @type {Number|null}
         */
        TIME_OF_SUCCESS_MESSAGE : 5000,

        /**
         * Размер зума по умолчанию.
         *
         * @public
         * @constant
         * @name Popup.Card.DEFAULT_MAP_ZOOM
         * @type {Number|null}
         */
        DEFAULT_MAP_ZOOM : 15
    }
});