/*jslint todo: true, sub: true */
/*global window, setTimeout, extend, Service, Popup, FrameElement, $, Query, ClaimActualizeProcess,
 roundPrice */

/**
 * Класс всплывающего окна выставления счета.
 *
 * @class
 * @name Popup.Claim
 * @extends Popup
 */
Popup.Claim = Popup.$extend({

    /**
     * Конструктор.
     *
     * @public
     * @function
     * @name Popup.Claim#$init
     * @param {FrameElement} parent Родительский элемент.
     * @param {UserEmitter} userEvents Объект пользовательских событий.
     * @return {void}
     */
    $init : function (parent, userEvents) {
        'use strict';
        var self        = this,
            template    = this.getTemplate(),
            options     = this.getOptions(),
            claimActualizeProcess =  ClaimActualizeProcess.$create(this.getClaimId()); // Ссылка на объект детальной актализации заказа.
        // Сохраняем родительский элемент.
        this.parent = parent;
        // Проверяем, что родительский элемент верного типа.
        if (!(parent instanceof FrameElement)) {
            throw new ReferenceError('Первый параметр (parent) не верного ' +
                'типа, ожидается экземпляр FrameElement.');
        }
        // Дополняем параметры конструктора.
        options.extend(parent.getOptions());
        options.setItem('content',
            template.fetch('claimLoader', {
                'claimId' : this.getClaimId()
            }));

        // Конструктор родительского класса.
        this.$super(options, function () {
            var document = $(self.getDocument());
            Service.Claims.GetClaimInfo
                .$create({})
                .call(self.getClaimId(), function (response) {
                    var tour        = response.getTour(),
                        message     = response.getMessage() ||
                            response.getServiceMessage(),
                        additional  = response.getAdditional(),
                        flightDefinition = response.getFlightList(),
                        paymentFailHandler = function (isPossibleToRepeat) {
                            // Получаем контейнер шапки карточки оплаты.
                            var claimHeader = self.getContainer().find('#claim-header'),
                                repeatPaymentElement;
                            // Формирование сообщения.
                            message = response.getServiceMessage();
                            // Выводим только если сообщение не пустое.
                            if (message) {
                                // Если шапка уже содержит ошибку, то прибавляем
                                // в начало содержащийся в шапку текст.
                                if (claimHeader.is('.error')) {
                                    message = claimHeader.text() + ' '
                                        + message;
                                }
                                // Помещаем результ-сообщение в шапку.
                                claimHeader.text(message).addClass('error');
                                // Добавляем информацию о возможности еще одной попытки.
                                if (isPossibleToRepeat) {
                                    repeatPaymentElement = $('<div/>').text('Пожалуйста, повторите попытку еще раз.');
                                    claimHeader.append(repeatPaymentElement);
                                }
                            }
                        },
                        flightSummaryInformation = [],
                        tourists    = [],
                        residencies = [],
                        VISAs = [],
                        options = [],
                        insurances = [],
                        flights = [],
                        transfers = [],
                        button;
                    if (response.isSuccess()) {
                        // Получаем список туристов для передачи в шаблон.
                        response.getTouristList().
                            forEach(function (element) {
                                tourists.push({
                                    'age'            : element.getAge(),
                                    'gender'         : element.getSex(),
                                    'id'             : element.getId(),
                                    'title'          : element.getTitle(),
                                    'citizenship'    : element.getCitizenship(),
                                    'cityName'       : element.getCityName(),
                                    'countryName'    : element.getCountryName(),
                                    'email'          : element.getEmail(),
                                    'firstName'      : element.getFirstName(),
                                    'passportNumber' : element.getPassportNumber(),
                                    'passportSeries' : element.getPassportSeries(),
                                    'patronymic'     : element.getPatronymic(),
                                    'phone'          : element.getPhone(),
                                    'surname'        : element.getSurname(),
                                    'birthday'       : element.getBirthday() && element.getBirthday().format('d.m.Y'),
                                    'issueDate'      : element.getIssueDate() && element.getIssueDate().format('d.m.Y'),
                                    'expires'        : element.getExpires() && element.getExpires().format('d.m.Y'),
                                    'issuedBy'       : element.getIssuedBy()
                                });
                            });
                        // Получаем список проживания для передачи в шаблон.
                        response.getResidenceList().
                            forEach(function (element) {
                                residencies.push({
                                    'checkIn'           : element.getCheckIn() && element.getCheckIn().format('d.m.Y'),
                                    'checkOut'          : element.getCheckOut() && element.getCheckOut().format('d.m.Y'),
                                    'comments'          : element.getComments(),
                                    'countryName'       : element.getCountryName(),
                                    'hotelName'         : element.getHotelName(),
                                    'placeName'         : element.getPlaceName(),
                                    'hotelStars'        : element.getHotelStars(),
                                    'hotelStarsInteger' : element.getHotelStarsInteger(),
                                    'identity'          : element.getIdentity(),
                                    'mealName'          : element.getMealName(),
                                    'resortName'        : element.getResortName(),
                                    'roomName'          : element.getRoomName()
                                });
                            });

                        response.getVISAList().forEach(function (element) {
                            VISAs.push({
                                'currency'  : element.getCurrency(),
                                'price'     : roundPrice(element.getPrice()),
                                'name'      : element.getName()
                            });
                        });
                        response.getOptionList().forEach(function (element) {
                            options.push({
                                'date'      :  element.getDate() && element.getDate().format('d.m.Y'),
                                'currency'  :  element.getCurrency(),
                                'name'      :  element.getName(),
                                'price'     :  roundPrice(element.getPrice())
                            });
                        });
                        flightDefinition.forEach(function (element) {
                            flights.push({
                                'arrivalAirport'                  : element.getArrivalAirport(),
                                'arrivalAirportIataCode'          : element.getArrivalAirportIataCode(),
                                'arrivalCity'                     : element.getArrivalCity(),
                                'aviaCompany'                     : element.getAviaCompany(),
                                'arrivalDate'                     : element.getArrivalDate() && element.getArrivalDate().format('d.m.Y'),
                                'arrivalTime'                     : element.getArrivalTime() && element.getArrivalTime().format('H:i'),
                                'board'                           : element.getBoard(),
                                'currency'                        : element.getCurrency(),
                                'departureAirport'                : element.getDepartureAirport(),
                                'departureAirportIataCode'        : element.getDepartureAirportIataCode(),
                                'departureCity'                   : element.getDepartureCity(),
                                'departureDate'                   : element.getDepartureDate() && element.getDepartureDate().format('d.m.Y'),
                                'departureTime'                   : element.getDepartureTime() && element.getDepartureTime().format('H:i'),
                                'duration'                        : element.getDuration(),
                                'flight'                          : element.getFlight(),
                                'price'                           : roundPrice(element.getPrice())
                            });
                        });
                        if (flightDefinition && flightDefinition.getBusinessClassSummaryPayment()) {
                            flightSummaryInformation.push({
                                'name'     : 'Доплата за бизнес-класс',
                                'currency' : flightDefinition.getBusinessClassPaymentCurrency(),
                                'price'    : roundPrice(flightDefinition.getBusinessClassSummaryPayment())
                            });
                        }
                        if (flightDefinition && flightDefinition.getTransportSummaryFee()) {
                            flightSummaryInformation.push({
                                'name'     : 'Транспортные расходы',
                                'currency' : flightDefinition.getTransportFeeCurrency(),
                                'price'    : roundPrice(flightDefinition.getTransportSummaryFee())
                            });
                        }
                        response.getInsuranceList().forEach(function (element) {
                            insurances.push({
                                'currency' : element.getCurrency(),
                                'name'     : element.getName(),
                                'price'    : roundPrice(element.getPrice())
                            });
                        });
                        response.getTransferList().forEach(function (element) {
                            transfers.push({
                                'airport'           : element.getAirport(),
                                'currency'          : element.getCurrency(),
                                'date'              : element.getDate() && element.getDate().format('d.m.Y'),
                                'time'              : element.getTime() && element.getTime().format('H:i'),
                                'hotel'             : element.getHotel(),
                                'price'             : roundPrice(element.getPrice()),
                                'isThere'           : element.isThere(),
                                'isBack'            : element.isBack(),
                                'transferType'      : element.getTransferType()
                            });
                        });
                        // Показываем фрейм.
                        self.show();
                        // Создаем контент выставления счета.
                        self.getContent().
                            html(template.fetch('invoice', {
                                'VISAs'                     : VISAs,
                                'options'                   : options,
                                'insurances'                : insurances,
                                'flights'                   : flights,
                                'transfers'                 : transfers,
                                'tourists'                  : tourists,
                                'residencies'               : residencies,
                                'flightSummaryInformation'  : flightSummaryInformation,
                                'status'                    : response.getStatus(),
                                'message'                   : response.getServiceMessage(),
                                'amount'                    : roundPrice(response.getAmount()),
                                'toPay'                     : roundPrice(response.getToPay()),
                                'isOutputAmountOnly'        : response.isOutputAmountOnly(),
                                'currency'                  : response.getCurrency(),
                                'comments'                  : response.getComments(),
                                'paymentUntil'              : response.getPaymentUntil() ? response.getPaymentUntil().format('d.m.Y H:i') : '',
                                'untilSuccess'              : response.getPaymentUntil() ? Number(response.getPaymentUntil().getDate()) > Number(new Date()) : true,
                                'number'                    : response.getNumber(),
                                'paymentUrl'                : response.getPaymentUrl(),
                                'additionalAvailable'       : response.isAdditionalAvailable(),
                                'isPaid'                    : response.isPaid(),
                                'additional'   : { // Дополнительный платеж.
                                    'amount'                : roundPrice(additional.getAmount()),
                                    'currency'              : additional.getCurrency(),
                                    'description'           : additional.getDescription(),
                                    'number'                : additional.getNumber(),
                                    'paymentUntil'          : additional.getPaymentUntil() ? additional.getPaymentUntil().format('d.m.Y H:i') : '',
                                    'untilSuccess'          : additional.getPaymentUntil() ? Number(additional.getPaymentUntil().getDate()) > Number(new Date()) : true,
                                    'paymentAvailable'      : additional.isPaymentAvailable(),
                                    'status'                : additional.getStatus(),
                                    'isPaid'                : additional.isPaid()
                                },
                                'tour'         : { // Информация по туру.
                                    'countryId'             : tour.getCountryId(),
                                    'countryName'           : tour.getCountryName(),
                                    'sourceId'              : tour.getSourceId(),
                                    'sourceName'            : tour.getSourceName(),
                                    'identity'              : tour.getIdentity(),
                                    'nights'                : tour.getNights(),
                                    'price'                 : roundPrice(tour.getPrice()),
                                    'currency'              : tour.getCurrency(),
                                    'departCityName'        : tour.getDepartureCityName(),
                                    'resort'                : tour.getResort(),
                                    'tourName'              : tour.getTourName(),
                                    'checkIn'               : tour.getCheckIn().format('d.m.y'),
                                    'checkOut'              : tour.getCheckOut().format('d.m.y')
                                }
                            }));
                        // Показываем саму карточку.
                        self.getContainer().css('opacity', 1);

                        // После получения информации и показа её на странице
                        // обновляем состояние заказа, и только после этого
                        // открываем счет к оплате.

                        button = self.getContainer().find('#success');
                        if (self.isError()) {
                            // Если ошибка работы сервиса.
                            if (self.getReasonNumber() !== 0) {
                                // Показываем сообщение об ошибке в
                                // заголовке всплывающего окна.
                                self.getContainer().find('#claim-header').
                                    html(self.getReasonMessage()).addClass('error');
                            } else {
                                // На практике возможна ситуация, когда в sl_reason нет причины ошибки.
                                // Пытаюсь получить сервисное сообщение или сообщение об ошибке.
                                message = response.getServiceMessage() || response.getMessage();
                                // Показываем поясняющее сообщение заголовке всплывающего окна.
                                self.getContainer().find('#claim-header').html(message).addClass('error');
                            }
                            // Снимаем с кнопки признак загрузки.
                            button.removeClass('loader');
                        // Реагируем на истекший "срок годности" текущего счета, если это не прямая авторизация.
                        } else if (response.getPaymentUntil() && response.getPaymentUntil().getDate() < new Date()) {
                            message = 'Срок действия данного счета истек.';
                            self.getContainer().find('#claim-header').html(message).addClass('error');
                            button.removeClass('loader');
                        } else if (response.isPaymentAvailable() || response.isAdditionalAvailable() ||
                                // Если требуется актуализация - продолжаем.
                                (!response.isPaymentAvailable() && response.getActualization())) {
                            // Если прошлая попытка не прошла - показываем сообщение с ошибкой по предыдущему платежу.
                            if (response.isPaymentFail() || additional.isPaymentFail()) {
                                paymentFailHandler(true);
                            }
                            Service.Claims.UpdateClaim
                                .$create({})
                                .call(self.getClaimId(), function (updateResponse) {
                                    var element     = self.getContainer().find('#error-message'),
                                        loadTitle   = self.getContainer().find('#claim-actualization-title'),
                                        message     = updateResponse.getMessage() ||
                                            'Неопределенная ошибка обновления заказа.';
                                    if (updateResponse.isError() || updateResponse.isOperationFailure()) {
                                        // Показываем сообщение ощибки, что статус
                                        // заказа обновить не получилось и при этом
                                        // показываем максимально подробное сообщение.
                                        element.html(template.fetch('list', {
                                            'list' : message.split(/\s*[\r\n\u21B5]+\s*/)
                                        })).show();
                                    } else if (response.isPaid() && (response.isAdditionalAvailable() ? additional.isPaid() : true)) {
                                        // Если доплата оплачена, то просто снимаем с кнопки лоадер,
                                        // но не делаем ее доступной для перехода
                                        // Снимаем с кнопки признак загрузки.
                                        button.removeClass('loader');
                                        // Все хорошо, мы запускаем актуализацию и по ее результатам разрешаем дальнейший переход к оплате.
                                    } else {
                                        // Требуется актуализация
                                        if (response.getActualization()) {
                                            loadTitle.show();
                                            claimActualizeProcess.bind('complete', function (event) {
                                                // Обновляем страницу, т.к. актуализация закончена и нам нужноп оказать полные данные по туру.
                                                window.location.reload();
                                            });
                                            claimActualizeProcess.bind('timeout', function (event) {
                                                message = 'Превышено время ожидания. Попробуйте обновить страницу, чтобы повторить уточнение данных по заказу.';
                                                element.html(template.fetch('list', {
                                                    'list' : message.split(/\s*[\r\n\u21B5]+\s*/)
                                                })).show();
                                                // Снимаем с кнопки признак загрузки.
                                                button.removeClass('loader');
                                                loadTitle.hide();
                                            });
                                            claimActualizeProcess.bind('hasStops', function (event) {
                                                // Запрашиваем свежую информацию о платеже.
                                                Service.Claims.GetClaimInfo
                                                    .create({})
                                                    .call(self.getClaimId(), function (hasStopClaimInfoResponse) {
                                                        var isPaymentAvailable = hasStopClaimInfoResponse.isPaymentAvailable(),
                                                            isPaid             = hasStopClaimInfoResponse.isPaid();
                                                        /*
                                                            Если не оплачено и недоступно для оплаты, т.е. оплата заблокирована по причине наличия стопов,
                                                            то выводим сообщение о ошибке.
                                                        */
                                                        if (!isPaid && !isPaymentAvailable) {
                                                            message = 'Есть стопы.';
                                                            // Определяем что за стоп и формируем соответствующее сообщение.
                                                            (function () {
                                                                var actualization = event['data'].getActualization();
                                                                if (actualization.isIncorrectCurrency()) {
                                                                    message = 'К сожалению, не удалось получить точную цену в российских рублях.';
                                                                } else if (actualization.isHotelInStop()) {
                                                                    message = 'К сожалению, в этом отеле нет свободных мест.';
                                                                } else if (actualization.isDepartureFlightInStop()) {
                                                                    message = 'К сожалению, на перелет в направлении тура билетов нет.';
                                                                } else if (actualization.isReturnFlightInStop()) {
                                                                    message = 'К сожалению, на перелет обратно закончились билеты.';
                                                                } else {
                                                                    message = 'К сожалению, получить точные данные по туру не удалось.';
                                                                }
                                                            }());
                                                            // Отображаем сообщение.
                                                            element.html(template.fetch('list', {
                                                                'list' : message.split(/\s*[\r\n\u21B5]+\s*/)
                                                            })).show();
                                                        }
                                                        // Если оплата доступна, то снимаем блокировку с кнопки.
                                                        if (isPaymentAvailable) {
                                                            button.removeClass('locked loader');
                                                        } else {
                                                            // Снимаем с кнопки признак загрузки. // Кнопка остается заблокированной.
                                                            button.removeClass('loader');
                                                        }
                                                        loadTitle.hide();
                                                    });
                                            });
                                            claimActualizeProcess.bind('hasErrors', function (event) {
                                                message = 'К сожалению, произошла внутренняя ошибка. Попробуйте обновить страницу, чтобы повторить уточнение данных по заказу.';
                                                element.html(template.fetch('list', {
                                                    'list' : message.split(/\s*[\r\n\u21B5]+\s*/)
                                                })).show();
                                                // Снимаем с кнопки признак загрузки.
                                                button.removeClass('loader');
                                                loadTitle.hide();
                                            });
                                            // Если нет возможности пройти к оплате - запускаем процесс опроса сервера.
                                            if (!response.getActualization().isPossibleToPay()) {
                                                claimActualizeProcess.start();
                                            // В случае, только если разрешён платёж делаем кнопку активной.
                                            } else if (response.isPaymentAvailable()) {
                                                // Обновляем кнопку перехода к оплате.
                                                button.removeClass('locked loader').
                                                    attr('href', button.attr('data-href'));
                                                loadTitle.hide();
                                            } else {
                                                // Оставляем неактивной.
                                                button.removeClass('loader');
                                                loadTitle.hide();
                                            }
                                        // Не требуется актуализация.
                                        } else {
                                            if (response.isPaymentAvailable()) {
                                                // Обновляем кнопку перехода к оплате.
                                                button.removeClass('locked loader').
                                                    attr('href', button.attr('data-href'));
                                                loadTitle.hide();
                                            } else {
                                                // Оставляем неактивной.
                                                button.removeClass('loader');
                                                loadTitle.hide();
                                            }
                                        }
                                    }
                                });
                        } else {
                            if (response.isPaymentFail() || additional.isPaymentFail()) {
                                // Если имеем неудачный платёж по дополнительной оплате или полной оплате,
                                // то выводим сервисное сообщение об ошибке в шапку шаблона карточки оплаты.
                                paymentFailHandler();
                            // Если это не ошибка и не доплата, но платеж при этом не доступен
                            // Проверяем, что счет не оплачен и формируем сервисное сообщение
                            } else if (!response.isPaid()) {
                                // Пытаемся получить сервисное сообщение, если его нет - Неизвестная ошибка.
                                message = response.getServiceMessage() || response.getMessage();
                                // Показываем поясняющее сообщение заголовке всплывающего окна.
                                self.getContainer().find('#claim-header').html(message).addClass('error');
                            }
                            // Снимаем с кнопки признак загрузки.
                            button.removeClass('loader');
                        }
                    } else {
                        // Если произошла ошибка, то показываем её в явном виде,
                        // так, чтобы пользователь видел, ничего не вводило его
                        // в заблуждение и по этому вопросу был сапорт.
                        if (!message) {
                            // Если текста сообщения так и нет.
                            message = 'Неизвестная ошибка.';
                        }
                        // Разбираем сообщение на строки.
                        message = message.split(/\s*[\r\n\u21B5]+\s*/);
                        // Показываем возникшую ошибку.
                        self.getContent().
                            html(template.fetch('invoiceError', {
                                'message' : message
                            }));
                    }
                });
            // Подписываемся на клики кнопки отмены.
            document.bind('click', function (event) {
                var target = $(event.target),
                    parents = target.parents();
                self.callAsync(function () {
                    if (target.is('a.cancel') || parents.is('a.cancel')) {
                        // Останавливаем процесс детальной актуализации.
                        if (claimActualizeProcess) {
                            claimActualizeProcess.stop();
                        }
                        // Закрываем всплывающее окно,
                        // если нажата кнопка отмены.
                        self.destroy();
                    } else if (target.is('a.popup-close') || target.is('body')) {
                        // Останавливаем процесс детальной актуализации.
                        if (claimActualizeProcess) {
                            claimActualizeProcess.stop();
                        }
                    }
                });
            });
        });
        // При закрытии всплывющего окна обязательно
        // необходимо подтирать переменную claimid.
        this.bind('destroy', function () {
            // Удаляем платежные переменные.
            window.location = self.getLocation(window.location, {
                'claimid'   : null,
                'sl_error'  : null,
                'sl_reason' : null
            });
        });
        // Пользовательское событие на открытие формы оплаты счета.
        userEvents.emit('claimCard');
    },

    /**
     * Получить элемент контента.
     *
     * @public
     * @function
     * @name Popup.Claim#getContent
     * @return {jQuery}
     */
    getContent : function () {
        'use strict';
        return this.getContainer().find('#content');
    },

    /**
     * Признак ошибки переданный в запросе.
     *
     * @public
     * @function
     * @name Popup.Claim#isError
     * @return {Boolean}
     */
    isError : function () {
        'use strict';
        return !!parseInt(Query.$create().getItem('slError', '0'), 10);
    },

    /**
     * Получить номер объяснения ошибки.
     *
     * @public
     * @function
     * @name Popup.Claim#getReasonNumber
     * @return {Number}
     */
    getReasonNumber : function () {
        'use strict';
        return parseInt(Query.$create().getItem('slReason', '0'), 10) || 0;
    },

    /**
     * Причина ошибки переданная в запросе.
     *
     * @public
     * @function
     * @name Popup.Claim#getReasonMessage
     * @return {String}
     */
    getReasonMessage : function () {
        'use strict';
        var message = 'Причина неудачной попытки редиректа на платежную страницу неизвестна.',
            reason = this.getReasonNumber();
        if (reason === 1) {
            message = 'Попытка повторной оплаты выставленного счета.';
        } else if (reason === 2) {
            message = 'Попытка оплатить заказ была отклонена. Данный заказ мог ' +
                'быть оплачен до &laquo;Дата действия выставленного счета&raquo;. ' +
                'Обратитесь к менеджеру турагенства для получения подробностей и ' +
                'решения проблемы';
        }
        return message;
    }

});