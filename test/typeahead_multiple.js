describe('Typeahead (multiple)', function () {
    var TestPage = function () {
        this.textInput = element(by.id('multipleText'));
        this.select = element(by.id('s2id_multipleSelect2'));
        this.search = element(by.css('.select2-input'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/multiple.html');
        };

        this.getInputValue = function () {
            return this.textInput.getAttribute('value');
        };

        this.setInputValue = function (value) {
            this.textInput.clear();
            this.textInput.sendKeys(value);
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
            expect(arr.length).toEqual(2);
            page.search.sendKeys('w');
            browser.findElements(by.css('.select2-result')).then(function (arr) {
                expect(arr.length).toEqual(1);
                page.search.sendKeys(protractor.Key.BACK_SPACE);
                browser.findElements(by.css('.select2-result')).then(function (arr) {
                    expect(arr.length).toEqual(2);
                });
            });
        });
    });

    it('Should filter typeahead (case insensitive)', function () {
        page.setInputValue('');
        page.select.click();
        page.search.sendKeys('t');
        browser.findElements(by.css('.select2-result')).then(function (arr) {
            expect(arr.length).toEqual(2);
            page.search.sendKeys('w');
            browser.findElements(by.css('.select2-result')).then(function (arr) {
                expect(arr.length).toEqual(1);
                page.search.sendKeys(protractor.Key.BACK_SPACE);
                browser.findElements(by.css('.select2-result')).then(function (arr) {
                    expect(arr.length).toEqual(2);
                });
            });
        });
    });
});

