import { LightningElement, track, wire } from 'lwc';
import getAccounts from '@salesforce/apex/AccountRecordInsert.searchAccountNameMethod';
const DELAY = 100;

export default class LwcSearchAccountList extends LightningElement {
    accountName = '';
    accountPhone = '';
   
  @track accountList= [];
  @wire (getAccounts,{
        accStrName:'$accountName',
        
     })
  retrieveAccounts({error, data}){
      if(data){
          this.accountList=data;          
      }
      else if(error){

      }
      
  }


  searchAccountAction(event){
      //this.accountName = event.target.value;
      const searchString = event.target.value;
      window.clearTimeout(this.delayTimeout);
      this.delayTimeout = setTimeout(() => {
          this.accountName = searchString; 
      }, DELAY);
  }
}