import {Typography } from 'antd';
import { AddMember } from './AddMember';

const { Title } = Typography;

export const MemberPage = () => {
    return (
        <>
            <Title>Member Management</Title>
            <AddMember/>
            <Title>Members</Title>
        </>
    );
};
