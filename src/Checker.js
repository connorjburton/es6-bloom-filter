const fs = require('fs');
const path = require('path');
const BloomFilter = require('./BloomFilter');

class Checker {
	constructor(word, debug)
	{
		this.cache = path.join(path.resolve(__dirname, '..', 'cache'), 'en_50k-real.txt'); // path to cache directory that contains data
		this.word = word;
		this.dictionary;
		this.debug = typeof debug !== 'undefined';
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
			let bloom = new BloomFilter(this.getDictionaryWords(), this.debug);
			let exists = bloom.checkItem(this.word);

			console.info('\x1b[36m%s\x1b[0m', this.word + ' ' + (exists ? 'is' : 'is not') + ' in the dictionary');
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