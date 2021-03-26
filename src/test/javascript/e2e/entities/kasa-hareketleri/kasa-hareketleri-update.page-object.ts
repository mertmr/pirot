import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class KasaHareketleriUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.kasaHareketleri.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  kasaMiktarInput: ElementFinder = element(by.css('input#kasa-hareketleri-kasaMiktar'));
  hareketInput: ElementFinder = element(by.css('input#kasa-hareketleri-hareket'));
  tarihInput: ElementFinder = element(by.css('input#kasa-hareketleri-tarih'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setKasaMiktarInput(kasaMiktar) {
    await this.kasaMiktarInput.sendKeys(kasaMiktar);
  }

  async getKasaMiktarInput() {
    return this.kasaMiktarInput.getAttribute('value');
  }

  async setHareketInput(hareket) {
    await this.hareketInput.sendKeys(hareket);
  }

  async getHareketInput() {
    return this.hareketInput.getAttribute('value');
  }

  async setTarihInput(tarih) {
    await this.tarihInput.sendKeys(tarih);
  }

  async getTarihInput() {
    return this.tarihInput.getAttribute('value');
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
    await this.setKasaMiktarInput('5');
    expect(await this.getKasaMiktarInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setHareketInput('hareket');
    expect(await this.getHareketInput()).to.match(/hareket/);
    await waitUntilDisplayed(this.saveButton);
    await this.setTarihInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getTarihInput()).to.contain('2001-01-01T02:30');
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
