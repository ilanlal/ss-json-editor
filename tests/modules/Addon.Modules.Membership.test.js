require('..');
const { Addon } = require('../../src/Addon');

describe('Addon.Modules.Membership', () => {
    const MDL = Addon.Modules;
    const Membership = MDL.Membership;
    beforeEach(() => {
        PropertiesService.getScriptProperties().deleteAllProperties();
    });

    // createMembershipInfo test
    it('should create membership info object with correct properties', () => {
        const membershipInfo = Membership.createMembershipInfo();
        expect(membershipInfo).toBeDefined();

        // licenseKey should be 'TRIAL' by default
        expect(membershipInfo.licenseKey).toBe(Membership.DEFAULT_LICENSE_KEY);
        // expiresAt should be a valid ISO date string in the future
        expect(new Date(membershipInfo.expiresAt).getTime()).toBeGreaterThan(Date.now());
        // createdOn should be a valid ISO date string in the past
        expect(new Date(membershipInfo.createdOn).getTime()).toBeLessThanOrEqual(Date.now());
        // balance should be 0 by default
        expect(membershipInfo.balance).toBe(Membership.DEFAULT_TRIAL_BALANCE);

        // create with custom values
        const customMembershipInfo = Membership.createMembershipInfo(10, 50, 'CUSTOM_KEY');
        expect(customMembershipInfo.licenseKey).toBe('CUSTOM_KEY');
        expect(new Date(customMembershipInfo.expiresAt).getTime()).toBeGreaterThan(Date.now() + 9 * 24 * 60 * 60 * 1000);
        expect(new Date(customMembershipInfo.createdOn).getTime()).toBeLessThanOrEqual(Date.now());
        expect(customMembershipInfo.balance).toBe(50);
    });

    // setMembershipInfo & getMembershipInfo test
    it('should set and get membership info correctly', () => {
        const membershipInfo = Membership.createMembershipInfo();
        const setResult = Membership.setMembershipInfo(membershipInfo);
        expect(setResult).toBeDefined();

        // Verify that the membership info was set correctly
        const retrievedMembershipInfo = Membership.getMembershipInfo();
        expect(retrievedMembershipInfo).toEqual(membershipInfo);
        //quick check for properties
        expect(retrievedMembershipInfo.licenseKey).toBe(membershipInfo.licenseKey);
        expect(retrievedMembershipInfo.expiresAt).toBe(membershipInfo.expiresAt);
        expect(retrievedMembershipInfo.createdOn).toBe(membershipInfo.createdOn);
        expect(retrievedMembershipInfo.balance).toBe(membershipInfo.balance);
    });

    // activate test
    it('should activate membership and set properties', () => {
        const activateResult = Membership.activate(10, 100, 'TEST_LICENSE_KEY');

        // licenseKey should be 'TEST_LICENSE_KEY' for trial activation
        expect(activateResult.licenseKey).toBe('TEST_LICENSE_KEY');
        // expiresAt should be approximately 10 days in the future
        expect(new Date(activateResult.createdOn).getTime()).toBeLessThanOrEqual(Date.now());
        expect(new Date(activateResult.expiresAt).getTime()).toBeGreaterThan(Date.now() + 9 * 24 * 60 * 60 * 1000);
        // createdOn should be a valid ISO date string in the past
        expect(new Date(activateResult.createdOn).getTime()).toBeLessThanOrEqual(Date.now());

        // Verify that the membership info was set correctly
        const retrievedMembershipInfo = Membership.getMembershipInfo();
        expect(retrievedMembershipInfo).toBeDefined();
        // licenseKey should be 'TEST_LICENSE_KEY' for trial activation
        expect(retrievedMembershipInfo.licenseKey).toBe('TEST_LICENSE_KEY');
        // expiresAt should be approximately 10 days in the future
        expect(new Date(retrievedMembershipInfo.createdOn).getTime()).toBeLessThanOrEqual(Date.now());
        expect(new Date(retrievedMembershipInfo.expiresAt).getTime()).toBeGreaterThan(Date.now() + 9 * 24 * 60 * 60 * 1000);
        // createdOn should be a valid ISO date string in the past
        expect(new Date(retrievedMembershipInfo.createdOn).getTime()).toBeLessThanOrEqual(Date.now());
        // balance should be 100 for trial activation
        expect(retrievedMembershipInfo.balance).toBe(100);
    });

    // revoke test
    it('should revoke membership and clear properties', () => {
        const revokeResult = Membership.revoke();
        expect(revokeResult).toBe(true);

        const retrievedMembershipInfo = Membership.getMembershipInfo();
        expect(retrievedMembershipInfo).toBeNull();
    });
});

