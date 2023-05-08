import { CommonResponse } from './commonResponse';

export const NO_BUYER_IDENTIFIER = '0000000000';

/** 商品 */
interface ProductItem {
  /** 品名，不可超過 256 字 */
  Description: string;
  /** 數量 */
  Quantity: number;
  /** 單價（含稅） */
  UnitPrice: number;
  /** 小計 */
  Amount: number;
  /** 備註，不可超過 40 字 */
  Remark?: string;
  /** 課稅別：1 - 應稅，2 - 零稅率，3 - 免稅 */
  TaxType: 1 | 2 | 3;
}

/** 开立发票请求 */
export interface InvoiceRequest {
  /** 訂單編號，不可重複，不可超過 40 字 */
  OrderId: string;
  /** 買方統一編號，買方統一編號，沒有則填入 0000000000 */
  BuyerIdentifier: string;
  /** 買方名稱。若是打統編的發票，如不能填入買方公司名稱，則請填買方統一編號 */
  BuyerName: string;
  /** 買方地址 */
  BuyerAddress?: string;
  /** 買方電話 */
  BuyerTelephoneNumber?: string;
  /** 買方電子信箱，寄送通知信用。若不希望寄送，留空即可 */
  BuyerEmailAddress?: string;
  /** 總備註，不可超過 200 字 */
  MainRemark?: string;
  /** 載具類別 */
  CarrierType?: '3J0002' | 'CQ0001' | 'amego';
  /** 載具明碼 */
  CarrierId1?: string;
  /** 載具隱碼 */
  CarrierId2?: string;
  /** 捐贈碼 */
  NPOBAN?: string;
  /** 商品陣列，最多 999 筆 */
  ProductItem: ProductItem[];
  /** 應稅銷售額合計 */
  SalesAmount: number;
  /** 免稅銷售額合計 */
  FreeTaxSalesAmount: number;
  /** 零稅率銷售額合計 */
  ZeroTaxSalesAmount: number;
  /** 課稅別：1 - 應稅，2 - 零稅率，3 - 免稅，4 - 應稅(特種稅率)，9 - 混合應稅與免稅或零稅率(限訊息C0401使用) */
  TaxType: 1 | 2 | 3 | 4 | 9;
  /** 稅率，為 5% 時本欄位值為 0.05 */
  TaxRate: string;
  /** 營業稅額 */
  TaxAmount: number;
  /** 總計 */
  TotalAmount: number;
  /** 通關方式註記，若為零稅率發票，則此欄位為必填。1 - 非經海關出口，2 - 經海關出口 */
  CustomsClearanceMark?: 1 | 2;
  /** 品牌名稱 */
  BrandName?: string;
  /** 明細的單價及小計 為 含稅價 或 未稅價，預設為含稅價，0:未稅價 1：含稅價 */
  DetailVat?: 0 | 1;
  /** 明細的小計處理方式，預設為有小數，0:有小數 1:一律四捨五入到整數 */
  DetailAmountRound?: 0 | 1;
  /** 熱感應機型號：1：Star mC-Print3 2：芯燁XP-Q90EC */
  PrinterType?: 1 | 2;
  /** 熱感應機編碼，1：BIG5 2：GBK。Star mC-Print3 僅支援 Big5（預設），芯燁XP-Q90EC 支援 Big5、GBK（預設） */
  PrinterEncoding?: 1 | 2;
  /** 熱感應機是否列印明細，1:列印(預設) 0:不列印。打統編一律列印明細，目前僅支援芯燁 XP-Q90EC 可以設定此參數 */
  PrintDetails?: 0 | 1;
}

/** 开立发票响应 */
export interface InvoiceResponse extends CommonResponse {
  /** 發票號碼，正確才會回傳 */
  invoice_number?: string;
  /** 發票開立時間，Unix 時間戳記，正確才會回傳 */
  invoice_time?: number;
  /** 隨機碼，正確才會回傳 */
  random_number?: string;
  /** 電子發票的條碼內容，正確才會回傳 */
  barcode?: string;
  /** 電子發票的左側 QRCODE 內容，正確才會回傳 */
  qrcode_left?: string;
  /** 電子發票的右側 QRCODE 內容，正確才會回傳 */
  qrcode_right?: string;
  /** 列印格式字串，正確且需要列印才會回傳 */
  base64_data?: string;
}
