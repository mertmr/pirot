import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class KisilerUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.kisiler.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kisiAdiInput: ElementFinder = element(by.css('input#kisiler-kisiAdi'));
  notlarInput: ElementFinder = element(by.css('input#kisiler-notlar'));
  tarihInput: ElementFinder = element(by.css('input#kisiler-tarih'));
  activeInput: ElementFinder = element(by.css('input#kisiler-active'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKisiAdiInput(kisiAdi) {
    await this.kisiAdiInput.sendKeys(kisiAdi);
  }

  async getKisiAdiInput() {
    return this.kisiAdiInput.getAttribute('value');
  }

  async setNotlarInput(notlar) {
    await this.notlarInput.sendKeys(notlar);
  }

  async getNotlarInput() {
    return this.notlarInput.getAttribute('value');
  }

  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
  }

  getActiveInput() {
    return this.activeInput;
  }
  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }

  getSaveButton() {
    return this.saveButton;
  }

  async enterData() {
    await waitUntilDisplayed(this.saveButton);
    await this.setKisiAdiInput('kisiAdi');
    expect(await this.getKisiAdiInput()).to.match(/kisiAdi/);
    await waitUntilDisplayed(this.saveButton);
    await this.setNotlarInput('notlar');
    expect(await this.getNotlarInput()).to.match(/notlar/);
    await waitUntilDisplayed(this.saveButton);
    await this.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getTarihInput()).to.contain('2001-01-01T02:30');
    await waitUntilDisplayed(this.saveButton);
    const selectedActive = await this.getActiveInput().isSelected();
    if (selectedActive) {
      await this.getActiveInput().click();
      expect(await this.getActiveInput().isSelected()).to.be.false;
    } else {
      await this.getActiveInput().click();
      expect(await this.getActiveInput().isSelected()).to.be.true;
    }
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
