'use client';

import { useState } from "react";
import useSWR from 'swr';
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal";
import Button from "@components/button";
import Loading from "@components/loading";
import { setNotification } from "@libs/client/redux/notification";
import { useAppDispatch } from "@libs/client/redux/hooks";
import Input from "@components/input";


const fetcher = (url: string) => fetch(url).then(res => res.json());
function getAdminLabel(admin: number) {
  const labels = [];
  if ((admin & 1) === 1) labels.push(<div key="seat" className="bg-violet-100 px-2 py-1 text-violet-700 rounded-full">자리배치</div>);
  if ((admin & 2) === 2) labels.push(<div key="user" className="bg-blue-100 px-2 py-1 text-blue-700 rounded-full">사용자관리</div>);
  return labels;
}

function UserRow({ user, checked, onCheck, onEdit, onReset }: any) {
  return (
    <tr className="bg-white hover:bg-gray-50 transition-all cursor-pointer border-b text-zinc-800">
      <td className="px-4 py-2">
        <input type="checkbox" checked={checked} onChange={e => onCheck(user.id, e.target.checked)} />
      </td>
      <td className="px-4 py-2">{user.name}</td>
      <td className="px-4 py-2">{user.userId}</td>
      <td className="px-4 py-2">
        <div className="flex items-center space-x-1">
          { user.type === 0 && <div className="bg-green-100 px-2 py-1 text-green-700 rounded-full">학생</div> }
          { user.type === 1 && <div className="bg-orange-100 px-2 py-1 text-orange-700 rounded-full">교사</div> }
          { getAdminLabel(Number(user.admin)) }
        </div>
      </td>
      <td className="px-4 py-2 flex space-x-2">
        <Button color="teal" scalableHeight fn={() => onEdit(user)}><div className="py-2 px-3">수정</div></Button>
        <Button color="lightblue" scalableHeight fn={() => onReset(user.id)}><div className="py-2 px-3">비밀번호 초기화</div></Button>
      </td>
    </tr>
  );
}

export default function AdminUserPanel() {
  const dispatch = useAppDispatch();
  const { data, mutate, isLoading } = useSWR('/api/user/admin', fetcher);
  const [selectedTab, setSelectedTab] = useState<'student' | 'teacher'>('student');
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [editModal, setEditModal] = useState(false);
  const [addModal, setAddModal] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);
  const [resetModal, setResetModal] = useState(false);
  const [resetUserId, setResetUserId] = useState<string | null>(null);

  // input states for add/edit
  const [editName, setEditName] = useState('');
  const [editUserId, setEditUserId] = useState('');
  const [editType, setEditType] = useState<'student' | 'teacher'>('student');
  const [editAdminSeat, setEditAdminSeat] = useState(false);
  const [editAdminUser, setEditAdminUser] = useState(false);

  const [addName, setAddName] = useState('');
  const [addUserId, setAddUserId] = useState('');
  const [addType, setAddType] = useState<'student' | 'teacher' | 'general'>('student');
  const [addAdminSeat, setAddAdminSeat] = useState(false);
  const [addAdminUser, setAddAdminUser] = useState(false);
  const [addPassword, setAddPassword] = useState('');

  if (isLoading) return (
    <div className="flex justify-center mt-40">
      <div className="text-blue-500">
        <Loading size={40} />
      </div>
    </div>
  );

  const users = data?.users?.filter((u: any) =>
    selectedTab === 'student' ? u.type === 0 : u.type !== 0
  ) || [];

  const handleCheck = (id: string, checked: boolean) => {
    setCheckedIds(prev =>
      checked ? [...prev, id] : prev.filter(_id => _id !== id)
    );
  };

  const handleDelete = async () => {
    if (!checkedIds.length) return;
    await fetch('/api/user/admin', {
      method: 'DELETE',
      body: JSON.stringify({ ids: checkedIds }),
      headers: { 'Content-Type': 'application/json' }
    });
    setCheckedIds([]);
    mutate();
    dispatch(setNotification({ type: 'success', text: '삭제 완료' }));
  };

  const handleEdit = (user: any) => {
    setEditUser(user);
    setEditName(user.name || '');
    setEditUserId(user.userId || '');
    setEditType(user.type === 0 ? 'student' : 'teacher');
    setEditAdminSeat((Number(user.admin) & 1) === 1);
    setEditAdminUser((Number(user.admin) & 2) === 2);
    setEditModal(true);
  };

  const handleEditSubmit = async () => {
    let admin = 0;
    if (editAdminSeat) admin |= 1;
    if (editAdminUser) admin |= 2;
    const data = {
      name: editName,
      userId: editUserId,
      type: editType,
      admin
    };
    await fetch('/api/user/admin', {
      method: 'PATCH',
      body: JSON.stringify({ id: editUser.id, data }),
      headers: { 'Content-Type': 'application/json' }
    });
    setEditModal(false);
    mutate();
    dispatch(setNotification({ type: 'success', text: '수정 완료' }));
  };

  const handleAddSubmit = async () => {
    let admin = 0;
    if (addAdminSeat) admin |= 1;
    if (addAdminUser) admin |= 2;
    const data = {
      name: addName,
      userId: addUserId,
      type: addType,
      admin,
      password: addPassword
    };
    await fetch('/api/user/admin', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    setAddModal(false);
    mutate();
    dispatch(setNotification({ type: 'success', text: '추가 완료' }));
    setAddName('');
    setAddUserId('');
    setAddType('student');
    setAddAdminSeat(false);
    setAddAdminUser(false);
    setAddPassword('');
  };

  const handleResetPassword = async (id: string) => {
    setResetUserId(id);
    setResetModal(true);
  };

  const confirmResetPassword = async () => {
    if (!resetUserId) return;
    await fetch('/api/user/admin/reset', {
      method: 'POST',
      body: JSON.stringify({ id: resetUserId }),
      headers: { 'Content-Type': 'application/json' }
    });
    setResetModal(false);
    setResetUserId(null);
    dispatch(setNotification({ type: 'success', text: '비밀번호 초기화 완료' }));
  };

  return (
    <div className="mt-5 flex flex-col space-y-5 mb-20 md:mb-0">
      <div className="flex justify-between items-center">
        <div className="flex rounded-full bg-gray-100 p-1">
          <div onClick={() => setSelectedTab('student')} className={ selectedTab === 'student' ? "bg-white px-8 py-2 rounded-full flex items-center justify-center font-bold cursor-pointer" : "px-8 py-2 rounded-full flex items-center justify-center cursor-pointer" }>학생</div>
          <div onClick={() => setSelectedTab('teacher')} className={ selectedTab === 'teacher' ? "bg-white px-8 py-2 rounded-full flex items-center justify-center font-bold cursor-pointer" : "px-8 py-2 rounded-full flex items-center justify-center cursor-pointer" }>교사</div>
        </div>
        <div className="flex space-x-2">
          <Button color="lightblue" fn={() => setAddModal(true)}><div className="px-5">사용자 추가</div></Button>
          <Button color="red" fn={handleDelete} disabled={!checkedIds.length}><div className="px-4">선택 삭제</div></Button>
        </div>
      </div>
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[800px]">
          <thead className="text-sm text-lightgray-200 bg-gray-50/50 border-t border-b border-lightgray-100">
            <tr>
              <th className="px-4 py-3 !font-medium">선택</th>
              <th className="px-4 py-3 !font-medium">이름</th>
              <th className="px-4 py-3 !font-medium">{ selectedTab === 'student' ? '학번' : '아이디' }</th>
              <th className="px-4 py-3 !font-medium">구분</th>
              <th className="px-4 py-3 !font-medium">관리</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && (
              <tr className="w-full relative h-[120px]">
                <td colSpan={6} className="text-center text-lightgray-200">
                  <div className="my-8 mx-auto">사용자가 없습니다.</div>
                </td>
              </tr>
            )}
            {users.map((user: any) => (
              <UserRow
                key={user.id}
                user={user}
                checked={checkedIds.includes(user.id)}
                onCheck={handleCheck}
                onEdit={handleEdit}
                onReset={handleResetPassword}
              />
            ))}
          </tbody>
        </table>
      </div>
      <AnimatePresence>
        {editModal && (
          <Modal handleClose={() => setEditModal(false)}>
            <div className="w-full md:w-[380px] p-0">
              <div className="font-bold text-xl mb-4">사용자 정보 수정</div>
              <div className="space-y-3">
                <Input value={editName} fn={(d:string) => setEditName(d)} placeholder="이름" />
                <Input value={editUserId} fn={(d:string) => setEditUserId(d)} placeholder="아이디" />
                <select
                  value={editType}
                  onChange={e => setEditType(e.target.value as 'student' | 'teacher')}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="student">학생</option>
                  <option value="teacher">교사</option>
                </select>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={editAdminSeat} onChange={e => setEditAdminSeat(e.target.checked)} />
                    <span>자리배치 권한</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={editAdminUser} onChange={e => setEditAdminUser(e.target.checked)} />
                    <span>사용자관리 권한</span>
                  </label>
                </div>
              </div>
              <div className="mt-5 flex justify-end space-x-2">
                <Button color="blue" fn={handleEditSubmit}><div className="px-6">저장</div></Button>
              </div>
            </div>
          </Modal>
        )}
        {addModal && (
          <Modal handleClose={() => setAddModal(false)}>
            <div className="w-full md:w-[380px] p-0">
              <div className="font-bold text-xl mb-4">사용자 추가</div>
              <div className="space-y-3">
                <Input value={addName} fn={(d:string) => setAddName(d)} placeholder="이름" />
                <Input value={addUserId} fn={(d:string) => setAddUserId(d)} placeholder="아이디" />
                <select
                  value={addType}
                  onChange={e => setAddType(e.target.value as 'student' | 'teacher' | 'general')}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="student">학생</option>
                  <option value="teacher">교사</option>
                  <option value="general">일반(표시되지 않음)</option>
                </select>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={addAdminSeat} onChange={e => setAddAdminSeat(e.target.checked)} />
                    <span>자리배치 권한</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" checked={addAdminUser} onChange={e => setAddAdminUser(e.target.checked)} />
                    <span>사용자관리 권한</span>
                  </label>
                </div>
                <Input type="password" value={addPassword} fn={(d:string) => setAddPassword(d)} placeholder="비밀번호" />
              </div>
              <div className="mt-5 flex justify-end space-x-2">
                <Button color="blue" fn={handleAddSubmit}><div className="px-6">추가</div></Button>
              </div>
            </div>
          </Modal>
        )}
        {resetModal && (
          <Modal handleClose={() => { setResetModal(false); setResetUserId(null); }}>
            <div className="w-full md:w-[340px]">
              <div className="font-bold text-lg mb-4">비밀번호를 초기화하시겠습니까?</div>
              <div className="text-gray-500 mb-6">초기화하면 해당 사용자의 비밀번호가 삭제됩니다. 확인 후 진행해주세요.</div>
              <div className="flex justify-end space-x-2">
                <Button color="red" fn={confirmResetPassword}><div className="px-6">초기화</div></Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}