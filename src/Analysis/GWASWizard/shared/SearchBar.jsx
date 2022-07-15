import React from 'react';
import '../../GWASUIApp/GWASUIApp.css';
import { SearchOutlined } from '@ant-design/icons';

export const SearchBar = ({ searchTerm, handleSearch, fields }) => {
    return (
        <div className={`GWASUI-searchContainer`}>
            <div>
                <SearchOutlined />
                <input
                    className={`GWASUI-searchInput`}
                    type="text"
                    placeholder={`Search by ${fields}`}
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)} />
            </div>
        </div>
    )
}
