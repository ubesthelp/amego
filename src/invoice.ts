/** 沒有買方統一編號 */
export const NO_BUYER_IDENTIFIER = '0000000000' as const;

/** 載具類別：手機條碼 3J0002，自然人憑證條碼 CQ0001，光貿會員載具 amego */
export const carrierTypes = ['3J0002', 'CQ0001', 'amego'] as const;
/** 載具類別：手機條碼 3J0002，自然人憑證條碼 CQ0001，光貿會員載具 amego */
export type CarrierType = typeof carrierTypes[number];

/** 課稅別：應稅，零稅率，免稅 */
export const taxTypes = ['TAXABLE', 'ZERO', 'FREE'] as const;
/** 課稅別：應稅，零稅率，免稅 */
export type TaxType = typeof taxTypes[number];

/** 通關方式註記：非經海關出口，經海關出口 */
export const customsClearanceMarks = ['NON_EXPORT', 'EXPORT'] as const;
/** 通關方式註記：非經海關出口，經海關出口 */
export type CustomsClearanceMark = typeof customsClearanceMarks[number];

/** 熱感應機型號 */
export const printerTypes = ['Star mC-Print3', '芯燁 XP-Q90EC'] as const;
/** 熱感應機型號 */
export type PrinterType = typeof printerTypes[number];

/** 熱感應機編碼 */
export const printerEncodings = ['Big5', 'GBK'] as const;
/** 熱感應機編碼 */
export type PrinterEncoding = typeof printerEncodings[number];

/** 商品 */
export interface ProductItem {
  /** 品名，不可超過 256 字 */
  description: string;
  /** 數量 */
  quantity: number;
  /** 單價（含稅） */
  unitPrice: number;
  /** 小計 */
  amount: number;
  /** 備註，不可超過 40 字 */
  remark?: string;
  /** 課稅別 */
  taxType: TaxType;
}

/** 开立发票参数 */
export interface InvoiceParameters {
  /** 訂單編號，不可重複，不可超過 40 字 */
  orderId: string;
  /** 買方統一編號，買方統一編號，沒有則填入 0000000000 */
  buyerIdentifier: string;
  /** 買方名稱。若是打統編的發票，如不能填入買方公司名稱，則請填買方統一編號 */
  buyerName: string;
  /** 買方地址 */
  buyerAddress?: string;
  /** 買方電話 */
  buyerTelephoneNumber?: string;
  /** 買方電子信箱，寄送通知信用。若不希望寄送，留空即可 */
  buyerEmailAddress?: string;
  /** 總備註，不可超過 200 字 */
  mainRemark?: string;
  /** 載具類別 */
  carrierType?: CarrierType;
  /** 載具明碼 */
  carrierId1?: string;
  /** 載具隱碼 */
  carrierId2?: string;
  /** 捐贈碼 */
  npoban?: string;
  /** 商品陣列，最多 999 筆 */
  productItems: ProductItem[];
  /** 應稅銷售額合計 */
  salesAmount: number;
  /** 免稅銷售額合計 */
  freeTaxSalesAmount: number;
  /** 零稅率銷售額合計 */
  zeroTaxSalesAmount: number;
  /** 稅率，為 5% 時本欄位值為 5 */
  taxRate: number;
  /** 總計 */
  totalAmount: number;
  /** 通關方式註記，若為零稅率發票，則此欄位為必填。 */
  customsClearanceMark?: CustomsClearanceMark;
  /** 品牌名稱 */
  brandName?: string;
  /** 熱感應機型號 */
  printerType?: PrinterType;
  /** 熱感應機編碼，Star mC-Print3 僅支援 Big5（預設），芯燁XP-Q90EC 支援 Big5、GBK（預設） */
  printerEncoding?: PrinterEncoding;
  /** 熱感應機是否列印明細，打統編一律列印明細，目前僅支援芯燁 XP-Q90EC 可以設定此參數 */
  printDetails?: boolean;
}

/** 开立发票结果 */
export interface InvoiceResult {
  /** 0 代表正確，其他代碼請參考錯誤代碼 */
  code: number;
  /** 錯誤訊息 */
  msg: string;
  /** 發票號碼，正確才會回傳 */
  invoiceNumber?: string;
  /** 發票開立時間，正確才會回傳 */
  invoiceTime?: Date;
  /** 隨機碼，正確才會回傳 */
  randomNumber?: string;
  /** 電子發票的條碼內容，正確才會回傳 */
  barcode?: string;
  /** 電子發票的左側 QRCODE 內容，正確才會回傳 */
  qrcodeLeft?: string;
  /** 電子發票的右側 QRCODE 內容，正確才會回傳 */
  qrcodeRight?: string;
  /** 列印格式字串，正確且需要列印才會回傳 */
  base64Data?: string;
}

export const getTaxType = (params: InvoiceParameters) => {
  const { taxType } = params.productItems[0];

  for (let i = 1; i < params.productItems.length; i++) {
    const element = params.productItems[i];

    if (element.taxType !== taxType) {
      return 9;
    }
  }

  if (taxType === 'TAXABLE' && params.taxRate !== 5) {
    return 4;
  }

  return taxTypes.indexOf(taxType) + 1;
};

export const getTaxAmount = (params: InvoiceParameters) => {
  const total = params.productItems.reduce((prev, item) => prev + item.amount, 0);
  return Math.round(total - total / (1 + params.taxRate / 100));
};
