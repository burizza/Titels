import React from "react";
import {Link} from "react-router-dom";


export default function Menu (){
    return (
        <div className="Alldiv">
            <div>
                <h1 className="title">Добро пожаловать в игру</h1>
            </div>
            <div className="boxAll">   
                <div className="box1" tab-id="box1"></div>
                <div className="box2" tab-id="box2"></div>
                <div className="box3" tab-id="box3"></div>
                <div className="box4" tab-id="box4"></div>
            </div>
            <div className="boxButton">    
                <Link to="/battlefild" className="start" tab-id="start" >Начать</Link>
                <Link to="/settings" className="settings" tab-id="settings" >Настройки</Link>
                <Link to="/Statistic" className="static"  >Результаты</Link>
            </div>    
        </div>
    );
}