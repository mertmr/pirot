import { element, by, ElementFinder, protractor } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class UreticiOdemeleriUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.ureticiOdemeleri.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  tutarInput: ElementFinder = element(by.css('input#uretici-odemeleri-tutar'));
  sonGuncellenmeTarihiInput: ElementFinder = element(by.css('input#uretici-odemeleri-sonGuncellenmeTarihi'));
  ureticiSelect: ElementFinder = element(by.css('select#uretici-odemeleri-uretici'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setTutarInput(tutar) {
    await this.tutarInput.sendKeys(tutar);
  }

  async getTutarInput() {
    return this.tutarInput.getAttribute('value');
  }

  async setSonGuncellenmeTarihiInput(sonGuncellenmeTarihi) {
    await this.sonGuncellenmeTarihiInput.sendKeys(sonGuncellenmeTarihi);
  }

  async getSonGuncellenmeTarihiInput() {
    return this.sonGuncellenmeTarihiInput.getAttribute('value');
  }

  async ureticiSelectLastOption() {
    await this.ureticiSelect.all(by.tagName('option')).last().click();
  }

  async ureticiSelectOption(option) {
    await this.ureticiSelect.sendKeys(option);
  }

  getUreticiSelect() {
    return this.ureticiSelect;
  }

  async getUreticiSelectedOption() {
    return this.ureticiSelect.element(by.css('option:checked')).getText();
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
    await this.setTutarInput('5');
    expect(await this.getTutarInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setSonGuncellenmeTarihiInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
    expect(await this.getSonGuncellenmeTarihiInput()).to.contain('2001-01-01T02:30');
    await this.ureticiSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
