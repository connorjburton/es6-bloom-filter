const farmhash = require('farmhash');

class BloomFilter {
	constructor(items, debug)
	{
		const BITS_PER_ITEM = 15; //~0.1% false positive rate
		this.m = Buffer.alloc(items.length * BITS_PER_ITEM); // setup bit array
		this.k = Math.ceil(BITS_PER_ITEM * 0.7); // amount of hash functions we need to use
		this.seeds = [];
		this.items = items;
		this.debug = debug;

		this.setSeeds();
		this.insertItems();
	}

	get time()
	{
		let hrTime = process.hrtime()
		return hrTime[1];
	}

	setSeeds()
	{
		for(let i = 0; i <= this.k; i++) this.seeds.push(this.time);
	}
	
	insertItems()
	{
		if(this.debug) console.log('Total buffer size: ' + this.m.length.toLocaleString() + ' bits');

		let collisions = 0;
		this.items.forEach(value => {
			let overlap = 0;
			this.getBufferIndices(value).forEach(index => {
				if(this.m[index] === 1) overlap++;
				this.m[index] = 1;
			});
			if(overlap === this.k) collisions++;
		});

		if(this.debug) console.log('Total collisions: ' + collisions + ' bits');
		if(this.debug) console.log('Collision Rate: ' + collisions / this.m.length + '% (chance of false positive)');
	}

	checkItem(item)
	{
		let count = -1;
		this.getBufferIndices(item).forEach(index => {
			if(this.m[index] === 1) count++;
		});

		return (count === this.k);
	}

	getBufferIndices(value)
	{
		let indicies = [];

		this.seeds.forEach(seed => indicies.push(farmhash.hash32WithSeed(value, seed) % this.m.length));

		return indicies;
	}
}

module.exports = BloomFilter;