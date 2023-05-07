/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosInstance } from 'axios';
import { capitalize, capitalizeObject } from './capitalize';
import {
  InvoiceParameters, InvoiceResult, ProductItem, getTaxAmount, getTaxType,
} from './invoice';
import md5 from './md5';

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
    console.debug(`Posting to ${path}`, obj);
    const data = JSON.stringify(obj);
    const time = Math.round(Date.now() / 1000);
    const sign = md5(`${data}${time}${this.appKey}`);
    const response = await this.net.post<AnyObject>(path, {
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
   * @param params 开立发票参数
   */
  async invoice(params: InvoiceParameters) {
    const taxType = getTaxType(params);
    const capitalized = capitalizeObject(params);
    const data = Object.entries(capitalized).reduce<AnyObject>((prev, [key, value]) => {
      let k = key;
      let v = value;

      switch (key) {
        case 'ProductItems':
          k = 'ProductItem';
          v = (value as ProductItem[]).map((item) => {
            const p = capitalizeObject(item) as AnyObject;

            switch (p.TaxType) {
              case 'TAXABLE':
                p.TaxType = 1;
                break;
              case 'ZERO':
                p.TaxType = 2;
                break;
              case 'FREE':
                p.TaxType = 3;
                break;
              default:
                break;
            }

            return p;
          });
          break;

        case 'TaxType':
          v = taxType;
          break;

        case 'TaxRate':
          switch (taxType) {
            case 1:
            case 9:
              v = '0.05';
              break;
            case 2:
            case 3:
              v = '0';
              break;
            case 4:
            default:
              v = (value as number / 100).toFixed(2);
              break;
          }
          break;

        default:
          break;
      }

      return {
        ...prev,
        [k]: v,
      };
    }, { TaxType: taxType, TaxAmount: getTaxAmount(params) });

    const reply = await this.post('/json/c0401', data);
    return reply as unknown as InvoiceResult;
  }
}
