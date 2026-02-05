require('..');
const { Addon } = require('../../src/Addon');

const controller = Addon.Settings.Controller;

describe('Addon.Settings.Controller', () => {
    beforeEach(() => {
        PropertiesService.getUserProperties().deleteAllProperties();
    });

    describe('Actions', () => {
        // Load test
        it('should handle Load', () => {
            // mock event parameters
            const e = { parameters: {} };
            const settingsCard = controller.Load(e);

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
});