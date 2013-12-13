describe('Typeahead', function () {
    var TestPage = function () {
        this.textInput = element(by.id('simpleText'));
        this.select = element(by.id('s2id_simpleSelect2'));
        this.chosen = element(by.css('.select2-chosen'));
        this.search = element(by.css('.select2-input'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/simple.html');
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

    it('Should filter typeahead', function () {
        page.setInputValue('');
        page.select.click();
        page.search.sendKeys('T');
        browser.findElements(by.css('.select2-result')).then(function (arr) {
            expect(arr.length).toEqual(1);
        });
    });

    it('Should filter typeahead (case insensitive)', function () {
        page.setInputValue('');
        page.select.click();
        page.search.sendKeys('t');
        browser.findElements(by.css('.select2-result')).then(function (arr) {
            expect(arr.length).toEqual(1);
        });
    });
});
