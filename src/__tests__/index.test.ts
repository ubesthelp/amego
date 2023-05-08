import { Amego } from '../index';
import { NO_BUYER_IDENTIFIER } from '../invoice';

describe('add', () => {
  test('1 + 2 = 3', async () => {
    const amego = new Amego('12345678', 'sHeq7t8G1wiQvhAuIM27');
    const result = await amego.invoice({
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
});
