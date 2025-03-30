// Mock utilities for testing Clarity contracts with Vitest

export function mockPrincipal(address) {
	return {
		type: 'principal',
		address
	};
}

export function mockBlockchain() {
	const contracts = {};
	const storage = {
		maps: {},
		vars: {}
	};
	let currentSender = null;
	let blockHeight = 1;
	
	return {
		setCurrentSender(principal) {
			currentSender = principal;
		},
		
		setBlockHeight(height) {
			blockHeight = height;
		},
		
		registerContract(name, functions) {
			contracts[name] = functions;
			storage.maps[name] = {};
			storage.vars[name] = {};
		},
		
		async callContract(contractName, functionName, args) {
			if (!contracts[contractName] || !contracts[contractName][functionName]) {
				return {
					success: false,
					error: 'Contract or function not found'
				};
			}
			
			try {
				const result = await contracts[contractName][functionName](
					currentSender,
					...args,
					{
						getMapEntry: (map, key) => storage.maps[contractName][map]?.[JSON.stringify(key)],
						setMapEntry: (map, key, value) => {
							if (!storage.maps[contractName][map]) storage.maps[contractName][map] = {};
							storage.maps[contractName][map][JSON.stringify(key)] = value;
						},
						getVar: (varName) => storage.vars[contractName][varName],
						setVar: (varName, value) => {
							storage.vars[contractName][varName] = value;
						},
						blockInfo: {
							height: blockHeight,
							time: Math.floor(Date.now() / 1000)
						}
					}
				);
				
				return {
					success: true,
					value: result
				};
			} catch (error) {
				return {
					success: false,
					error: error.code || error.message
				};
			}
		},
		
		async callReadOnlyFn(contractName, functionName, args) {
			return this.callContract(contractName, functionName, args);
		}
	};
}
