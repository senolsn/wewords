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

  constructor(
    private dialogService: DialogService,
    private notificationService: NotificationService
  ) {
    this.loadMissedWords();
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
    keys.forEach(key => {
      if (key !== 'lang' && 
          key !== 'missedWords' && 
          key.startsWith('wordGroup_')) { // defaultWords kontrolünü kaldırdık
        const group = JSON.parse(localStorage.getItem(key));
        group.key = key;
        this.kelimeGruplari.push(group);
      }
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
    // Önce mevcut kelimeyi bilinmeyen kelimelere ekle
    this.saveMissedWord(
      this.currentWord,
      this.currentTranslation
    );

    const previousWord = this.currentWord;
    let randomIndex = this.getRandomWordIndex();

    // Eğer yeni kelime önceki kelimeyle aynıysa tekrar seçim yap
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
        this.currentTranslation
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

  // Bilinemeyen kelimeleri localStorage'dan yükleme
  loadMissedWords() {
    const savedWords = localStorage.getItem('missedWords');
    if (savedWords) {
      this.missedWords = JSON.parse(savedWords);
    }
  }

  // Bilinemeyen kelimeleri kaydetme
  saveMissedWord(original: string, translation: string) {
    if (this.missedWords.some(word => 
        word.original === original && 
        word.translation === translation)) {
      return;
    }

    const missedWord: MissedWord = {
      original,
      translation,
      timestamp: new Date().getTime()
    };
    
    this.missedWords.push(missedWord);
    localStorage.setItem('missedWords', JSON.stringify(this.missedWords));
  }

  // Bilinemeyen kelimeleri temizleme
  clearMissedWords() {
    this.missedWords = [];
    localStorage.removeItem('missedWords');
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
}
