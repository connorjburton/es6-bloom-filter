const farmhash = require('farmhash');

class BloomFilter {
	constructor(items, debug)
	{
		const BITS_PER_ITEM = 10; //~0.001% false positive rate
		this.m = Buffer.alloc(items.length * BITS_PER_ITEM); // setup buffer with correct bit length (all values are 0)
		this.k = Math.ceil(this.m.length / items.length * Math.log(2)); // amount of hash functions we need to use
		this.seeds = [];
		this.items = items;
		this.debug = debug;
		this.collisions = 0;

		this.setSeeds();
		this.bulkInsert();
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
	
	bulkInsert()
	{
		if(this.debug) console.time('Bulk Insert');
		if(this.debug) console.log('Total buffer size: ' + this.m.length.toLocaleString() + ' bits');

		this.items.forEach(value => this.insertItem(value));

		if(this.debug) {
			console.log('Total collisions: ' + this.collisions + ' bits');
			console.log('Collision Rate: ' + (this.collisions / this.m.length).toFixed(5) + '% (chance of false positive)');
			console.timeEnd('Bulk Insert')
		}
	}

	insertItem(item)
	{
		let overlap = 0;
		this.getBufferIndices(item).forEach(index => {
			if(this.m[index] === 1) {
				overlap++;
			} else {
				this.m[index] = 1;
			}
		});
		if(overlap === this.k) this.collisions++;
	}

	checkItem(item)
	{
		if(this.debug) console.time('Check Item');
		let count = -1;

		this.getBufferIndices(item).forEach(index => {
			if(this.m[index] === 1) count++;
		});

		if(this.debug) console.timeEnd('Check Item');

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