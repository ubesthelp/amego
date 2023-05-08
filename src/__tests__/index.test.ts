import Amego from '../index';
import { NO_BUYER_IDENTIFIER } from '../invoice';

const amego = new Amego('12345678', 'sHeq7t8G1wiQvhAuIM27');

describe('Invoicing', () => {
  test('Create', async () => {
    const result = await amego.createInvoice({
      OrderId: '12345',
      BuyerIdentifier: NO_BUYER_IDENTIFIER,
      BuyerName: 'Buyer',
      ProductItem: [
        {
          Description: 'AAA',
          Quantity: 1,
          UnitPrice: 10,
          Amount: 10,
          TaxType: 1,
        },
      ],
      SalesAmount: 10,
      FreeTaxSalesAmount: 0,
      ZeroTaxSalesAmount: 0,
      TaxType: 1,
      TaxRate: '0.05',
      TaxAmount: 0,
      TotalAmount: 10,
    });
    expect(result.code).toEqual(0);
  });

  test('Query', async () => {
    const result = await amego.queryInvoice({ type: 'order', order_id: '12345' });
    expect(result.code).toEqual(0);
  });
});

describe('Allowance', () => {
  test('Create', async () => {
    const result = await amego.createAllowance([{
      AllowanceNumber: '12345',
      AllowanceDate: '20230508',
      AllowanceType: 2,
      BuyerIdentifier: NO_BUYER_IDENTIFIER,
      BuyerName: 'Buyer',
      ProductItem: [
        {
          OriginalInvoiceNumber: 'AB42345910',
          OriginalInvoiceDate: '20230507',
          OriginalDescription: 'AAA',
          Quantity: 1,
          UnitPrice: 10,
          Amount: 9,
          TaxType: 1,
          Tax: 0,
        },
      ],
      TaxAmount: 0,
      TotalAmount: 9,
    }]);
    expect(result.code).toEqual(0);
  });

  test('Cancel', async () => {
    const result = await amego.cancelAllowances(['12345']);
    expect(result.code).toEqual(0);
  });

  test('Query', async () => {
    const result = await amego.getAllowancesStatus(['12345']);
    expect(result.code).toEqual(0);
  });
});
