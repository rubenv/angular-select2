describe('Simple', function () {
    var TestPage = function () {
        this.select = element(by.id('s2id_simpleSelect2'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/close.html');
        };

        this.openSelect = function () {
            this.select.click();
        };

        this.closeAll = function () {
            return browser.executeAsyncScript(function (callback) {
                var select2Stack = angular.element('body').injector().get('select2Stack');
                select2Stack.closeAll();
                callback();
            });
        };

        this.get();
    };

    var page;
    beforeEach(function () {
        page = new TestPage();
    });

    it('Should close with closeAll', function () {
        page.openSelect();
        browser.findElements(by.css('.select2-result')).then(function (arr) {
            expect(arr.length).toEqual(2);
        });
        page.closeAll();
        browser.findElements(by.css('.select2-result')).then(function (arr) {
            expect(arr.length).toEqual(0);
        });
    });

});
