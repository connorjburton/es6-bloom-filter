class BloomFilter {
	constructor(items, input) {
		this.input = input;
		this.bucket = Buffer.alloc(items.length * 15); //~0.1% false positive rate
	}
}

module.exports = BloomFilter;