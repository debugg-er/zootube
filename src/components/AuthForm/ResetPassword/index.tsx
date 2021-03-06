import React, { useState } from 'react';

import authApi from '@api/authApi';
import { useSetLoading } from '@contexts/LoadingContext';
import { usePushMessage } from '@contexts/MessageQueueContext';
import { useSetShowAuthForm } from '@contexts/ShowAuthFormContext';

import './ResetPassword.css';

function ResetPassword() {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [failMessage, setFailMessage] = useState<string | null>(null);
  const [isLogoutAllDevices, setIsLogoutAllDevices] = useState(false);

  const setLoading = useSetLoading();
  const pushMessage = usePushMessage();
  const setShowAuthForm = useSetShowAuthForm();

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password || !oldPassword || !repassword) {
      return setFailMessage('Hãy điền đầy đủ thông tin');
    }
    if (password !== repassword) {
      return setFailMessage('Mật khẩu nhập lại không khớp');
    }

    try {
      setLoading(true);
      await authApi.reset(oldPassword, password);
      if (isLogoutAllDevices) {
        await authApi.deleteAllDevices();
      }
      setFailMessage(null);
      setShowAuthForm(false);
      pushMessage('Đã cập nhật mật khẩu');
    } catch (e) {
      const message: string = (e as any)?.data?.fail?.message;

      if (message === "password don't match") {
        setFailMessage('mật khẩu không chính xác');
      } else if (message === 'invalid password') {
        setFailMessage('Mật khẩu không hợp lệ');
      } else {
        setFailMessage('lỗi máy chủ');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login">
      <form className="login__wrapper" onSubmit={handleLoginSubmit}>
        {failMessage && <span className="login__errorMessage">*{failMessage}</span>}
        <input
          type="password"
          className="field"
          placeholder="Mật khẩu cũ"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          className="field"
          placeholder="Mật khẩu mới"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="field"
          placeholder="Nhập lai mật khẩu mới"
          value={repassword}
          onChange={(e) => setRepassword(e.target.value)}
          style={{ marginBottom: 6 }}
        />

        <label>
          <input
            type="checkbox"
            id="logout"
            onChange={() => setIsLogoutAllDevices(!isLogoutAllDevices)}
            defaultChecked={isLogoutAllDevices}
          />
          Đăng xuất tất cả các thiết bị khác
        </label>

        <input type="submit" value="Đổi mật khẩu" />
      </form>
    </div>
  );
}

export default ResetPassword;
