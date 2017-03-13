const fs = require('fs');
const path = require('path');
const BloomFilter = require('./BloomFilter');

class Checker {
	constructor(word)
	{
		this.cache = path.join(path.resolve(__dirname, '..', 'cache'), 'en_50k.txt'); // path to cache directory that contains data
		this.word = word;
		this.dictionary;
	}

	loadDictionary(cb)
	{
		fs.readFile(this.cache, 'utf8', (err, data) => { //read file
			if(err) console.error(new Error(err));

			this.dictionary = data;

			cb();
		});
	}

	run()
	{
		this.loadDictionary(() => {
			let bloom = new BloomFilter();
			console.log(this.dictionary);
		});
	}
}

module.exports = Checker;