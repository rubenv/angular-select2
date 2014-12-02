describe('Init', function () {
    var TestPage = function () {
        this.select = element(by.id('s2id_querySelect2'));
        this.chosen = element(by.css('.select2-chosen'));
        this.search = element(by.css('.select2-input'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/init.html');
        };

        this.getInputValue = function () {
            return this.textInput.getAttribute('value');
        };

        this.setInputValue = function (value) {
            this.textInput.clear();
            this.textInput.sendKeys(value);
        };

        this.getChosenLabel = function () {
            return this.chosen.getText();
        };

        this.selectValue = function (index) {
            this.select.click();
            element(by.css('.select2-result:nth-child(' + index + ')')).click();
        };

        this.get();
    };

    var page;
    beforeEach(function () {
        page = new TestPage();
    });

    it('Will show an initialized value', function () {
        expect(page.getChosenLabel().getText()).toEqual('INIT');
    });
});
