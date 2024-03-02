/*
 * Menu to change user credentials
 */

import React, { useState, useCallback } from 'react';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { t } from 'ttag';

import UserMessages from './UserMessages';
import ChangePassword from './ChangePassword';
import ChangeName from './ChangeName';
import ChangeMail from './ChangeMail';
import DeleteAccount from './DeleteAccount';
import SocialSettings from './SocialSettings';
import { logoutUser } from '../store/actions';
import { requestLogOut } from '../store/actions/fetch';

import { numberToString } from '../core/utils';

const AREAS = {
  CHANGE_NAME: ChangeName,
  CHANGE_MAIL: ChangeMail,
  CHANGE_PASSWORD: ChangePassword,
  DELETE_ACCOUNT: DeleteAccount,
  SOCIAL_SETTINGS: SocialSettings,
};

const Stat = ({ text, value, rank }) => (
  <p>
    <span className="stattext">{(rank) ? `${text}: #` : `${text}: `}</span>
    &nbsp;
    <span className="statvalue">{numberToString(value)}</span>
  </p>
);

const UserAreaContent = () => {
  const [area, setArea] = useState('NONE');

  const dispatch = useDispatch();
  const logout = useCallback(async () => {
    const ret = await requestLogOut();
    if (ret) {
      dispatch(logoutUser());
    }
  }, [dispatch]);

  const mailreg = useSelector((state) => state.user.mailreg);
  const name = useSelector((state) => state.user.name);
  const stats = useSelector((state) => ({
    totalPixels: state.ranks.totalPixels,
    dailyTotalPixels: state.ranks.dailyTotalPixels,
    ranking: state.ranks.ranking,
    dailyRanking: state.ranks.dailyRanking,
  }), shallowEqual);

  const Area = AREAS[area];

  return (
    <div className="content">
      <UserMessages />
      <Stat
        text={t`Today Placed Pixels`}
        value={stats.dailyTotalPixels}
      />
      <Stat
        text={t`Daily Rank`}
        value={stats.dailyRanking}
        rank
      />
      <Stat
        text={t`Placed Pixels`}
        value={stats.totalPixels}
      />
      <Stat
        text={t`Total Rank`}
        value={stats.ranking}
        rank
      />
      <div>
        <p>{t`Your name is: ${name}`}</p>(
        <span
          role="button"
          tabIndex={-1}
          className="modallink"
          onClick={logout}
        > {t`Log out`}</span>
        <span className="hdivider" />
        <span
          role="button"
          tabIndex={-1}
          className="modallink"
          onClick={() => setArea('CHANGE_NAME')}
        > {t`Change Username`}</span>
        <span className="hdivider" />
        {(mailreg)
          && (
          <React.Fragment key="mc">
            <span
              role="button"
              tabIndex={-1}
              className="modallink"
              onClick={() => setArea('CHANGE_MAIL')}
            > {t`Change Mail`}</span>
            <span className="hdivider" />
          </React.Fragment>
          )}
        <span
          role="button"
          tabIndex={-1}
          className="modallink"
          onClick={() => setArea('CHANGE_PASSWORD')}
        > {t`Change Password`}</span>
        <span className="hdivider" />
        <span
          role="button"
          tabIndex={-1}
          className="modallink"
          onClick={() => setArea('DELETE_ACCOUNT')}
        > {t`Delete Account`}</span> )
        <br />(
        <span
          role="button"
          tabIndex={-1}
          className="modallink"
          onClick={() => setArea('SOCIAL_SETTINGS')}
        > {t`Social Settings`}</span> )
      </div>
      {(Area) && <Area done={() => setArea(null)} />}
    </div>
  );
};

export default React.memo(UserAreaContent);
