
var should = require('should');
var rest = require('restler');

describe ('something', () => {
    it ('does something', (done) =>{
        should(1).equal(1);
        //Create a server

        var express = require('express');
        var app = express();

        //Add a handler for /claims POST
        app.post('/claims', function(req,res) {
            console.log('request received...');
            res.status(201).end();
        });

        app.listen(8000, function(){
            //Create a JSON Payload with 
            // - firstname, middlename, lastname, dob, gender, title, nino, bank account, passport number
            //
            var payload = {
                firstName : 'John',
                middleName : 'Joe',
                lastName : 'Doe',
                dob : '01/01/1964',
                gender : 'male',
                title : 'Dr',
                nino : 'AB123456A',
                bankAccount : {
                    sortCode : '233512',
                    accountNumber : '12345678',
                    name : 'barclays'
                },
                address : {
                    line1 : 'Somehouse',
                    line2 : 'Someplace',
                    townCity : 'Somewhere',
                    postcode : 'XX1 1XX'
                },
                passportNumber : '123456789'

            };
            // POST the payload to /claims
            rest.post('http://localhost:8000/claims', {
                data : payload
            }).on('complete',function(data,response) {
                should.exist(response);
                should(response.statusCode).equal(201); 
    //          var claimURL = data.actions.info.url;
                done();
            });


            // Find the link to see your claim status
            // GET the status of the claim /claims/:id
            //
            // Assert on the following statuses being present
            // 1. Submitted
            // 2. Registered
            // 3. Verified
            // 4. EligibilityEvaluated
            // 5. AwardCalculated
            // 6. Payment Calculated
            // 7. PaymentMade
            // 8. StatementGenerated
            // 9. NotificationSent
        });
    });
});
