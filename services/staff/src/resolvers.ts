import { staffMembers } from './data';
import { Staff } from './types';

export const resolvers = {
  Query: {
    staff: (): Staff[] => {
      return staffMembers;
    },
    staffMember: (_: any, { id }: { id: string }): Staff | null => {
      return staffMembers.find(member => member.id === id) || null;
    }
  }
};