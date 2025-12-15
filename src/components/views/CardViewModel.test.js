require('../../../tests');

const { EMD } = require('../../config/EMD');
const CardViewModel = require('./CardViewModel');

describe('CardViewModel', () => {
    const tests = [
        [EMD.Cards.Home, { isActive: true }],
        [EMD.Cards.Account, { isActive: true }],
        [EMD.Cards.Help, { isActive: true }],
    ];

    it('should create an view model instance.', () => {
        const viewModel = CardViewModel.create({
            cardService: CardService,
            activeSpreadsheet: SpreadsheetApp.getActiveSpreadsheet(),
            userProperties: PropertiesService.getDocumentProperties()
        });
        expect(viewModel).toBeDefined();
    });

    describe('Entity Metadata configuration', () => {
        tests.forEach((emd) => {
            describe(`Testing entity: ${emd[0].entityName}`, () => {
                it(`should create a card from the "${emd[0].entityName}" card method`, () => {
                    const cardWeapper = CardViewModel.CardServiceWrapper.create(
                        CardService,
                        PropertiesService.getDocumentProperties()
                    );

                    // if emd[0].card is function
                    if (!emd[0].card) return;
                    const cardBuilder = cardWeapper.newCardBuilder(
                        emd[0].card(emd[1]));

                    expect(cardBuilder).toBeDefined();
                    const builtCard = cardBuilder.build();
                    const data = builtCard.getData();
                    expect(data).toBeDefined();
                    expect(data.name).toBe(emd[0].card().name);
                    expect(data.header).toBeDefined();
                    expect(data.header.title).toBe(emd[0].card().header.title);
                    expect(data.header.subTitle).toBe(`${emd[0].card().header.subTitle}`);
                    expect(data.header.imageUrl).toBe(emd[0].card().header.imageUrl);
                    expect(data.header.imageStyle).toBe(emd[0].card().header.imageStyle);
                    expect(data.header.imageAltText).toBe(emd[0].card().header.imageAltText);
                    expect(data.sections).toBeDefined();
                    expect(data.sections.length).toBe(emd[0].card().sections.length);
                });
            });
        });
    });

});