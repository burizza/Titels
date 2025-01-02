import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataContext }  from '../../../DataContext.tsx';
import './settingus.css';
import { useContext } from "react";

export default function Sett (){

    const [selectedLevel, setSelectedLevel] = useState('2');  // Хранит выбранный уровень сложности
    const [selectedTime, setSelectedTime] = useState('60');  // Хранит выбранное время   
    
    const [save, setSave] = useState(false);

    const { setFieldSize, setGameTime } = useContext(DataContext);
    

    // Обработчик изменения уровня сложности
    const handleLevelChange = (event) => {
        setSelectedLevel(event.target.value);
    };

    // Обработчик изменения времени
    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

      // Сохранение настроек
      const handleSubmit = (event) => {
        setFieldSize(selectedLevel);
        setGameTime(selectedTime);

        setSave(true);
        setTimeout(() => setSave(false), 3000);
    }

    return (
        <div className="setBox">
            <h1 className="zag">Настройки</h1>
            <div className="modBox1">
                <h2 className="zagh2">Выберите уровень сложности</h2>
                <select
                    className="butBox1"
                    tab-id="butBox1"
                    value={selectedLevel}
                    onChange={handleLevelChange}>
                        <option value="2"  >Kids 2x2</option>
                        <option value="8"  >Human 4x4</option>
                        <option value="18"  >Computer 6x6</option>
                        <option value="32"  >Cyborg 8x8</option>
                </select>    
            </div>
            <div className="modBox2">
                <h2 className="zagh2">За сколько справитесь ?</h2>
                <select 
                    className="butBox2"
                    tab-id="butBox2"
                    value={selectedTime}
                    onChange={handleTimeChange}>
                        <option value="90">Normal 90s</option>
                        <option value="60">Medium 60s</option>
                        <option value="45">Hard 45s</option>
                        <option value="30">Impossible 30s</option> 
                </select> 
            </div>
            <div className="buttonBox">
                <button onClick={handleSubmit} className='save' type = 'button'>Сохранить</button>
                <Link to="/" className='menu' tab-id='tab-menu' >Меню</Link>
            </div>
            {save && <div className="saveMessage">Настройки сохранены!</div>}
        </div>

    );


}