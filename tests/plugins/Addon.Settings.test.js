require('..');
const { Addon } = require('../../src/Addon');

const controller = Addon.Settings.Controller;
const view = Addon.Settings.View;

describe('Addon.Settings', () => {
    beforeEach(() => {
        PropertiesService.getUserProperties().deleteAllProperties();
    });

    describe('Controller', () => {
        // Load test
        it('should handle Load', () => {
            // mock event parameters
            const e = { parameters: {} };
            const settingsCard = controller.PushHomeCard(e);

            expect(settingsCard).toBeDefined();
            const cardData = settingsCard.getData();
            expect(cardData).toBeDefined();
            // no notification
            expect(cardData.notification).toBeUndefined();
        });

        // Save test
        it('should handle Save', () => {
            // mock event parameters
            const e = {
                commonEventObject: {
                    formInputs: {
                        [Addon.INPUT_PARAMETERS.indentation_spaces]: {
                            stringInputs: {
                                value: ['4']
                            }
                        },
                        [Addon.INPUT_PARAMETERS.show_errors_switch]: {
                            stringInputs: {
                                value: ['ON']
                            }
                        }
                    }
                }
            };
            const settingsCard = controller.SaveSettings(e);

            expect(settingsCard).toBeDefined();
            const cardData = settingsCard.getData();
            expect(cardData).toBeDefined();

            // no notification
            expect(cardData.notification).toBeUndefined();

            // verify properties were saved
            const userProperties = PropertiesService.getUserProperties();
            expect(userProperties.getProperty(Addon.INPUT_PARAMETERS.indentation_spaces)).toBe('4');
            expect(userProperties.getProperty(Addon.INPUT_PARAMETERS.show_errors_switch)).toBe('ON');
        });


    });

    describe('View', () => {
        // Home card test
        it('should build Settings Card', () => {
            const data = Addon.Modules.App.getData();
            const settingsCard = view.HomeCard(data);
            expect(settingsCard).toBeDefined();
            const cardData = settingsCard.getData();
            expect(cardData).toBeDefined();
            expect(cardData.name).toBe(Addon.Settings.name + '-Home');
        });
    });
});

