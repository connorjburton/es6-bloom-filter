const fnv = require('fnv-plus');

class BloomFilter {
	constructor(items, input)
	{
		const BITS_PER_ITEM = 15; //~0.1% false positive rate
		this.m = Buffer.alloc(items.length * BITS_PER_ITEM); // setup bit array
		this.k = Math.ceil(BITS_PER_ITEM * 0.7); // amount of hash functions we need to use
		this.seeds = [null]; // we don't need to seed the first hash function
		this.input = input;
		this.items = items;

		this.setSeeds();
		this.insertItems();
	}

	setSeeds()
	{
		for(let i = 0; i <= this.k; i++) this.seeds.push(Math.floor(Math.random() * 100));
	}

	insertItems()
	{
		console.log('Total buffer size: ' + this.m.length);
		let collisions = 0;
		this.items.forEach(value => {
			this.seeds.forEach(seed => {
				if(seed) fnv.seed(seed);
				let index = fnv.hash(value).dec() % this.m.length;
				if(this.m[index] === 1) collisions++;
				this.m[index] = 1;
			});
		});

		console.log('Total collisions: ' + collisions);
	}
}

module.exports = BloomFilter;