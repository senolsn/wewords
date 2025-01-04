import { Component, OnInit } from "@angular/core";
import { levelA1WordsEN, levelA1WordsTR, top10WordsEN, top10WordsTR } from "../../../app/core/data/word";
import { Word } from "src/app/core/models/word";
import { DialogService } from "src/app/core/services/dialog.service";

@Component({
  selector: "app-word",
  templateUrl: "./word.component.html",
  styleUrl: "./word.component.scss",
})
export class WordComponent implements OnInit {
  
  public kelimeGruplari : Array<Word> = [];

  public cevirilecekKelimeler : Array<string> = [];
  public kelimelerinCevirileri : Array<string> = [];
  public currentInput: string = ""; // Kullanıcıdan alınan çeviri
  public isCorrect: boolean = false; // Çeviri doğru mu
  public currentTranslation: string = ""; // Şu anki kelimenin çevirisi
  public currentWord: string = ""; // Şu anki kelime
  public hasAttempted: boolean = false; // Kullanıcının kontrol yapıp yapmadığını takip eder
  public selectedGroup: any = null; // Seçili radio button'u tutar


  constructor(
    private dialogService : DialogService
  ) {}

  ngOnInit(): void {
    
    if(localStorage.getItem('defaultWords') == null && localStorage.length == 1) this.setDefaultWords();
    this.getUserWordGroups();

 }

 setDefaultWords(){
   //Siteye ilk giriş koşulu
   const defaultWordsGroup1 = { dil: localStorage.getItem('lang'), grupAdi: "En Önemli 10 Kelime", kelimeler: top10WordsEN, ceviriler: top10WordsTR};
   const defaultWordsGroup2 = { dil: localStorage.getItem('lang'), grupAdi: "A1 Kelime Grubu", kelimeler: levelA1WordsEN, ceviriler: levelA1WordsTR};
   localStorage.setItem("defaultWords", JSON.stringify(defaultWordsGroup1));
   localStorage.setItem("defaultWords2", JSON.stringify(defaultWordsGroup2));
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

 onRadioButtonChanged(grup:any){
  this.cevirilecekKelimeler = grup.kelimeler;
  this.kelimelerinCevirileri = grup.ceviriler;
  this.getRandomWord();
 }
 //Oyun başladığında rastgele kelime seçilecek metot.
 getRandomWord(){
  const randomIndex = Math.floor(Math.random() * this.cevirilecekKelimeler.length);
  this.currentWord = this.cevirilecekKelimeler[randomIndex];
  this.currentTranslation = this.kelimelerinCevirileri[randomIndex];
  return this.currentWord;
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
  }
}
}
