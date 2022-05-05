import { LightningElement, api, wire } from 'lwc';
import getBooks from '@salesforce/apex/bookController.getBooks';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
//import DESCRIPTION_FIELD from '@salesforce/schema/Book__c.Description__c';
//import BOOKTYPE_FIELD from '@salesforce/schema/Book__c.Booktype__c';
import ID_FIELD from '@salesforce/schema/Book__c.Id';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import searchBook from '@salesforce/apex/bookSearch.retriveBook';




const columns = [
     {
        label: 'Description',
        fieldName: 'Description__c',
        type: 'text',
        editable: true
    },
    {
        label: 'Booktype',
        fieldName: 'Booktype__c',
        type: 'text',
        editable: true
    }, 
];

export default class SelectBook extends LightningElement {

    @api recordId;
    
    searchData;
    columns = columns;
    
    errorMsg = '';
    bookName = '';

    draftValues = [];

    @wire(getBooks, { accId: '$recordId' })
    books;

    handleSave(event) {

        const fields = {}; 
        fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
        fields[DESCRIPTION_FIELD.fieldApiName] = event.detail.draftValues[0].Description__c;
        fields[BOOKTYPE_FIELD.fieldApiName] = event.detail.draftValues[0].Booktype__c;

        const recordInput = {fields};

        updateRecord(recordInput)
        .then(() => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'book updated',
                    variant: 'success'
                })
            );
            // Display fresh data in the datatable
            return refreshApex(this.books).then(() => {

                // Clear all draft values in the datatable
                this.draftValues = [];

            });
        }).catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading record',
                    message: error.body.message,
                    variant: 'error'
                })
            );
        });
    }

    handleBookName(event) {
        this.errorMsg = '';
        this.bookName = event.currentTarget.value;
        console.log('bookName '+ this.bookName);
    }

   

    

    handleSearch() {
        if(!this.bookName) {
            this.errorMsg = 'Please enter book name to search.';
            this.searchData = undefined;
            return;
        }

        searchBook({bookName : this.bookName})
        .then(result => {
            this.searchData = result;
            console.log('books',result);
        })
        .catch(error => {
            this.searchData = undefined;
            if(error) {
                if (Array.isArray(error.body)) {
                    this.errorMsg = error.body.map(e => e.message).join(', ');
                } else if (typeof error.body.message === 'string') {
                    this.errorMsg = error.body.message;
                }
            }
        }) 
    }
        

}