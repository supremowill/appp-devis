const mockFindUnique = jest.fn();
const mockUpdate = jest.fn();

jest.mock('@prisma/client', () => {
  return {
    PrismaClient: jest.fn().mockImplementation(() => ({
      ride: {
        findUnique: mockFindUnique,
        update: mockUpdate,
        create: jest.fn(),
        findMany: jest.fn(),
      },
    })),
  };
});

import { ridesService } from './rides.service';

describe('ridesService.acceptRide', () => {
  beforeEach(() => {
    mockFindUnique.mockReset();
    mockUpdate.mockReset();
  });

  it('throws if ride does not exist', async () => {
    mockFindUnique.mockResolvedValue(null);

    await expect(
      ridesService.acceptRide('ride1', { driverId: 'driver1' }),
    ).rejects.toThrow('Ride not found');
  });

  it('throws if ride status is not REQUESTED', async () => {
    mockFindUnique.mockResolvedValue({ id: 'ride1', status: 'ACCEPTED' });

    await expect(
      ridesService.acceptRide('ride1', { driverId: 'driver1' }),
    ).rejects.toThrow('Ride status is not REQUESTED');
  });

  it('accepts ride when status is REQUESTED', async () => {
    mockFindUnique.mockResolvedValue({ id: 'ride1', status: 'REQUESTED' });
    const updatedRide = { id: 'ride1', status: 'ACCEPTED', driverId: 'driver1' };
    mockUpdate.mockResolvedValue(updatedRide);

    const result = await ridesService.acceptRide('ride1', { driverId: 'driver1' });

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: 'ride1' },
      data: { driverId: 'driver1', status: 'ACCEPTED' },
    });
    expect(result).toEqual(updatedRide);
  });
});
