import { LightningElement } from 'lwc';
import serachAccs from '@salesforce/apex/AccountSearch.retriveAccs';

const columns = [
     {
        label: 'Phone',
        fieldName: 'Phone',
        type: 'phone',
    }, 
];

export default class SearchAccount extends LightningElement {

    

    searchData;
    columns = columns;
    errorMsg = '';
    strSearchAccName = '';
    

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