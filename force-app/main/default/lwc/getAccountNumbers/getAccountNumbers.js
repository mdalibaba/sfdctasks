import { LightningElement,track } from 'lwc';
import serachAccs from '@salesforce/apex/AccountSearch.retriveAccs';

const columns = [
     {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
    }, 
];

export default class GetAccountNumbers extends LightningElement {

    keyIndex=0;

    @track accountList = [{
        id:0

    }];

    searchData;
    columns = columns;
    errorMsg = '';
    strSearchAccName = '';
    
    addRow() {
        this.accountList.push(JSON.parse(JSON.stringify(this.accountList)));
        this.searchData='';
        this.strSearchAccName='';

       // ++this.keyIndex;
       // var newItem = [{ id: this.keyIndex }];
        //this.accountList = this.accountList.concat(newItem);
    }
    
    deleteRow(event) {
        var rowIndex = event.currentTarget.dataset.index;
        if(this.accountList.length > 1) {
            this.accountList.splice(rowIndex, 1);
        } 
    }

    handleAccountName(event) {
        this.errorMsg = '';
        this.strSearchAccName = event.currentTarget.value;
    }

    handleSearch() {
        if(!this.strSearchAccName) {
            this.errorMsg = 'Please enter account name to search.';
            this.searchData = undefined;
            return;
        }

        serachAccs({strAccName : this.strSearchAccName})
        .then(result => {
            this.searchData = result;
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