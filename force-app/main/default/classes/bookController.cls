public class bookController {

    @AuraEnabled(cacheable=true)
    public static List<Book__c> getBooks(String accId){
        
        return [
            SELECT  Id, Description__c, Booktype__c
            FROM Book__c
            WHERE Id = :accId
            WITH SECURITY_ENFORCED
        ];
    }

     @AuraEnabled(cacheable=true)
    public static List<Contact> getContacts(String accId) {
        return [
            SELECT AccountId, Id, FirstName, LastName, Title, Phone, Email
            FROM Contact
            WHERE AccountId = :accId
            WITH SECURITY_ENFORCED
        ];
    }

}