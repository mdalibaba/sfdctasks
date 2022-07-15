import { LightningElement,api , track} from 'lwc';
import birthBoolean from '@salesforce/apex/BirthDayWishes.wishTheBirthDay1';

export default class Bday extends LightningElement {
    @api recordId;

    @track Name;
    @track birthday=false;

    today = new Date();
    cd = this.today.getDate();
    cm = this.today.getMonth()+1;

    connectedCallback() {
        this.getBirthDate();
        console.log('id-----',this.recordId);
        console.log('cd-----',this.cd);
        console.log('cm-----',this.cm);

        
    }

    getBirthDate(){
        birthBoolean({cd:this.cd,cm:this.cm,rid:this.recordId})
        .then(result => {
            
                this.birthday=true;

                this.Name=result.Name;
                
            
        })
        .catch(error => {
            this.birthday = false;
        
            console.log('Today is not your birthday----'+error);
        });

    }
    
}
