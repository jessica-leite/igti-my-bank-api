import express from 'express';
import fs from 'fs';
import { promisify } from 'util';

const app = express();
const exists = promisify(fs.exists);
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);

global.fileName = 'accounts.json';

app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'));

app.post('/account', async (req, res) => {
    try {
        let account = req.body;
        const data = JSON.parse(await readFile(global.fileName, 'utf8'));
        account = { id: data.nextId++, ...account };
        data.accounts.push(account);
        await writeFile(global.fileName, JSON.stringify(data));

        res.end();
    } catch (err) {
        res.status(400).send({ error: err.message });
    }
});


app.listen(3000, async () => {
    try {
        const fileExists = await exists(global.fileName);
        if (!fileExists) {
            const initialJson = {
                nextId: 1,
                accounts: []
            };
            await writeFile(global.fileName, JSON.stringify(initialJson));
        }
    } catch (err) {
        logger.error(err);
    }
});