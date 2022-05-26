import ProTable from '@ant-design/pro-table';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';

import { department } from '@/services/department';

const valueEnum = {
    0: 'close',
    1: 'running',
    2: 'online',
    3: 'error',
};
const tableListDataSource = [];
for (let i = 0; i < 2; i += 1) {
    tableListDataSource.push({
        key: i,
        name: `TradeCode ${i}`,
        status: valueEnum[Math.floor(Math.random() * 10) % 4],
        updatedAt: Date.now() - Math.floor(Math.random() * 1000),
        createdAt: Date.now() - Math.floor(Math.random() * 2000),
        createdAtRange: [
            Date.now() - Math.floor(Math.random() * 2000),
            Date.now() - Math.floor(Math.random() * 2000),
        ],
        money: Math.floor(Math.random() * 2000) * i,
        progress: Math.ceil(Math.random() * 100) + 1,
        percent: Math.random() > 0.5
            ? ((i + 1) * 10 + Math.random()).toFixed(3)
            : -((i + 1) * 10 + Math.random()).toFixed(2),
        code: `const getData = async params => {
  const data = await getData(params);
  return { list: data.data, ...data };
};`,
    });
}
const Department= () => {

    const request=async (params,soter,filter)=>{
        const result = await department()
        return {
            total: 200,
            data: result.data.department,
            success: true,
        }
    }
    
    return(
        <PageContainer>
    <ProTable 

    columns={[
        {
            title: '院系名称',
            key: 'dep_name',
            dataIndex: 'dep_name',
            valueType: 'string',
        },
        {
            title: '成立时间',
            key: 'dep_date',
            dataIndex: 'dep_date',
            valueType: 'dateTime',
        },
        {
            title: '人数',
            key: 'dep_count',
            dataIndex: 'dep_count',
            valueType: 'digit',
        },
        {
            title: '联系电话',
            key: 'dep_phone',
            dataIndex: 'dep_phone',
            valueType: 'string',
        },
        {
            title: '通讯地址',
            key: 'dep_address',
            dataIndex: 'dep_address',
            valueType: 'string',
        },

        {
            title: '操作',
            key: 'option',
            width: 120,
            valueType: 'option',
            render: (_, row, index, action) => [
                <a key="a" onClick={() => {
                        action === null || action === void 0 ? void 0 : action.startEditable(row.key);
                    }}>
              编辑
            </a>,
            ],
        },
    ]} 
    request={request} rowKey="key" headerTitle="所有部门"/>
        </PageContainer>
    )
}
export default Department