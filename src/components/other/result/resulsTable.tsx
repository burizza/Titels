import './resultstable.css'
import React from "react";
import { Link } from 'react-router-dom';





export default function ResultsTable({repeatgame, mistake, currentScore, time}) {


    return(
        <div>
            <div className='result'>
                <div className='result-table'>
                    <div className='result-title'>
                        {currentScore > 0 ? 'Неплохо!' : 'Повезет в другой раз!'}
                    </div>
                    <div className='result-indicators'>
                        <div>Счёт: {currentScore}</div>
                        <div>Количество ошибок: {mistake}</div>
                        <div>Время: {time}s</div>
                    </div>
                    <div className='result-button'>
                        <a href='#' onClick={repeatgame} className='result-repeat-game'>Ещё раз</a>
                        <Link to='/' className='result-menu'>Меню</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}