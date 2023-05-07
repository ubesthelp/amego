import { Amego } from '../index';
import { NO_BUYER_IDENTIFIER } from '../invoice';

describe('add', () => {
  test('1 + 2 = 3', async () => {
    const amego = new Amego('12345678', 'sHeq7t8G1wiQvhAuIM27');
    const result = await amego.invoice({
      orderId: '12345',
      buyerIdentifier: NO_BUYER_IDENTIFIER,
      buyerName: 'Buyer',
      productItems: [
        {
          description: 'AAA',
          quantity: 1,
          unitPrice: 10,
          amount: 10,
          taxType: 'TAXABLE',
        },
      ],
      salesAmount: 10,
      freeTaxSalesAmount: 0,
      zeroTaxSalesAmount: 0,
      taxRate: 5,
      totalAmount: 10,
    });
  });
});
