/** 公共响应结构 */
export interface CommonResponse {
  /** 0 代表正確，其他代碼請參考錯誤代碼 */
  code: number;
  /** 錯誤訊息 */
  msg: string;
}
