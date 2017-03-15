const farmhash = require('farmhash');

class BloomFilter {
	constructor(items, input)
	{
		const BITS_PER_ITEM = 15; //~0.1% false positive rate
		this.m = Buffer.alloc(items.length * BITS_PER_ITEM); // setup bit array
		this.k = Math.ceil(BITS_PER_ITEM * 0.7); // amount of hash functions we need to use
		this.seeds = [];
		this.input = input;
		this.items = items;

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
		console.log('Total buffer size: ' + this.m.length);

		let collisions = 0;
		this.items.forEach(value => {			
			this.getBufferIndices(value).map(index => {
				if(this.m[index] === 1) collisions++;
				this.m[index] = 1;
			});
		});

		console.log('Total collisions: ' + collisions);
	}

	getBufferIndices(value)
	{
		let indicies = [];

		this.seeds.forEach(seed => indicies.push(farmhash.hash32WithSeed(value, seed) % this.m.length));

		return indicies;
	}
}

module.exports = BloomFilter;