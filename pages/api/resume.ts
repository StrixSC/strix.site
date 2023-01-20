import fs from 'fs';

const filename = '/resume';
export default async function api(req: NextFetchRequestConfig, res: any) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.write(fs.readFileSync(filename, 'utf-8'));
    res.end();
}
