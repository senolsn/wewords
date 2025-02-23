import { Component, OnInit } from "@angular/core";
import { Word } from "src/app/core/models/word";
import { DialogService } from "src/app/core/services/dialog.service";
import { NotificationService } from "src/app/core/services/notification.service";
import * as XLSX from 'xlsx';
import { A1_WORDS, A2_WORDS, B1_WORDS, B2_WORDS, C1_WORDS, C2_WORDS } from '../../../app/core/data/word';

interface MissedWord {
  original: string;
  translation: string;
  timestamp: number;
  type: 'wrong' | 'skipped';  // kelime tipi: yanlış veya atlanmış
}

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrl: "./word.component.scss",
})
export class WordComponent implements OnInit {
  public kelimeGruplari: Array<Word> = [];
  public importedWords: Array<{ EN: string; TR: string }> = [];
  public cevirilecekKelimeler: Array<string> = [];
  public kelimelerinCevirileri: Array<string> = [];
  public currentInput: string = "";
  public isCorrect: boolean = false;
  public currentTranslation: string = "";
  public currentWord: string = "";
  public hasAttempted: boolean = false;
  public selectedGroup: any = null;
  public excelGrupAdi: string = "";
  public isEnglishOrTurkish: boolean = false;
  missedWords: MissedWord[] = [];
  visibleTranslations: { [key: number]: boolean } = {};
  public isLightMode: boolean = false;
  public isModalOpen: boolean = false;

  constructor(
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) {
    this.loadMissedWords();
    this.loadThemePreference();
  }

  ngOnInit(): void {
    if(localStorage.length <= 1) this.setDefaultWords();
    this.getUserWordGroups();
  }

  setDefaultWords() {
    const defaultGroups = [
      { level: 'A1', words: A1_WORDS },
      { level: 'A2', words: A2_WORDS },
      { level: 'B1', words: B1_WORDS },
      { level: 'B2', words: B2_WORDS },
      { level: 'C1', words: C1_WORDS },
      { level: 'C2', words: C2_WORDS }
    ];

    defaultGroups.forEach(group => {
      const wordGroup = {
        dil: "EN-TR",
        grupAdi: `${group.level} Seviye Kelimeler`,
        kelimeler: group.words.map(w => w.EN),
        ceviriler: group.words.map(w => w.TR),
      };
      localStorage.setItem(`wordGroup_${group.level}`, JSON.stringify(wordGroup));
    });
  }

  getUserWordGroups() {
    const keys = Object.keys(localStorage);
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    
    // Önce tüm grupları toplayalım
    const allGroups: any[] = [];
    
    keys.forEach(key => {
      if (key !== 'lang' && 
          key !== 'missedWords' && 
          key.startsWith('wordGroup_')) {
        const group = JSON.parse(localStorage.getItem(key));
        group.key = key;
        allGroups.push(group);
      }
    });

    // Grupları sıralayalım
    this.kelimeGruplari = allGroups.sort((a, b) => {
      // Default gruplar için seviye sıralaması
      if (a.grupAdi.includes('Seviye') && b.grupAdi.includes('Seviye')) {
        const levelA = a.grupAdi.split(' ')[0]; // "A1", "B2" gibi
        const levelB = b.grupAdi.split(' ')[0];
        return levelOrder.indexOf(levelA) - levelOrder.indexOf(levelB);
      }
      // Default olmayan gruplar en sona
      if (a.grupAdi.includes('Seviye')) return -1;
      if (b.grupAdi.includes('Seviye')) return 1;
      // Default olmayan gruplar kendi aralarında alfabetik sıralı
      return a.grupAdi.localeCompare(b.grupAdi);
    });
  }

  onRadioButtonChanged(grup: any) {
    debugger;
    
    // Derin kopya oluşturuyoruz.
    const groupCopy = JSON.parse(JSON.stringify(grup));

    if (this.isEnglishOrTurkish) {
      this.kelimelerinCevirileri = [...groupCopy.kelimeler];
      this.cevirilecekKelimeler = [...groupCopy.ceviriler];
    } else {
      this.cevirilecekKelimeler = [...groupCopy.kelimeler];
      this.kelimelerinCevirileri = [...groupCopy.ceviriler];
    }

    this.getRandomWord();
  }

  // Rastgele kelime seçen metot sadece index döndürsün
  getRandomWordIndex(): number {
    return Math.floor(Math.random() * this.cevirilecekKelimeler.length);
  }

  // Seçilen indexteki kelimeyi set eden metot
  setCurrentWord(index: number) {
    this.currentWord = this.cevirilecekKelimeler[index];
    this.currentTranslation = this.kelimelerinCevirileri[index];
  }

  // Oyun başladığında rastgele kelime seçilecek metot
  getRandomWord() {
    const randomIndex = this.getRandomWordIndex();
    this.setCurrentWord(randomIndex);
    return this.currentWord;
  }

  // Kelimeyi atlamak için çağırılacak metot
  passWord() {
    this.saveMissedWord(
      this.currentWord,
      this.currentTranslation,
      'skipped'  // atlanan kelime
    );

    const previousWord = this.currentWord;
    let randomIndex = this.getRandomWordIndex();

    while (this.cevirilecekKelimeler[randomIndex] === previousWord && 
           this.cevirilecekKelimeler.length > 1) {
      randomIndex = this.getRandomWordIndex();
    }

    this.setCurrentWord(randomIndex);
  }

  //Çevirinin doğru olup olmadığını kontrol eden metot.
  checkTranslation() {
    this.hasAttempted = true;
    if (this.currentInput.toLowerCase().trim() === this.currentTranslation.toLowerCase().trim()) {
      this.isCorrect = true;
      this.removeWordFromList();
    } else {
      this.isCorrect = false;
      this.saveMissedWord(
        this.currentWord,
        this.currentTranslation,
        'wrong'  // yanlış bilinen kelime
      );
    }
    this.currentInput = "";
  } 
  //Doğru çevrilen kelimenin listelerden çıkarılmasını sağlayan metot.
  async removeWordFromList() {
    const index = this.cevirilecekKelimeler.indexOf(this.currentWord);
    //Kelime Gruptan Silinir.
    if (index > -1) {
      this.cevirilecekKelimeler.splice(index, 1);
      this.kelimelerinCevirileri.splice(index, 1);
    }

    //Yeni Kelime Seçilir.
    if (this.cevirilecekKelimeler.length > 0) {
      this.getRandomWord();
    }  
    else {
      //Oyun Biter.
      await this.dialogService.information("Tebrikler bu grubu bitirdiniz!");
      this.selectedGroup = null
      this.cevirilecekKelimeler = [];
      this.kelimelerinCevirileri = [];
      this.currentWord = "";
      this.currentTranslation = "";
    }
  }

  //Excel dosyasını okuyup kelimeleri gruplara atayan metot.
  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      this.notificationService.error("Lütfen tek bir dosya seçin.");
      return;
    }

    const file: File = target.files[0];
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      // İlk sayfayı seçiyoruz
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      // Excel verisini JSON formatına çeviriyoruz
      let data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      data = data.slice(1);
      
      console.log(data);
      // Kolonları işleme
      this.importedWords = [];
      data.forEach((row: any) => {
        if (row[0] && row[1]) {
          this.importedWords.push({ EN: row[0], TR: row[1] });
        }
      });

      if (this.importedWords.length === 0) {
        this.notificationService.error("Geçerli bir kelime grubu bulunamadı.");
      } else {
        this.notificationService.success("Excel dosyası başarıyla okundu.");
      }
    };

    reader.readAsBinaryString(file);
  }

  saveToLocalStorage(): void {
    if (this.importedWords.length === 0) {
      this.notificationService.error("Lütfen önce bir Excel dosyası yükleyin.");
      return;
    }

    const newGroup = {
      dil: "EN-TR",
      grupAdi: this.excelGrupAdi == "" ? "Excel Kelime Grubu" : this.excelGrupAdi,
      kelimeler: this.importedWords.map((word) => word.EN),
      ceviriler: this.importedWords.map((word) => word.TR),
    };

    const groupKey = `wordGroup_${new Date().getTime()}`;
    localStorage.setItem(groupKey, JSON.stringify(newGroup));

    this.kelimeGruplari.push(newGroup);
    this.notificationService.success("Kelime grubu başarıyla kaydedildi.");
  }

  public downloadExcelTemplate(){
    const link = document.createElement('a');
    link.href = './assets/excels/KelimeSablonu.xlsx';
    link.download = 'KelimeSablonu.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  toggleTranslation(e:any){
    this.isEnglishOrTurkish = e.target.checked;

    let templateArray = this.kelimelerinCevirileri;
    this.kelimelerinCevirileri = this.cevirilecekKelimeler;
    this.cevirilecekKelimeler = templateArray;

    let templateWord = this.currentWord;
    this.currentWord = this.currentTranslation;
    this.currentTranslation = templateWord;
  }

  // Çeviri görünürlüğünü değiştiren metod
  toggleTranslationVisibility(wordId: number) {
    this.visibleTranslations[wordId] = !this.visibleTranslations[wordId];
  }

  // Bilinemeyen kelimeleri localStorage'dan yükleme
  loadMissedWords() {
    const savedWords = localStorage.getItem('missedWords');
    if (savedWords) {
      this.missedWords = JSON.parse(savedWords);
    }
  }

  // Bilinemeyen kelimeleri kaydetme
  saveMissedWord(original: string, translation: string, type: 'wrong' | 'skipped') {
    if (this.missedWords.some(word => 
        word.original === original && 
        word.translation === translation)) {
      return;
    }

    const typeWords = this.missedWords.filter(word => word.type === type);
    if (typeWords.length >= 5) {
      this.notificationService.info(
        'Maksimum kelime sayısına ulaşıldı. Lütfen mevcut kelimeleri indirin veya temizleyin.'
      );
      return;
    }

    const missedWord: MissedWord = {
      original,
      translation,
      timestamp: new Date().getTime(),
      type
    };
    
    this.missedWords.push(missedWord);
    this.updateLocalStorage();
  }

  // Kelime grubu silme metodu
  deleteWordGroup(groupKey: string) {
      localStorage.removeItem(groupKey);
      this.kelimeGruplari = this.kelimeGruplari.filter(grup => grup.key !== groupKey);
      
      // Eğer silinen grup seçili olan grupsa, seçimi kaldır
      if (this.selectedGroup && this.selectedGroup.key === groupKey) {
        this.selectedGroup = null;
        this.currentWord = '';
        this.currentTranslation = '';
        this.currentInput = '';
      }
      
      this.notificationService.success('Kelime grubu başarıyla silindi.');
  }

  // Yanlış bilinen kelimeleri getiren metod
  public getWrongWords() {
    return this.missedWords.filter(word => word.type === 'wrong');
  }

  // Atlanan kelimeleri getiren metod
  public getSkippedWords() {
    return this.missedWords.filter(word => word.type === 'skipped');
  }

  // Tema tercihini yükleme
  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    this.isLightMode = savedTheme === 'light';
  }

  // Tema değiştirme
  toggleTheme() {
    this.isLightMode = !this.isLightMode;
    localStorage.setItem('theme', this.isLightMode ? 'light' : 'dark');
  }

  // Modal açma
  openWordUploadModal() {
    this.isModalOpen = true;
    document.body.style.overflow = 'hidden'; // Scroll'u engelle
  }

  // Modal kapatma
  closeModal(event: Event) {
    this.isModalOpen = false;
    document.body.style.overflow = ''; // Scroll'u geri aç
    this.excelGrupAdi = ''; // Form'u temizle
  }

  // Yanlış bilinen kelimeleri temizleme
  clearWrongWords() {
    this.missedWords = this.missedWords.filter(word => word.type === 'skipped');
    this.updateLocalStorage();
    this.notificationService.success('Yanlış bilinen kelimeler temizlendi.');
  }

  // Atlanan kelimeleri temizleme
  clearSkippedWords() {
    this.missedWords = this.missedWords.filter(word => word.type === 'wrong');
    this.updateLocalStorage();
    this.notificationService.success('Atlanan kelimeler temizlendi.');
  }

  // LocalStorage'ı güncelleme
  private updateLocalStorage() {
    localStorage.setItem('missedWords', JSON.stringify(this.missedWords));
  }

  // Yanlış bilinen kelimeleri Excel olarak indirme
  downloadWrongWords() {
    const wrongWords = this.getWrongWords();
    this.downloadAsExcel(wrongWords, 'yanlis_bilinen_kelimeler');
  }

  // Atlanan kelimeleri Excel olarak indirme
  downloadSkippedWords() {
    const skippedWords = this.getSkippedWords();
    this.downloadAsExcel(skippedWords, 'atlanan_kelimeler');
  }

  // Excel indirme işlemi
  private downloadAsExcel(words: MissedWord[], fileName: string) {
    const data = words.map(word => ({
      'Kelime': word.original,
      'Çevirisi': word.translation,
      'Tarih': new Date(word.timestamp).toLocaleString()
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kelimeler');
    
    // Excel dosyasını indir
    XLSX.writeFile(wb, `${fileName}_${new Date().toLocaleDateString()}.xlsx`);
    
    // İndirme işlemi tamamlandıktan sonra bildiri göster
    this.notificationService.success('Kelimeler başarıyla indirildi.');
  }
}
