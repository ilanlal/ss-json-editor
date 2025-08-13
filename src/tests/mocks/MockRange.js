class MockRange {
    constructor() {
        this.a1Notation = "";
        this.values = [];
    }

    getA1Notation() {
        return this.a1Notation;
    }

    setA1Notation(a1Notation) {
        this.a1Notation = a1Notation;
    }

    getValues() {
        return this.values;
    }

    setValues(values) {
        this.values = values;
    }

    getCell(row, column) {
        return {
            getValue: () => this.values[row][column],
            setValue: (newValue) => {
                this.values[row][column] = newValue;
            },
            getA1Notation: () => `A${row + 1}:${String.fromCharCode(65 + column)}${row + 1}`
        }
    }
}

class MockRangeBuilder {
    constructor() {
        this.a1Notation = "";
        this.values = [];
    }

    static newMockRange() {
        return new MockRangeBuilder();
    }

    withA1Notation(a1Notation) {
        this.a1Notation = a1Notation;
        return this;
    }

    withValues(values) {
        this.values = values;
        return this;
    }

    build() {
        const mockRange = new MockRange();
        mockRange.setA1Notation(this.a1Notation);
        mockRange.setValues(this.values);
        return mockRange;
    }
}
