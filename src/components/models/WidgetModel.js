class WidgetModel {
    static get INVALID_ID_ERROR() {
        return 'Widget id is required';
    }

    static tabIndex() {
        if (!this._tabIndex) {
            this._tabIndex = 0;
        }
        return this._tabIndex++;
    }

    static create(widgetMeta = {}, userProperties = PropertiesService.getDocumentProperties()) {
        const { id, value = null, tabIndex = WidgetModel.tabIndex(), propertyName = null } = widgetMeta;

        if (!id) {
            throw new Error(WidgetModel.INVALID_ID_ERROR);
        }

        const widgetInstance = new WidgetModel(id, userProperties)
            .setTabIndex(tabIndex);

        if (value) {
            widgetInstance.setValue(value);
        }

        if (propertyName) {
            widgetInstance.setPropertyName(propertyName);
            const value = userProperties.getProperty(propertyName);
            if (value !== null) {
                widgetInstance.setValue(value);
            }
        }
        return widgetInstance;
    }

    constructor(id, userProperty) {
        this._id = id;
        this._userProperty = userProperty;
        this._value = null;
        this._tabIndex = 0;
        this._propertyName = null;
    }

    /// Setters
    setValue(value) {
        this._value = value;
        return this;
    }

    setTabIndex(tabIndex) {
        this._tabIndex = tabIndex;
        return this;
    }

    setPropertyName(name) {
        this._propertyName = name;
        return this;
    }

    /// Getters
    get id() {
        return this._id;
    }

    get value() {
        return this._value;
    }

    get tabIndex() {
        return this._tabIndex;
    }

    get propertyName() {
        return this._propertyName;
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        WidgetModel
    };
}