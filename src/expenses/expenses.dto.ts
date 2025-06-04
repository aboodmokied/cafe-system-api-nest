class AddExpensesDto {
    
  type: 'SUPPLIER';

  date: Date;

  amount: number;

  userId?: number;
}

export class AddSupplierExpensesDto extends AddExpensesDto {

  type: 'SUPPLIER';

  supplierBillingId: number;

  supplierId: number;
}