describe('Simple', function () {
    var TestPage = function () {
        this.textInput = element(by.id('simpleText'));
        this.chosen = element(by.css('.select2-chosen'));

        this.get = function () {
            browser.get('http://localhost:9000/test/fixtures/');
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

        this.get();
    };

    var page;
    beforeEach(function () {
        page = new TestPage();
    });

    it('Should show selected value', function () {
        expect(page.getInputValue()).toEqual('1');
        expect(page.getChosenLabel()).toEqual('One');
    });

    it('Should switch value', function () {
        page.setInputValue('2');
        expect(page.getChosenLabel()).toEqual('Two');
    });
});
