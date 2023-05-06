/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosInstance } from 'axios';
import { InvoiceParameters, ProductItem } from './invoice';
import md5 from './md5';
import capitalize from './capitalize';

type AnyObject = Record<string, unknown>;

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

  private async post(path: string, obj: AnyObject) {
    const data = JSON.stringify(obj);
    const time = Math.round(Date.now() / 1000);
    const sign = md5(`${data}${time}${this.appKey}`);
    const response = await this.net.post<AnyObject>(path, {
      invoice: this.id,
      data,
      time,
      sign,
    });
    return response.data;
  }

  /**
   * 开立发票。
   * @param params 开立发票参数
   */
  async invoice(params: InvoiceParameters) {
    const obj = Object.entries(params).reduce<AnyObject>((prev, [key, value]) => {
      let k = capitalize(key);
      let v = value;

      switch (key) {
        case 'productItems':
          k = 'ProductItem';
          v = (value as ProductItem[]).map((item) => {

          });
          break;

        default:
          break;
      }

      return {
        ...prev,
        [k]: v,
      };
    }, {});

    const reply = await this.post('/json/c0401', obj);
    console.log('Reply', reply);
  }
}
