import { element, by, ElementFinder } from 'protractor';

export default class UrunFiyatHesapUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.urunFiyatHesap.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  amortismanInput: ElementFinder = element(by.css('input#urun-fiyat-hesap-amortisman'));
  giderPusulaMustahsilInput: ElementFinder = element(by.css('input#urun-fiyat-hesap-giderPusulaMustahsil'));
  dukkanGiderInput: ElementFinder = element(by.css('input#urun-fiyat-hesap-dukkanGider'));
  kooperatifCalismaInput: ElementFinder = element(by.css('input#urun-fiyat-hesap-kooperatifCalisma'));
  dayanismaInput: ElementFinder = element(by.css('input#urun-fiyat-hesap-dayanisma'));
  fireInput: ElementFinder = element(by.css('input#urun-fiyat-hesap-fire'));
  urunSelect: ElementFinder = element(by.css('select#urun-fiyat-hesap-urun'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setAmortismanInput(amortisman) {
    await this.amortismanInput.sendKeys(amortisman);
  }

  async getAmortismanInput() {
    return this.amortismanInput.getAttribute('value');
  }

  async setGiderPusulaMustahsilInput(giderPusulaMustahsil) {
    await this.giderPusulaMustahsilInput.sendKeys(giderPusulaMustahsil);
  }

  async getGiderPusulaMustahsilInput() {
    return this.giderPusulaMustahsilInput.getAttribute('value');
  }

  async setDukkanGiderInput(dukkanGider) {
    await this.dukkanGiderInput.sendKeys(dukkanGider);
  }

  async getDukkanGiderInput() {
    return this.dukkanGiderInput.getAttribute('value');
  }

  async setKooperatifCalismaInput(kooperatifCalisma) {
    await this.kooperatifCalismaInput.sendKeys(kooperatifCalisma);
  }

  async getKooperatifCalismaInput() {
    return this.kooperatifCalismaInput.getAttribute('value');
  }

  async setDayanismaInput(dayanisma) {
    await this.dayanismaInput.sendKeys(dayanisma);
  }

  async getDayanismaInput() {
    return this.dayanismaInput.getAttribute('value');
  }

  async setFireInput(fire) {
    await this.fireInput.sendKeys(fire);
  }

  async getFireInput() {
    return this.fireInput.getAttribute('value');
  }

  async urunSelectLastOption() {
    await this.urunSelect.all(by.tagName('option')).last().click();
  }

  async urunSelectOption(option) {
    await this.urunSelect.sendKeys(option);
  }

  getUrunSelect() {
    return this.urunSelect;
  }

  async getUrunSelectedOption() {
    return this.urunSelect.element(by.css('option:checked')).getText();
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
}
