describe('Events', function () {
    var TestPage = function () {
        this.select = element(by.id('s2id_simpleSelect2'));
        this.chosen = element(by.css('.select2-chosen'));
        this.limit_button = element(by.css('#limit'));
        this.choose_button = element(by.css('#choose_4'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/events.html');
        };

        this.getChosenLabel = function () {
            return this.chosen.getText();
        };

        this.limitOptionsNumber = function (index) {
            this.limit_button.click();
        };

        this.chooseUnavailableOption = function (index) {
            this.choose_button.click();
        };

        this.get();
    };

    var page;
    beforeEach(function () {
        page = new TestPage();
    });

    it('Should not allow selection of unavailable options when using events', function () {
        page.limitOptionsNumber();
        page.chooseUnavailableOption();

        expect(page.getChosenLabel()).toEqual('');
    });
});

