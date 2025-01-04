
import React from "react";
import { useEffect, useState } from "react";
import "./statistic.css";
import {Link} from "react-router-dom"; // Для стилизации таблицы

export default function Statistic() {
    const [results, setResults] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

    // Открытие фильтрационного меню
    const [filerMenu, setFilerMenu] = useState(false);
    const [subFilterMenu, setSubFilterMenu] = useState(false);

    // Получение данных из localStorage
    useEffect(() => {
        const storedResults = JSON.parse(localStorage.getItem("gameResult") as string) || [];
        setResults(storedResults);
    }, []);




    // Функция сортировки
    const sortData = (key: string) => {
        const direction = sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";

        const sortedResults = [...results].sort((a, b) => {
            switch (key) {

                case "date":
                    return direction === "asc"
                        ? new Date(a.date).getTime() - new Date(b.date).getTime()
                        : new Date(b.date).getTime() - new Date(a.date).getTime();

                case "score":
                    return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
                case "mistakes":
                    return direction === "asc" ? a[key] - b[key] : b[key] - a[key];
                case "timeSpend":
                    return direction === "asc" ? a[key] - b[key] : b[key] - a[key];

                case "lvl":
                    return direction === "asc"
                        ? a.lvl.localeCompare(b.lvl)
                        : b.lvl.localeCompare(a.lvl);

                default:
                    return 0;
            }
        });

        setSortConfig({ key, direction });
        setResults(sortedResults);
    };


    // SUB FILTER MENU  // БОЛЬШЕ НЕ ПРИДУМАЛ ПОЧЕМУ ФИЛЬТРОВАТЬ
    const [filterType, setFilterType] = useState("default");

    function filterParams(results:any){
        switch (filterType){
            case 'Сложность':
                return Array.from(new Set(results.map((item: any) => item.lvl)));
            default:
                return results
        }
    }
    const filterResult = filterParams(...[results]) // Пункты сложности

    // Выбранные пункты сложности для фильтрации
    const [filterLvl, setFilterLvl ] = useState([])

    const handleFilterLvl = (lvlToToggle: any) => {
        if (filterLvl.includes(lvlToToggle)) {
            setFilterLvl(filterLvl.filter(lvl => lvl !== lvlToToggle));
        } else {
            setFilterLvl([...filterLvl, lvlToToggle]);
        }
    }

    const filteredResults = results.filter(item => filterLvl.includes(item.lvl) || filterLvl.length === 0);


    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Количество записей на странице
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = filteredResults.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredResults.length / itemsPerPage);

    const emptyRows = Array.from(
        { length: itemsPerPage - currentItems.length },
        () => ({ date: "", lvl: "", mistakes: "", score: "", timeSpend: "" })
    );
    const displayedItems = [...currentItems, ...emptyRows];


    return (
        <div>
            {filerMenu && (
            <div className='filter'>
                <div className='filter-header'>
                    <span className='filter-header-title'>Фильтры</span>
                </div>
                <div className='filter-menu' onClick={() => {setSubFilterMenu(true); setFilterType('Сложность')}}>
                    <div>
                        Сложность
                    </div>
                    <img width={15} height={15} src='/icon/arrow-right.png' alt='arrow'/>
                </div>
            </div>
            )}

            {subFilterMenu && (
                <div className='subfilter-menu'>
                    {filterType === 'Сложность' && (
                        <div className='subfilter-menu-block'>
                            <div className='subfilter-menu-header'>{filterType}</div>
                            {filterResult.map((item: any, index:any) => (
                                <div className={filterLvl.includes(item) ? 'subfilter-menu-item active' : 'subfilter-menu-item'} key={index} onClick={() => {handleFilterLvl(item)}}>
                                    <div>{item}</div>
                                    <img width={15} height={15} src='/icon/arrow-right.png' alt='arrow'/>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {filerMenu && (
                <div className='filter-menu-background' onClick={()=> {setFilerMenu(false); setSubFilterMenu(false)}}></div>
            )}

            <div className="statistic">
                <div className='statistic-header'>
                    <div className="statistic-title">Ваши результаты</div>
                    <div className='filtr' onClick={()=>setFilerMenu(!filerMenu)}>
                        <img width={20} height={20} src='/icon/filter.png' alt='filter'/>
                    </div>
                </div>
                <table className="statistic-table">
                    <thead>
                    <tr>
                        <th onClick={() => sortData("date")}>
                            <div className='table-title2'>
                                <div className='table-th-name'>Дата</div>
                                <div className='table-th-img'>
                                {sortConfig.key === "date" ? sortConfig.direction === "asc" ?
                                        <span className='arrow-up'>
                                            <img src='/icon/arrow-up.svg' alt='arrow'/>
                                        </span> :
                                        <span className='arrow-down'>
                                            <img src='/icon/arrow-down.svg' alt='arrow'/>
                                        </span>
                                    : <span className='arrow'></span>}
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortData("lvl")}>
                            <div className='table-title3'>
                                <div className='table-th-name'>Сложность</div>
                                <div className='table-th-img'>
                                    {sortConfig.key === "lvl" ? sortConfig.direction === "asc" ?
                                            <span className='arrow-up'>
                                            <img src='/icon/arrow-up.svg' alt='arrow'/>
                                        </span> :
                                            <span className='arrow-down'>
                                            <img src='/icon/arrow-down.svg' alt='arrow'/>
                                        </span>
                                        : <span className='arrow'></span>}
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortData("score")}>
                            <div className='table-title2'>
                                <div className='table-th-name'>Очки</div>
                                <div className='table-th-img'>
                                    {sortConfig.key === "score" ? sortConfig.direction === "asc" ?
                                            <span className='arrow-up'>
                                            <img src='/icon/arrow-up.svg' alt='arrow'/>
                                        </span> :
                                            <span className='arrow-down'>
                                            <img src='/icon/arrow-down.svg' alt='arrow'/>
                                        </span>
                                        : <span className='arrow'></span>}
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortData("mistakes")}>
                            <div className='table-title2'>
                                <div className='table-th-name'>Ошибки</div>
                                <div className='table-th-img'>
                                    {sortConfig.key === "mistakes" ? sortConfig.direction === "asc" ?
                                            <span className='arrow-up'>
                                            <img src='/icon/arrow-up.svg' alt='arrow'/>
                                        </span> :
                                            <span className='arrow-down'>
                                            <img src='/icon/arrow-down.svg' alt='arrow'/>
                                        </span>
                                        : <span className='arrow'></span>}
                                </div>
                            </div>
                        </th>
                        <th onClick={() => sortData("timeSpend")}>
                            <div className='table-title2'>
                                <div className='table-th-name'>Время</div>
                                <div className='table-th-img'>
                                    {sortConfig.key === "timeSpend" ? sortConfig.direction === "asc" ?
                                            <span className='arrow-up'>
                                            <img src='/icon/arrow-up.svg' alt='arrow'/>
                                        </span> :
                                            <span className='arrow-down'>
                                            <img src='/icon/arrow-down.svg' alt='arrow'/>
                                        </span>
                                        : <span className='arrow'></span>}
                                </div>
                            </div>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {displayedItems.length > 0 ? (
                        displayedItems.map(({ date, lvl, mistakes, score, timeSpend }, index) => (
                            <tr key={index} className={date ? "" : "empty-row"}>
                                <td>{date ? new Date(date).toLocaleString() : ""}</td>
                                <td>{lvl}</td>
                                <td>{score}</td>
                                <td>{mistakes}</td>
                                <td>{timeSpend}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={4} style={{textAlign: "center"}}>
                                Нет данных
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((prev) => prev - 1)}
                        >
                            Назад
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={currentPage === index + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(index + 1)}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((prev) => prev + 1)}
                        >
                            Вперёд
                        </button>
                    </div>
                )}
                <div className='statistic-button'>
                <Link className='menu-button' to='/'>Меню</Link>
                </div>
            </div>
        </div>
    );
}
