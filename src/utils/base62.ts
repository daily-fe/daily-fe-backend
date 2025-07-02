const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function generateBase62Id(length: number = 10): string {
	let id = '';
	for (let i = 0; i < length; i++) {
		const rand = Math.floor(Math.random() * 62);
		id += BASE62[rand];
	}
	return id;
}
