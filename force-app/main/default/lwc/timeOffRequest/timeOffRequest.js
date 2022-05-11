import { LightningElement, api, track } from 'lwc';
import { createRecord } from 'lightning/uiRecordApi';
import TIMEOFF from '@salesforce/schema/TimeOff_Request__c';
import NAME_FIELD from '@salesforce/schema/TimeOff_Request__c.Name';
import STARTDATE_FIELD from '@salesforce/schema/TimeOff_Request__c.Start_Date__c';
import ENDDATE_FIELD from '@salesforce/schema/TimeOff_Request__c.End_Date__c';


import insertTimeOff from '@salesforce/apex/TimeOff.insertTimeOff'
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class TimeOffRequest extends LightningElement {

    // Expose a field to make it available in the template
    today = new Date();
    @track start_date;
    @track end_date;
    @track range;
    @track name;

    timeOff=[];


    // Flexipage provides recordId and objectApiName
    @api recordId;
    @api objectApiName;

    connectedCallback() {
        this.start_date = (this.start_date) ? this.start_date : this.today.toJSON().slice(0, 10);
        this.end_date = (this.end_date) ? this.end_date : this.addDays(this.today, 1).toJSON().slice(0, 10);
        this.range = this.diff(this.start_date, this.end_date);
    }

    addDays = (sd, days) => {
        const d = new Date(Number(sd));
        d.setDate(sd.getDate() + days);
        return d;
    }

    diff = (sdate, edate) => {
        let diffTime = Math.abs(new Date(edate).getTime() - new Date(sdate).getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    valid_date = (sdate, edate) => {
        if(sdate<this.today)
        {
            inputDate.setCustomValidity("Date value can not be less than today");
        }
        return new Date(edate) >= new Date(sdate);
    }

    handleName(event){
        this.name= event.target.value;
    }

    handleDateChange = (evt) => {
        let field_name = evt.target.name;

        if (field_name === 'startdate')
            this.start_date = evt.target.value;
        if (field_name === 'name')
           this.name = evt.target.value;
        if (field_name === 'enddate')
            this.end_date = evt.target.value;

        if (this.valid_date(this.start_date, this.end_date) === true) {
            this.range = this.diff(this.start_date, this.end_date);
        } else {
            let inputfield = this.template.querySelector("." + field_name);
            inputfield.setCustomValidity('End date must be greater than the Start date');
            inputfield.reportValidity();
        }
    }

    //save record

    handleSave() {
        //alert('1');
        var emptyCheck = false;
        
            if (this.name == null ||
                this.start_date == null ||
                this.end_date == null ||
                this.name == '' ||
                this.start_date == '' ||
                this.end_date == '' ) {
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
        
        alert('3');
        //console.log('===========> this.book', this.bookList);
        if (emptyCheck === false) {
            
            
                //let name = this.name;

               // let startdate = this.start_date;

               // let enddate = this.end_date;


               // const timeOffl={
               //     Name:name,
                //    Startdate:startdate,
                //    Enddate:enddate,
                //}
                //this.timeOff = [...this.timeOff, timeOffl] ;

                alert('5');
               console.log('name', this.name);
               console.log('startdate ',this.start_date);
               console.log('enddate ',this.end_date);
               const fields = {};

               fields[NAME_FIELD.fieldApiName] = this.name;
            
            fields[STARTDATE_FIELD.fieldApiName] = this.start_date;
            fields[ENDDATE_FIELD.fieldApiName] = this.end_date;
           
            const recordInput = { apiName: TIMEOFF.objectApiName, fields};

                
                
                //insertBook(name, institutionName, subject, bookName)
                
            
                createRecord(recordInput)
                    .then(result => {
                        if (result !== undefined) {
                            
                                console.log('inserted Record !!');
                                alert('6');
                            this.dispatchEvent(new ShowToastEvent({
                                title: 'Success',
                                message: 'TimeOff Record created Successfully',
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