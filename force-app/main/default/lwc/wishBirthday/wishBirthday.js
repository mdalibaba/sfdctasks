import { LightningElement ,api,track} from 'lwc';
import birthBoolean from '@salesforce/apex/BirthDayWishes.wishTheBirthDay';

export default class WishBirthday extends LightningElement {
    @track birthday =false;

    //On load
    connectedCallback() {
        this.getBirthDate();
    }

    getBirthDate(){
        birthBoolean()
        .then(result => {
            
                this.birthday=result;
                console.log(result);
            
        })
        .catch(error => {
            this.birthday = false;
            alert('error',error);
        });

    }

}