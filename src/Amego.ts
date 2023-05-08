/* eslint-disable no-console */
import axios, { AxiosInstance } from 'axios';
import { InvoiceRequest, InvoiceResponse } from './invoice';
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
   * @param params 开立发票请求
   */
  async invoice(params: InvoiceRequest) {
    return this.post<InvoiceRequest, InvoiceResponse>('/json/c0401', params);
  }
}
