import { LightningElement, api, track } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import insertBook from '@salesforce/apex/AccountRecordInsert.insertBook';


const DELAY = 100;

export default class StudentRecord extends LightningElement {

    // Expose a field to make it available in the template

    @api recordId;

    @track bookList = [{
        name: '',
        institutionName: '',
        subject: '',
        bookName: ''
    }];
    book=[];


    addRow() {
        this.bookList.push(JSON.parse(JSON.stringify(this.bookList)));
    }

    deleteRow(event) {
        var rowIndex = event.currentTarget.dataset.index;
        if (this.bookList.length > 1) {
            this.bookList.splice(rowIndex, 1);
        }
    }

    
    handleName(event){
        let rowIndex = event.currentTarget.dataset.index;
        this.bookList[rowIndex].name = event.target.value;
    }
    handleInstitutionName(event){
        let rowIndex = event.currentTarget.dataset.index;
        this.bookList[rowIndex].institutionName = event.target.value;
    }
    handleSubject(event){
        let rowIndex = event.currentTarget.dataset.index;
        this.bookList[rowIndex].subject = event.target.value;
    }
    handleBookName(event){
        let rowIndex = event.currentTarget.dataset.index;
        this.bookList[rowIndex].bookName = event.target.value;
    }

    handleCancel() {
        var url = window.location.href;
        var value = url.substr(0, url.lastIndexOf('/') + 1);
        window.history.back();
        return false;
    }


    handleSave() {
        //alert('1');
        var emptyCheck = false;
        for (let rowIndex in this.bookList) {
            if (this.bookList[rowIndex].name == null ||
                this.bookList[rowIndex].institutionName == null ||
                this.bookList[rowIndex].subject == null ||
                this.bookList[rowIndex].bookName == null ||
                this.bookList[rowIndex].name == '' ||
                this.bookList[rowIndex].institutionName == '' ||
                this.bookList[rowIndex].subject == '' ||
                this.bookList[rowIndex].bookName == '') {
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
        //alert('3');
        //console.log('===========> this.book', this.bookList);
        if (emptyCheck === false) {
            
            for (let rowIndex in this.bookList) {
                let name = this.bookList[rowIndex].name;

                let institutionName = this.bookList[rowIndex].institutionName;

                let subject = this.bookList[rowIndex].subject;

                let bookName = this.bookList[rowIndex].bookName;

                const bookl={
                    Student_Name__c:name,
                    Institution_Name__c:institutionName,
                    subject__c:subject,
                    Name:bookName
                }
                this.book = [...this.book, bookl] ;

                //alert('5');
                console.log('books', this.book);

                
                
                //insertBook(name, institutionName, subject, bookName)
                
            }
            insertBook({book:this.book})
                    .then(result => {
                        if (result !== undefined) {
                            
                                console.log('inserted Record !!');
                                //alert('6');
                            this.dispatchEvent(new ShowToastEvent({
                                title: 'Success',
                                message: 'Book Record created Successfully',
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