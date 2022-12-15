const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Events", function () {
    let deployer, user;
    let noEvents, events;
    beforeEach(async function () {
        [deployer, user] = await ethers.getSigners();

        const NoEventsFactory = await ethers.getContractFactory('NoEventsMarketplace', deployer);
        noEvents = await NoEventsFactory.deploy()

        const EventsFactory = await ethers.getContractFactory('MarketplaceWithEvents', deployer);
        events = await EventsFactory.deploy()

    });
    it('Should cost less gas to transact from a marketplace with events instead of one without', async function () {
        let receipt, percDiff

        receipt = await (await noEvents.makeItem(noEvents.address, 1, 100)).wait()
        const gasUsedNoEventsMake = receipt.gasUsed
        receipt = await (await events.makeItem(noEvents.address, 1, 100)).wait()
        const gasUsedEventsMake = receipt.gasUsed

        receipt = await (await noEvents.buyItem(1)).wait()
        const gasUsedNoEventsBuy = receipt.gasUsed
        receipt = await (await events.buyItem(1)).wait()
        const gasUsedEventsBuy = receipt.gasUsed

        expect(gasUsedNoEventsMake).to.be.gt(gasUsedEventsMake)
        expect(gasUsedNoEventsBuy).to.be.gt(gasUsedEventsBuy)

        percDiff = Math.round(((gasUsedNoEventsMake/gasUsedEventsMake) - 1)*100)
        console.log(`Gas cost to make item:`, `No Events ${gasUsedNoEventsMake}, `, `Events ${gasUsedEventsMake} (${percDiff}% more gas efficient)`)
        percDiff = Math.round(((gasUsedNoEventsBuy/gasUsedEventsBuy) - 1)*100)
        console.log(`Gas cost to buy item:`, `No Events ${gasUsedNoEventsBuy}, `, `Events ${gasUsedEventsBuy} (${percDiff}% more gas efficient)`)
    });

});
