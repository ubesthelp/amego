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
export interface CreateInvoiceRequest {
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
  /** 載具類別：手機條碼 3J0002，自然人憑證條碼 CQ0001，光貿會員載具 amego */
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
export interface CreateInvoiceResponse extends CommonResponse {
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

/** 作废发票请求 */
interface CancelInvoiceRequest {
  /** 發票號碼 */
  CancelInvoiceNumber: string;
}

/** 作废发票请求 */
export type CancelInvoicesRequest = CancelInvoiceRequest[];

/** 获取發票上傳狀態请求 */
interface GetInvoiceStatusRequest {
  /** 發票號碼 */
  InvoiceNumber: string;
}

/** 获取發票上傳狀態请求 */
export type GetInvoicesStatusRequest = GetInvoiceStatusRequest[];

/** 發票上傳狀態 */
interface InvoiceStatus {
  /** 發票號碼 */
  invoice_number: string;
  /** 發票類型：NOT_FOUND - 查無發票，C0401 - 發票開立，C0501 - 發票作廢，C0701 - 發票註銷，TYPE_ERROR - 類型錯誤 */
  type: 'NOT_FOUND' | 'C0401' | 'C0501' | 'C0701' | 'TYPE_ERROR';
  /** 發票狀態：1 - 待處理，2 - 上傳中，3 - 已上傳，31 - 處理中，32 - 處理完成／待確認，91 - 錯誤，99 - 完成 */
  status: 1 | 2 | 3 | 31 | 32 | 91 | 99;
  /** 發票金額 */
  total_amount: number;
}

/** 获取發票上傳狀態响应 */
export interface GetInvoicesStatusResponse extends CommonResponse {
  /** 發票號碼的對應上傳狀態 */
  data?: InvoiceStatus[];
}

/** 按订单编号查询发票内容 */
interface QueryInvoiceByOrderId {
  /** 查詢類型 */
  type: 'order';
  /** 訂單編號，不可超過40字。以發票日期為主，只能查詢180天內的發票 */
  order_id: string;
}

/** 按发票号码查询发票内容 */
interface QueryInvoiceByInvoiceNumber {
  /** 查詢類型 */
  type: 'invoice';
  /** 發票號碼，不可超過40字。以發票日期為主，只能查詢180天內的發票 */
  invoice_number: string;
}

/** 查詢發票內容请求 */
export type QueryInvoiceRequest = QueryInvoiceByOrderId | QueryInvoiceByInvoiceNumber;

/** 查詢發票內容响应 */
export interface QueryInvoiceResponse extends CommonResponse {
  /** 正確才會回傳 */
  data?: {
    /** 發票號碼 */
    invoice_number: string;
    /**
     * 發票類型
     *
     * C0401：B2C 存證發票開立
     * C0501：B2C 存證發票作廢
     * C0701：B2C 存證發票註銷
     * A0401：B2B 存證發票開立
     * A0501：B2B 存證發票作廢
     * A0101：B2B 交換發票開立
     * A0102：B2B 交換發票開立(接收確認)
     * A0201：B2B 交換發票作廢
     * A0202：B2B 交換發票作廢(接收確認)
     * A0301：B2B 交換發票退回
     * A0302：B2B 交換發票退回(接收確認)
     */
    invoice_type: 'C0401' | 'C0501' | 'C0701' | 'A0401' | 'A0501' | 'A0101' | 'A0102' | 'A0201' | 'A0202' | 'A0301' | 'A0302';
    /** 發票狀態：1 - 待處理，2 - 上傳中，3 - 已上傳，31 - 處理中，32 - 處理完成／待確認，91 - 錯誤，99 - 完成 */
    invoice_status: 1 | 2 | 3 | 31 | 32 | 91 | 99;
    /** 發票日期 格式：YYYYMMDD，例如：20161028 */
    invoice_date: number;
    /** 發票時間 HH:mm:ss */
    invoice_time: string;
    /** 買方統一編號，沒有統一編號會回傳 0000000000 */
    buyer_identifier: string;
    /** 買方名稱 */
    buyer_name: string;
    /** 買方郵遞區號 */
    buyer_zip: number;
    /** 買方地址 */
    buyer_address: string;
    /** 買方電話 */
    buyer_telephone_number: string;
    /** 買方信箱 */
    buyer_email_address: string;
    /** 應稅銷售額合計 */
    sales_amount: number;
    /** 免稅銷售額合計 */
    free_tax_sales_amount: number;
    /** 零稅率銷售額合計 */
    zero_tax_sales_amount: number;
    /** 課稅別：1 - 應稅，2 - 零稅率，3 - 免稅，4 - 應稅(特種稅率)，9 - 混合應稅與免稅或零稅率(限訊息C0401使用) */
    tax_type: 1 | 2 | 3 | 4 | 9;
    /** 稅率，為5%時本欄位值為0.05 */
    tax_rate: string;
    /** 營業稅額 */
    tax_amount: number;
    /** 總計 */
    total_amount: number;
    /** 列印註記 */
    print_mark: string;
    /** 隨機碼 */
    random_number: string;
    /** 總備註 */
    main_remark: string;
    /** 通關方式註記，若為非零稅率發票，則此欄位為 0。1 - 非經海關出口，2 - 經海關出口 */
    customs_clearance_mark: 0 | 1 | 2;
    /** 載具類別：手機條碼 3J0002，自然人憑證條碼 CQ0001，光貿會員載具 amego */
    carrier_type: '' | '3J0002' | 'CQ0001' | 'amego';
    /** 載具明碼 */
    carrier_id1: string;
    /** 載具隱碼 */
    carrier_id2: string;
    /** 捐贈碼 */
    npoban: string;
    /** 作廢時間，Unix 時間戳記 */
    cancel_date: number;
    /** 獎項代碼，請參考 [獎項定義] API */
    invoice_lottery: number;
    /** 訂單編號 */
    order_id: string;
    /** 明細的單價及小計為 0:未稅價 1:含稅價 */
    detail_vat: 0 | 1;
    /** 明細的小計 0:直接加總 1:先四捨五入再加總 */
    detail_amount_round: 0 | 1;
    /** 建立時間，Unix 時間戳記 */
    create_date: number;
    /** 商品陣列，最多 999 筆 */
    product_item: {
      /** 課稅別：1 - 應稅，2 - 零稅率，3 - 免稅 */
      tax_type: 1 | 2 | 3;
      /** 品名，不可超過 256 字 */
      description: string;
      /** 單價，可到小數 7 位數 */
      unit_price: number;
      /** 數量，可到小數 7 位數 */
      quantity: number;
      /** 單位 */
      unit?: string;
      /** 小計，可到小數 7 位數 */
      amount: number;
      /** 備註，不可超過 40 字 */
      remark?: string;
    }[];
    /** 未處理的排程陣列，例如：等待改成[發票作廢] */
    wait: {
      /**
       * 改成發票類型
       *
       * C0401：B2C 存證發票開立
       * C0501：B2C 存證發票作廢
       * C0701：B2C 存證發票註銷
       * A0401：B2B 存證發票開立
       * A0501：B2B 存證發票作廢
       * A0101：B2B 交換發票開立
       * A0102：B2B 交換發票開立(接收確認)
       * A0201：B2B 交換發票作廢
       * A0202：B2B 交換發票作廢(接收確認)
       * A0301：B2B 交換發票退回
       * A0302：B2B 交換發票退回(接收確認)
       */
      invoice_type: 'C0401' | 'C0501' | 'C0701' | 'A0401' | 'A0501' | 'A0101' | 'A0102' | 'A0201' | 'A0202' | 'A0301' | 'A0302';
      /** 建立時間，Unix 時間戳記 */
      create_date: number;
    }[];
  };
}

/** 下載發票檔案请求 */
export type DownloadInvoiceFileRequest = QueryInvoiceRequest & {
  /**
   * 下載樣式，預設為 0
   * 有打統編發票，四種樣式 0：A4整張 1：A4(地址+A5) 2：A4(A5x2) 3：A5
   * 沒有打統編的發票，一種樣式 0：A4整張(背面兌獎聯，需雙面列印)
   */
  download_style?: 0 | 1 | 2 | 3;
};

/** 下載發票檔案响应 */
export interface DownloadInvoiceFileResponse extends CommonResponse {
  /** 正確才會回傳 */
  data?: {
    /** 檔案連結，連結僅10分鐘有效 */
    file_url: string;
  };
}
