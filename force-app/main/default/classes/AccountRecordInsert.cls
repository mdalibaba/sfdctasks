public with sharing class AccountRecordInsert {
    

    @AuraEnabled(cacheable=true)
    public static List<Account> searchAccountNameMethod (String accStrName){
        String keyNameString = '%' +  accStrName + '%';
        return [Select Id, Name, Phone, Website, Industry, Description From Account Where Name like:keyNameString LIMIT 5];
     }    

     
   @AuraEnabled(cacheable=true)
    public static Book__c insertNewBook(String name, String institutionName , String subject, String bookName) {
        Book__c b = new Book__c();
        
        b.Student_Name__c = name;
        b.Institution_Name__c = institutionName;
        b.subject__c = subject;
        b.Name = bookName;

        try {
            insert b;
        } catch (Exception e) {
            return null;
        }
        return b;
    }
    @AuraEnabled
    public static void insertBook(List<Book__c> book){

        insert book;

    }
}