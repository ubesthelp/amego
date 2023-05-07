/** 开立发票结果 */
export interface Result {
  /** 0 代表正確，其他代碼請參考錯誤代碼 */
  code: number;
  /** 錯誤訊息 */
  msg: string;
}
