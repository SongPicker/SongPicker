import React from 'react';
import { Routes, Route } from 'react-router-dom';
import GroupList from '../components/template/group/GroupList';
import GroupDetail from '../components/template/group/GroupDetail';

const GroupPage = () => {
  return (
    <Routes>
      <Route index element={<GroupList />} />
      <Route path=":teamId/*" element={<GroupDetail />} />
    </Routes>
  );
};

export default GroupPage;
