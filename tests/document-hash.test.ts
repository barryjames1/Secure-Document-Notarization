import { describe, it, expect, beforeEach } from 'vitest';
import { mockBlockchain, mockPrincipal } from './test-utils';

describe('Document Hash Contract', () => {
  const owner = mockPrincipal('ST1SJ3DTE5DN7X54YDH5D64R3BCB6A2AG2ZQ8YPD5');
  let blockchain;
  
  beforeEach(() => {
    blockchain = mockBlockchain();
    blockchain.setCurrentSender(owner);
  });
  
  it('should register a new document', async () => {
    const documentHash = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
    
    const result = await blockchain.callContract('document-hash', 'register-document', [documentHash]);
    
    expect(result.success).toBe(true);
    expect(result.value).toBe(1);
    
    const documentInfo = await blockchain.callReadOnlyFn('document-hash', 'get-document', [1]);
    expect(documentInfo.success).toBe(true);
    expect(documentInfo.value.hash).toEqual(documentHash);
    expect(documentInfo.value.owner).toEqual(owner);
    expect(documentInfo.value.status).toEqual('registered');
  });
  
  it('should verify a document hash correctly', async () => {
    const documentHash = Buffer.from('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
    
    await blockchain.callContract('document-hash', 'register-document', [documentHash]);
    
    const correctVerification = await blockchain.callReadOnlyFn('document-hash', 'verify-document', [1, documentHash]);
    expect(correctVerification.success).toBe(true);
    expect(correctVerification.value).toBe(true);
    
    const wrongHash = Buffer.from('0000000000abcdef1234567890abcdef1234567890abcdef1234567890abcdef', 'hex');
    const incorrectVerification = await blockchain.callReadOnlyFn('document-hash', 'verify-document', [1, wrongHash]);
    expect(incorrectVerification.success).toBe(true);
    expect(incorrectVerification.value).toBe(false);
  });
});
