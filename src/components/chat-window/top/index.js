import Icon from '@rsuite/icons/lib/Icon';
import { memo } from 'react';
import { RiArrowLeftCircleLine } from 'react-icons/ri';

import { useCurrentRoom } from '../../../context/current-room.context';

import { Link } from 'react-router-dom';
import { useMediaQuery } from '../../../misc/custom-hooks';
import { ButtonToolbar } from 'rsuite';
import RoomInfoBtnModal from './RoomInfoBtnModal';
import EditRoomDrawerBtn from './EditRoomDrawerBtn';

const Top = () => {
  const name = useCurrentRoom((val) => val.name);
  const isMobile = useMediaQuery('(max-width: 992px');
  return (
    <div>
      <div className='d-flex justify-content-between align-items-center'>
        <h4 className='d-flex text-disapper align-items-center'>
          <Link
            to='/'
            className={
              isMobile
                ? 'd-inline-block p-0 mr-2 text-blue link-unstyled'
                : 'd-none'
            }
          >
            <Icon as={RiArrowLeftCircleLine} size='1.5em' />
          </Link>
          <span className='text-disappear'>{name}</span>
        </h4>

        <ButtonToolbar className='ws-nowrap'>
          <EditRoomDrawerBtn />
        </ButtonToolbar>
      </div>

      <div className='d-flex justify-content-between align-items-center'>
        <span>todo</span>
        <RoomInfoBtnModal />
      </div>
    </div>
  );
};

export default memo(Top);
