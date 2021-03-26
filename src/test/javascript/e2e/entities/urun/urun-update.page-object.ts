import { element, by, ElementFinder } from 'protractor';
import { waitUntilDisplayed, waitUntilHidden, isVisible } from '../../util/utils';

const expect = chai.expect;

export default class UrunUpdatePage {
  pageTitle: ElementFinder = element(by.id('koopApp.urun.home.createOrEditLabel'));
  saveButton: ElementFinder = element(by.id('save-entity'));
  cancelButton: ElementFinder = element(by.id('cancel-save'));
  urunAdiInput: ElementFinder = element(by.css('input#urun-urunAdi'));
  stokInput: ElementFinder = element(by.css('input#urun-stok'));
  stokSiniriInput: ElementFinder = element(by.css('input#urun-stokSiniri'));
  musteriFiyatiInput: ElementFinder = element(by.css('input#urun-musteriFiyati'));
  birimSelect: ElementFinder = element(by.css('select#urun-birim'));
  dayanismaUrunuInput: ElementFinder = element(by.css('input#urun-dayanismaUrunu'));
  satistaInput: ElementFinder = element(by.css('input#urun-satista'));
  urunKategorisiSelect: ElementFinder = element(by.css('select#urun-urunKategorisi'));
  activeInput: ElementFinder = element(by.css('input#urun-active'));
  urunSorumlusuSelect: ElementFinder = element(by.css('select#urun-urunSorumlusu'));
  kdvKategorisiSelect: ElementFinder = element(by.css('select#urun-kdvKategorisi'));

  getPageTitle() {
    return this.pageTitle;
  }

  async setUrunAdiInput(urunAdi) {
    await this.urunAdiInput.sendKeys(urunAdi);
  }

  async getUrunAdiInput() {
    return this.urunAdiInput.getAttribute('value');
  }

  async setStokInput(stok) {
    await this.stokInput.sendKeys(stok);
  }

  async getStokInput() {
    return this.stokInput.getAttribute('value');
  }

  async setStokSiniriInput(stokSiniri) {
    await this.stokSiniriInput.sendKeys(stokSiniri);
  }

  async getStokSiniriInput() {
    return this.stokSiniriInput.getAttribute('value');
  }

  async setMusteriFiyatiInput(musteriFiyati) {
    await this.musteriFiyatiInput.sendKeys(musteriFiyati);
  }

  async getMusteriFiyatiInput() {
    return this.musteriFiyatiInput.getAttribute('value');
  }

  async setBirimSelect(birim) {
    await this.birimSelect.sendKeys(birim);
  }

  async getBirimSelect() {
    return this.birimSelect.element(by.css('option:checked')).getText();
  }

  async birimSelectLastOption() {
    await this.birimSelect.all(by.tagName('option')).last().click();
  }
  getDayanismaUrunuInput() {
    return this.dayanismaUrunuInput;
  }
  getSatistaInput() {
    return this.satistaInput;
  }
  async setUrunKategorisiSelect(urunKategorisi) {
    await this.urunKategorisiSelect.sendKeys(urunKategorisi);
  }

  async getUrunKategorisiSelect() {
    return this.urunKategorisiSelect.element(by.css('option:checked')).getText();
  }

  async urunKategorisiSelectLastOption() {
    await this.urunKategorisiSelect.all(by.tagName('option')).last().click();
  }
  getActiveInput() {
    return this.activeInput;
  }
  async urunSorumlusuSelectLastOption() {
    await this.urunSorumlusuSelect.all(by.tagName('option')).last().click();
  }

  async urunSorumlusuSelectOption(option) {
    await this.urunSorumlusuSelect.sendKeys(option);
  }

  getUrunSorumlusuSelect() {
    return this.urunSorumlusuSelect;
  }

  async getUrunSorumlusuSelectedOption() {
    return this.urunSorumlusuSelect.element(by.css('option:checked')).getText();
  }

  async kdvKategorisiSelectLastOption() {
    await this.kdvKategorisiSelect.all(by.tagName('option')).last().click();
  }

  async kdvKategorisiSelectOption(option) {
    await this.kdvKategorisiSelect.sendKeys(option);
  }

  getKdvKategorisiSelect() {
    return this.kdvKategorisiSelect;
  }

  async getKdvKategorisiSelectedOption() {
    return this.kdvKategorisiSelect.element(by.css('option:checked')).getText();
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
    await this.setUrunAdiInput('urunAdi');
    expect(await this.getUrunAdiInput()).to.match(/urunAdi/);
    await waitUntilDisplayed(this.saveButton);
    await this.setStokInput('5');
    expect(await this.getStokInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setStokSiniriInput('5');
    expect(await this.getStokSiniriInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.setMusteriFiyatiInput('5');
    expect(await this.getMusteriFiyatiInput()).to.eq('5');
    await waitUntilDisplayed(this.saveButton);
    await this.birimSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    const selectedDayanismaUrunu = await this.getDayanismaUrunuInput().isSelected();
    if (selectedDayanismaUrunu) {
      await this.getDayanismaUrunuInput().click();
      expect(await this.getDayanismaUrunuInput().isSelected()).to.be.false;
    } else {
      await this.getDayanismaUrunuInput().click();
      expect(await this.getDayanismaUrunuInput().isSelected()).to.be.true;
    }
    await waitUntilDisplayed(this.saveButton);
    const selectedSatista = await this.getSatistaInput().isSelected();
    if (selectedSatista) {
      await this.getSatistaInput().click();
      expect(await this.getSatistaInput().isSelected()).to.be.false;
    } else {
      await this.getSatistaInput().click();
      expect(await this.getSatistaInput().isSelected()).to.be.true;
    }
    await waitUntilDisplayed(this.saveButton);
    await this.urunKategorisiSelectLastOption();
    await waitUntilDisplayed(this.saveButton);
    const selectedActive = await this.getActiveInput().isSelected();
    if (selectedActive) {
      await this.getActiveInput().click();
      expect(await this.getActiveInput().isSelected()).to.be.false;
    } else {
      await this.getActiveInput().click();
      expect(await this.getActiveInput().isSelected()).to.be.true;
    }
    await this.urunSorumlusuSelectLastOption();
    await this.kdvKategorisiSelectLastOption();
    await this.save();
    await waitUntilHidden(this.saveButton);
    expect(await isVisible(this.saveButton)).to.be.false;
  }
}
