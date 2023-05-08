/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios';
import { CommonResponse } from './commonResponse';
import {
  CancelInvoicesRequest,
  DownloadInvoiceFileRequest,
  DownloadInvoiceFileResponse,
  GetInvoicesStatusRequest,
  GetInvoicesStatusResponse,
  InvoiceRequest,
  InvoiceResponse,
  QueryInvoiceRequest,
  QueryInvoiceResponse,
} from './invoice';
import md5 from './md5';

/**
 * 光贸 API 类。
 */
export default class Amego {
  private readonly id: string;

  private readonly appKey: string;

  private net: AxiosInstance;

  /**
   * 构建光贸 API 实例。
   * @param id 公司统一编号
   * @param appKey App Key
   */
  constructor(id: string, appKey: string) {
    this.id = id;
    this.appKey = appKey;
    this.net = axios.create({
      baseURL: 'https://invoice-api.amego.tw',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  private async post<Request, Response>(path: string, req: Request) {
    console.debug(`Posting to ${path}`, req);
    const data = JSON.stringify(req);
    const time = Math.round(Date.now() / 1000);
    const sign = md5(`${data}${time}${this.appKey}`);
    const response = await this.net.post<Response>(path, {
      invoice: this.id,
      data,
      time,
      sign,
    });
    console.debug('Response', response.data);
    return response.data;
  }

  /**
   * 开立发票。
   * @param request 开立发票请求
   * @returns 执行结果
   */
  async invoice(request: InvoiceRequest) {
    return this.post<InvoiceRequest, InvoiceResponse>('/json/c0401', request);
  }

  /**
   * 作廢已開立的發票
   * @param invoiceNumbers 發票號碼
   * @returns 执行结果
   */
  async cancelInvoices(invoiceNumbers: string[]) {
    return this.post<CancelInvoicesRequest, CommonResponse>('/json/c0501', invoiceNumbers.map((n) => ({
      CancelInvoiceNumber: n,
    })));
  }

  /**
   * 获取發票的上傳狀態
   * @param invoiceNumbers 發票號碼
   * @returns 执行结果
   */
  async getInvoicesStatus(invoiceNumbers: string[]) {
    return this.post<GetInvoicesStatusRequest, GetInvoicesStatusResponse>('/json/invoice_status', invoiceNumbers.map((n) => ({
      InvoiceNumber: n,
    })));
  }

  /**
   * 查詢發票內容
   * @param request 查詢發票內容请求
   * @returns 执行结果
   */
  async queryInvoice(request: QueryInvoiceRequest) {
    return this.post<QueryInvoiceRequest, QueryInvoiceResponse>('/json/invoice_query', request);
  }

  /**
   * 下載發票檔案(PDF格式)。載具發票中獎後才可下載，非載具發票可無限次下載。
   * @param request 下載發票檔案请求
   * @returns 执行结果
   */
  async downloadInvoiceFile(request: DownloadInvoiceFileRequest) {
    return this.post<DownloadInvoiceFileRequest, DownloadInvoiceFileResponse>('/json/invoice_file', request);
  }
}
