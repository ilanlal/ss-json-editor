require('../../../tests');
const { WidgetModel } = require('./WidgetModel');

describe('Widget', () => {
    test('should initialize with user property value', () => {
        const propertyName = 'testUserProperty';
        const storedValue = '00012345';
        global.PropertiesService
            .getUserProperties()
            .setProperty(propertyName, storedValue);
            
        const widgetObject = {
            id: 'testId',
            propertyName,
            TextInput: {
                fieldName: 'txt_' + propertyName,
                title: 'Test Title',
                hint: 'Test Hint'
            }
        };

        const widgetModel = WidgetModel
            .create(
                widgetObject,
                global.PropertiesService.getDocumentProperties()
            );
        expect(widgetModel.id).toBe(widgetObject.id);
        expect(widgetModel.value).toBe(storedValue);
        expect(widgetModel.tabIndex).toBe(0);
    });

    test('should initialize with default values', () => {
        const widgetObject = {
            id: 'testId',
            TextInput: {
                fieldName: 'testFieldName',
                title: 'Test Title',
                hint: 'Test Hint'
            },
            value: 'Should not be overridden'
        };

        const widgetModel = WidgetModel.create(widgetObject, global.PropertiesService.getDocumentProperties());
        expect(widgetModel.id).toBe(widgetObject.id);
        expect(widgetModel.value).toBe('Should not be overridden');
        expect(widgetModel.tabIndex).toBe(1);
    });

    test('should throw error if id is missing', () => {
        expect(() => WidgetModel.create({
            // missing id
            DecoratedText: {
                text: 'Sample Text',
                topLabel: 'Top Label',
            },
            value: 'Sample Value'
        }))
            .toThrow(WidgetModel.INVALID_ID_ERROR);
    });

});