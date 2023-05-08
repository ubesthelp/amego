import { CommonResponse } from './commonResponse';

/** 商品 */
interface ProductItem {
  /** 原發票號碼 */
  OriginalInvoiceNumber: string;
  /** 原發票日期，Ymd */
  OriginalInvoiceDate: string;
  /** 品名，不可超過 256 字 */
  OriginalDescription: string;
  /** 數量 */
  Quantity: number;
  /** 單價(不含稅) */
  UnitPrice: number;
  /** 小計(不含稅) */
  Amount: number;
  /** 稅金 */
  Tax: number;
  /** 課稅別：1 - 應稅，2 - 零稅率，3 - 免稅 */
  TaxType: 1 | 2 | 3;
}

/** 開立折讓请求 */
interface CreateAllowanceRequest {
  /** 折讓單編號，不可重複 */
  AllowanceNumber: string;
  /** 折讓單日期，Ymd */
  AllowanceDate: string;
  /** 折讓單種類，1:買方開立折讓證明單 2:賣方折讓證明通知單 */
  AllowanceType: 1 | 2;
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
  /** 商品陣列，最多 999 筆 */
  ProductItem: ProductItem[];
  /** 營業稅額 */
  TaxAmount: number;
  /** 金額合計(不含稅) */
  TotalAmount: number;
}

/** 開立折讓请求 */
export type CreateAllowancesRequest = CreateAllowanceRequest[];

/** 作废折讓请求 */
interface CancelAllowanceRequest {
  /** 折讓單編號 */
  CancelAllowanceNumber: string;
}

/** 作废折讓请求 */
export type CancelAllowancesRequest = CancelAllowanceRequest[];

/** 获取折讓單上傳狀態请求 */
interface GetAllowanceStatusRequest {
  /** 折讓單號碼 */
  AllowanceNumber: string;
}

/** 获取折讓單上傳狀態请求 */
export type GetAllowancesStatusRequest = GetAllowanceStatusRequest[];

/** 折讓單上傳狀態 */
interface AllowanceStatus {
  /** 折讓單編號 */
  allowance_number: string;
  /**
   * 折讓單類型
   * NOT_FOUND：查無折讓單
   * D0401：折讓單開立
   * D0501：折讓單作廢
   * TYPE_ERROR：類型錯誤
   */
  type: 'NOT_FOUND' | 'D0401' | 'D0501' | 'TYPE_ERROR';
  /** 發票狀態：1 - 待處理，2 - 上傳中，3 - 已上傳，31 - 處理中，32 - 處理完成／待確認，91 - 錯誤，99 - 完成 */
  status: 1 | 2 | 3 | 31 | 32 | 91 | 99;
  /** 營業稅額 */
  tax_amount: number;
  /** 發票金額 */
  total_amount: number;
}

/** 获取折讓單上傳狀態响应 */
export interface GetAllowancesStatusResponse extends CommonResponse {
  /** 發票號碼的對應上傳狀態 */
  data?: AllowanceStatus[];
}
