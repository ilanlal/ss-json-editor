class test_RangeService {
    constructor() {
        this.rangeService = ServiceBuilder.newRangeService('TestSheet', 'A1:B2');

        QUnit.module("RangeService (services)");
        this.runTests();
        QUnit.done(() => {
            //this.tearDown();
        });
    }

    runTests() {

        QUnit.test("test Values (set, get)", (assert) => {
            const newValues = [[5, 6], [7, 8]];
            this.rangeService.setValues(newValues);
            const values = this.rangeService.getValues();
            assert.deepEqual(values, newValues, "Expected values to match");
        });

         QUnit.test("test focusRange", (assert) => {
            const a1Notation = "A1:B2";
            this.rangeService.focusRange(a1Notation);
            // Add assertions to verify the behavior
            const activeRange = this.rangeService.getActiveRange();
            assert.strictEqual(activeRange.getA1Notation(), a1Notation, "Expected active range to be focused on " + a1Notation);
        });


        QUnit.test("test BackgroundColor (set, get)", (assert) => {
            const a1Notation = "A1";
            const randomColor = "#" + Math.floor(Math.random()*16777215).toString(16);
            this.rangeService.setBackgroundColor(randomColor);
            // Add assertions to verify the behavior
            const color = this.rangeService.getBackgroundColor();
            assert.strictEqual(color, randomColor, "Expected background color to be " + randomColor);
        });

        QUnit.test("test alignLeft", (assert) => {
            const a1Notation = "A1:B2";
            this.rangeService.alignLeft();
            // Add assertions to verify the behavior
            const alignment = this.rangeService.getActiveRange().getHorizontalAlignment();
            assert.strictEqual(alignment, "left", "Expected horizontal alignment to be left");
        });
    }
}
