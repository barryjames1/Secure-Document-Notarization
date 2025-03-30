import { describe, it, expect, beforeEach } from 'vitest';
import { mockBlockchain, mockPrincipal } from './test-utils';

describe('Notary Verification Contract', () => {
  const contractOwner = mockPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5');
  const notary = mockPrincipal('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG');
  const nonOwner = mockPrincipal('ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC');
  let blockchain;
  
  beforeEach(() => {
    blockchain = mockBlockchain();
    blockchain.setCurrentSender(contractOwner);
  });
  
  it('should register a new notary', async () => {
    const result = await blockchain.callContract('notary-verification', 'register-notary', [
      notary,
      'John Doe'
    ]);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(true);
    
    const notaryInfo = await blockchain.callReadOnlyFn('notary-verification', 'get-notary-info', [notary]);
    expect(notaryInfo.success).toBe(true);
    expect(notaryInfo.value.is_active).toBe(true);
    expect(notaryInfo.value.name).toBe('John Doe');
  });
  
  it('should not allow non-owner to register notary', async () => {
    blockchain.setCurrentSender(nonOwner);
    
    const result = await blockchain.callContract('notary-verification', 'register-notary', [
      notary,
      'John Doe'
    ]);
    
    expect(result.success).toBe(false);
    expect(result.error).toBe(403);
  });
  
  it('should deactivate a notary', async () => {
    await blockchain.callContract('notary-verification', 'register-notary', [
      notary,
      'John Doe'
    ]);
    
    const result = await blockchain.callContract('notary-verification', 'deactivate-notary', [notary]);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(true);
    
    const isNotary = await blockchain.callReadOnlyFn('notary-verification', 'is-notary', [notary]);
    expect(isNotary.success).toBe(true);
    expect(isNotary.value).toBe(false);
  });
});
