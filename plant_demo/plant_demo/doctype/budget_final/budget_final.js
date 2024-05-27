// Copyright (c) 2024, linda and contributors
// For license information, please see license.txt

/*frappe.ui.form.on('Budget Final', {
	refresh(frm) {
		// your code here
	}
})

*/





frappe.ui.form.on('Budget Final', {
    before_save: function(frm) {
        // Calculate amounts before saving
        calculateAmounts(frm);
        calculateAmounts1(frm);
        // Calculate balance payment before saving
       // calculateBalancePayment(frm);
        
        // Set the amount and balance payment in their respective fields
       // setAmountAndBalancePayment(frm);
        
        //Set budget final amount
        calculateBudgetAvailable(frm);
        
        //set fund final amount
        calculateFundAvailable(frm);
        displayBankBalance(frm);
        calculateBalanceAmountAvailable(frm);
    }
});

function calculateAmounts(frm) {
    // Iterate over each row in the child table
    frm.doc.budget_details.forEach(function(row) {
        // Calculate the amount for the row
        row.amount = row.qty * row.rate;
        // Set the calculated amount in the row
        //frappe.model.set_value(row.doctype, row.name, 'amount', amount);
        row.balance_payment = row.amount - row.advance_payment;
    });

    // Refresh the form to update the displayed amounts
    frm.refresh_field('budget_details');
}

function calculateAmounts1(frm) {
    // Iterate over each row in the child table
    frm.doc.fund_details.forEach(function(row) {
        // Calculate the amount for the row
        //row.amount = row.qty * row.rate;
        // Set the calculated amount in the row
        //frappe.model.set_value(row.doctype, row.name, 'amount', amount);
        row.balance_amount = row.total_amount - row.received_amount;
    });

    // Refresh the form to update the displayed amounts
    frm.refresh_field('fund_details');
}


function calculateBudgetAvailable(frm) {
    // Initialize an object to store the total balance payments for each organization
    var organizationBalance = {};

    // Iterate over each row in the 'Budget Details' child table
    frm.doc.budget_details.forEach(function(row) {
        // Check if the organization already exists in the object, if not, initialize it to 0
        if (!organizationBalance[row.organisation]) {
            organizationBalance[row.organisation] = 0;
        }

        // Add the 'balance_payment' to the total for the organization
        organizationBalance[row.organisation] += row.balance_payment;
    });

    // Iterate over each row in the 'Fund Plan' child table
    frm.doc.fund_plan.forEach(function(row) {
        // Update the 'budget_available' field with the total balance payment for the organization
        if (organizationBalance[row.organisation]) {
            frappe.model.set_value(row.doctype, row.name, 'total_payment', organizationBalance[row.organisation]);
        }
    });

    // Save the changes
    frm.save();
}


function calculateFundAvailable(frm) {
    // Initialize an object to store the total balance payments for each organization
    var organizationBalanceAmt = {};

    // Iterate over each row in the 'Budget Details' child table
    frm.doc.fund_details.forEach(function(row) {
        // Check if the organization already exists in the object, if not, initialize it to 0
        if (!organizationBalanceAmt[row.organisation]) {
            organizationBalanceAmt[row.organisation] = 0;
        }

        // Add the 'balance_payment' to the total for the organization
        organizationBalanceAmt[row.organisation] += row.balance_amount;
    });

    // Iterate over each row in the 'Fund Plan' child table
    frm.doc.fund_plan.forEach(function(row) {
        // Update the 'budget_available' field with the total balance payment for the organization
        if (organizationBalanceAmt[row.organisation]) {
            frappe.model.set_value(row.doctype, row.name, 'total_receipt', organizationBalanceAmt[row.organisation]);
        }
    });

    // Save the changes
    frm.save();
}



function displayBankBalance(frm)
{
     frm.doc.bank_balance_details.forEach(function(row2) {
        var lotNumberMatched = false; // Flag to track if a matching lot number was found

        frm.doc.fund_plan.forEach(function(row) {
            if (row2.organisation === row.organisation) {
                
                row.bank_balance_available = row2.bank_balance_available;
            }
        });
     });
      frm.refresh_field('bank_balance_details');
    frm.refresh_field('fund_plan');
    frm.refresh_field('bank_balance_available');
}

function calculateBalanceAmountAvailable(frm){
    frm.doc.fund_plan.forEach(function(row) {
        
        row.balance_amount_available = (row.bank_balance_available + row.total_receipt) - row.total_payment;
    });
    
    frm.refresh_field('fund_plan');
    frm.refresh_field('balance_amount_available');
}
