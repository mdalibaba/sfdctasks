public with sharing class BirthDayWishes {
    @AuraEnabled
    public static boolean wishTheBirthDay(){
      //  Account currentLoggedinUser = [Select id,DOB__c from Account Where OwnerId  =: UserInfo.getUserId() ];
        
	for(Account item : [Select id,DOB__c from Account Where OwnerId  =: UserInfo.getUserId()]){
        if( item.DOB__c != null ){
            if( Date.today().Day() == item.DOB__c.Day() &&
               Date.today().Month() == item.DOB__c.Month()){
                   return true;
               }
        }
    }
        return false;
    }
    @AuraEnabled
    public static Account wishTheBirthDay1(integer cd, integer cm,string rid){
        
        Account acc = [Select id,DOB__c,Name from Account Where DAY_IN_MONTH(DOB__c)  =: cd AND CALENDAR_MONTH(DOB__c) =:cm AND Id =:rid ];
        return acc;
        
       

    }

}
