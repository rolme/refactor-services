import * as fs from 'fs';
import * as yaml from 'js-yaml';

export const Config: { [key: string]: any } = yaml.safeLoad(
  fs.readFileSync(__dirname + '/../exports.yml', 'utf8'),
) as any;
