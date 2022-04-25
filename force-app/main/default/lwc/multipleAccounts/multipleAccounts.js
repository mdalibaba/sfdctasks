import { LightningElement,  track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { createRecord } from 'lightning/uiRecordApi';
import ACCOUNT from '@salesforce/schema/Account';
 
import NAME_FIELD from '@salesforce/schema/Account.Name';
import PHONE_FIELD from '@salesforce/schema/Account.Phone';
 
export default class MultipleAccounts extends LightningElement {
   // @api recordId;
    @track accountList = [{
        name:'',
        phone:''  
    }];



 
  
    addRow() {
        this.accountList.push(JSON.parse(JSON.stringify(this.accountList)));
    }
 
    deleteRow(event) {
        var rowIndex = event.currentTarget.dataset.index;
        if(this.accountList.length > 1) {
            this.accountList.splice(rowIndex, 1);
        } 
    }
 
    handleChange(event) {
        var rowIndex = event.currentTarget.dataset.index;
        if(event.target.name === 'name') {
            this.accountList[rowIndex].name = event.target.value;
        }  else if(event.target.name === 'phone') {
            this.accountList[rowIndex].phone = event.target.value;
        }
    }

    handleCancel(event){
        var url = window.location.href; 
        var value = url.substr(0,url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
    }
 
 
    handleSave() { 
        var emptyCheck = false; 
        for(let rowIndex in this.accountList) { 
            if(this.accountList[rowIndex].name == null || 
                this.accountList[rowIndex].phone == null ||
                this.accountList[rowIndex].name == '' || 
                this.accountList[rowIndex].phone == '') {
                emptyCheck = true;
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error',
                    message: 'Please fill all empty fields',
                    variant: 'error',
                }));
                return false;
            } else {
                console.log('pass');
            }
        }
       
        if(emptyCheck === false) {
        const fields = {}; 
        for(let rowIndex in this.accountList) {
            fields[NAME_FIELD.fieldApiName] = this.accountList[rowIndex].name;
            
            fields[PHONE_FIELD.fieldApiName] = this.accountList[rowIndex].phone;
           
            const recordInput = { apiName: ACCOUNT.objectApiName, fields};
            createRecord(recordInput)
            .then(result => {
                if(result !== undefined) { 
                    this.accountList[rowIndex].name = '';
                    
                    this.accountList[rowIndex].phone = '';
                    this.dispatchEvent(new ShowToastEvent({
                        title: 'Success',
                        message: 'Accounts created Successfully',
                        variant: 'success',
                    }));
                }
            })
            .catch(error => {
                this.dispatchEvent(new ShowToastEvent({
                    title: 'Error creating record',
                    message: error.body.message,
                    variant: 'error',
                }));
            });
          }
       }
    }
 
}