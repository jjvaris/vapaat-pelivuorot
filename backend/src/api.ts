import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';

const client = axios.create({ timeout: 15000 });

export const getByProxy = (url: string) =>
  client.get(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);

export const get = <T = any>(url: string) => client.get<T>(url);

export const post = <T = any>(url: string, body?: any) =>
  client.post<T>(url, body);

export const scrape = async (url: string) =>
  cheerio.load((await get(url)).data);

export const fake = async (path: string) => cheerio.load(fs.readFileSync(path));

export const fakeJson = async (path: string) =>
  JSON.parse(fs.readFileSync(path, 'utf-8'));
