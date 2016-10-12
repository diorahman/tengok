const Promise = require('bluebird');
const fs = require('fs');

Promise.promisifyAll(fs);

class Tail {
    constructor(filename, options) {
        this.filename = filename;
        this.pos = 0;
    }

    async read(start, end) {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(this.filename, { start, end, encoding: 'utf-8' });
            let result = '';
            stream.on('data', (data) => {
                result += data;
            });
            stream.on('end', () => {
                resolve(result);
            });
        });
    }

    async watch(vector) {
        const stats = await fs.statAsync(this.filename);
        this.pos = stats.size;

        fs.watch(this.filename, async (e) => {
            if (e === 'change') {
                const stats = await fs.statAsync(this.filename);
                if (stats.size > this.pos) {
                    const data = await this.read(this.pos, stats.size);
                    this.pos = stats.size;
                    vector.send(data);
                }
            }
        });
    }
}

module.exports = Tail;
