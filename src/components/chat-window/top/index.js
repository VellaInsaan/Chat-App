import { memo } from 'react';
import { useCurrentRoom } from '../../../context/current-room.context';

const Top = () => {
  const name = useCurrentRoom((val) => val.name);
  return <div>{name}</div>;
};

export default memo(Top);
