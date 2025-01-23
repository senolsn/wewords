import { Component, OnInit } from "@angular/core";
import { defaultWordsTR, defaultWordsEN } from "../../../app/core/data/word";
import { Word } from "src/app/core/models/word";
import { DialogService } from "src/app/core/services/dialog.service";
import { NotificationService } from "src/app/core/services/notification.service";
import * as XLSX from 'xlsx';

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrl: "./word.component.scss",
})
export class WordComponent implements OnInit {
  
  public kelimeGruplari : Array<Word> = [];

  public importedWords: Array<{ EN: string; TR: string }> = [];


  public cevirilecekKelimeler : Array<string> = [];
  public kelimelerinCevirileri : Array<string> = [];
  public currentInput: string = ""; // Kullanıcıdan alınan çeviri
  public isCorrect: boolean = false; // Çeviri doğru mu
  public currentTranslation: string = ""; // Şu anki kelimenin çevirisi
  public currentWord: string = ""; // Şu anki kelime
  public hasAttempted: boolean = false; // Kullanıcının kontrol yapıp yapmadığını takip eder
  public selectedGroup: any = null; // Seçili radio button'u tutar
  public excelGrupAdi: string = ""; // Excel'den yüklenen kelime grubunun adı
  public isEnglishOrTurkish: boolean = false; // İngilizce mi Türkçe mi, default EN


  constructor(
    private dialogService : DialogService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    
    if(localStorage.getItem('defaultWords') == null && localStorage.length == 1) this.setDefaultWords();
    this.getUserWordGroups();

 }

 setDefaultWords(){
   //Siteye ilk giriş koşulu
   const defaultWordsGroup1 = { dil: localStorage.getItem('lang'), grupAdi: "En Çok Kullanılan 10 Kelime", kelimeler: defaultWordsEN, ceviriler: defaultWordsTR};
   localStorage.setItem("defaultWords", JSON.stringify(defaultWordsGroup1));
 }

 getUserWordGroups(){
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if(key == "lang"){
      
    }
    else{
      this.kelimeGruplari.push(JSON.parse(localStorage.getItem(key)));
    }
  })
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

 //Oyun başladığında rastgele kelime seçilecek metot.
 getRandomWord(){
  const randomIndex = Math.floor(Math.random() * this.cevirilecekKelimeler.length);
  this.currentWord = this.cevirilecekKelimeler[randomIndex];
  this.currentTranslation = this.kelimelerinCevirileri[randomIndex];
  return this.currentWord;
 }

 //Kelimeyi atlamak için çağırılacak metot.
 passWord(){
  const previousWord = this.currentWord; // Önceki kelimeyi sakla
  let newWord = this.getRandomWord(); // Yeni kelime seç

  while (newWord === previousWord){ // Eğer yeni kelime önceki kelimeyle aynıysa tekrar seçim yap.
    newWord = this.getRandomWord();
  }
  //Farklı olduğunda yeni kelimeyi döndür.
  this.currentWord = newWord;
}

 //Çevirinin doğru olup olmadığını kontrol eden metot.
 checkTranslation() {
  this.hasAttempted = true; // Kullanıcı kontrol yaptı
  if (this.currentInput.toLowerCase().trim() === this.currentTranslation.toLowerCase().trim()) {
    this.isCorrect = true;
    this.removeWordFromList();

  } else {
    this.isCorrect = false;
    return;
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
}
