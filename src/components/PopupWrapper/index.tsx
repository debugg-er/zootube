import React from 'react';

import AuthForm from '@components/AuthForm';
import Loading from '@components/Loading';
import MessageQueue from '@components/MessageQueue';
import Confirm from '@components/Confirm';
import PlaylistPopup from '@components/PlaylistPopup';

import './PopupWrapper.css';

function PopupWrapper() {
  return (
    <div className="PopupWrapper">
      <AuthForm />
      <Loading />
      <MessageQueue />
      <Confirm />
      <PlaylistPopup />
    </div>
  );
}

export default PopupWrapper;
