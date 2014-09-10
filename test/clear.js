describe('Clear', function () {
    var TestPage = function () {
        this.textInput = element(by.id('simpleText'));
        this.select = element(by.id('s2id_simpleSelect2'));
        this.chosen = element(by.css('.select2-chosen'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/clear.html');
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

        this.clearValue = function () {
            element.all(by.css('.select2-search-choice-close')).get(0).click();
        };

        this.get();
    };

    var page;
    beforeEach(function () {
        page = new TestPage();
    });

    it('Should allow clear', function () {
        page.selectValue(2);
        expect(page.getInputValue()).toEqual('2');
        expect(page.getChosenLabel()).toEqual('Two');

        page.clearValue();
        expect(page.getInputValue()).toEqual('');
        expect(page.getChosenLabel()).toEqual('None');
    });
});

