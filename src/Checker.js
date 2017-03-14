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

			this.dictionary = data.split('\n').map((value) => {
				value = value.split(' ');
				return {
					word: value[0],
					frequency: value[1]
				};
			});

			cb();
		});
	}

	run()
	{
		this.loadDictionary(() => {
			let bloom = new BloomFilter(this.getDictionaryWords());
		});
	}

	getDictionaryWords()
	{
		let arr = [];
		this.dictionary.forEach(value => arr.push(value.word));
		return arr;
	}
}

module.exports = Checker;