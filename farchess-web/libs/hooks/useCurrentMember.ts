import { CURRENT_USERNAME } from '../config';
import { Member } from '../types/api';
import useApi from './useApi';

// The logged-in player. Until login exists, that is always CURRENT_USERNAME.
const useCurrentMember = () => useApi<Member>(`/members/${CURRENT_USERNAME}`);

export default useCurrentMember;
