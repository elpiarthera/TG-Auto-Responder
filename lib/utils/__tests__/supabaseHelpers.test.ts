import { getUserSettings, updateUserSettings } from '../supabaseHelpers';
import { createClient } from '@supabase/supabase-js';

jest.mock('@supabase/supabase-js');

describe('supabaseHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserSettings', () => {
    it('should fetch user settings successfully', async () => {
      const mockData = { id: '1', message_template: 'Hello', is_responder_active: true };
      (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      });

      const result = await getUserSettings('1');
      expect(result).toEqual(mockData);
    });

    it('should throw an error when fetching fails', async () => {
      (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: new Error('Fetch failed') }),
      });

      await expect(getUserSettings('1')).rejects.toThrow('Failed to fetch user settings');
    });
  });

  // Similar tests for updateUserSettings...
});