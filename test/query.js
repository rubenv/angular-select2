describe('Query', function () {
    var TestPage = function () {
        this.textInput = element(by.id('queryText'));
        this.select = element(by.id('s2id_querySelect2'));
        this.chosen = element(by.css('.select2-chosen'));
        this.search = element(by.css('.select2-input'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/query.html');
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

    it('Work with query values', function () {
        page.setInputValue('');
        page.select.click();
        page.search.sendKeys('T');
        page.search.sendKeys(protractor.Key.ENTER);
        expect(page.getInputValue()).toEqual('3');
    });
});
