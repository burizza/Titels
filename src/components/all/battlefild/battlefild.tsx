import {useContext, useEffect, useState, useReducer} from "react";
import { DataContext } from "../../../DataContext.tsx";
import React from "react";
import ResultsTable from "../../other/result/resulsTable.tsx";

const initialState = {
    tiles : [],
    selectTiles : [],
    matchedTiles : [],
    increaScore : false ,
    decreaseScore : false,
};


const generateImages = (images:string[])=> {
    const imageArray = [...images, ...images]
    return imageArray.sort(() =>Math.random() - 0.5).map((image, index) => ({
        id: index,
        image,
        isFlip: false,
        
    }));
    console.log(imageArray)
    
}

export default function BattleField () {


    const { gameStart, fieldSize, gameTime, gameQuantity, setGameQuantity } = useContext(DataContext);
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(gameTime);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [mistake, setMistake] = useState(0);
    const [maxScore, setMaxScore] = useState(parseInt(sessionStorage.getItem("maxScore") || "0", 10));

    const [gameOver, setGameOver] = useState(false);
    const [currentScore, setCurrentScore] = useState(0)

    console.log("Field Size: ", fieldSize); 

    const repeatGame = async () => {
        setTimeLeft (gameTime);
        setElapsedTime (0);
        setMistake (0);
        setCurrentScore (0);
        setGameOver (false);
        setGameQuantity((value: number)=> value+1)
        dispatch({ type: 'START_GAME', payload: images});
    };


    useEffect(()=> {
        const fetchImages = async () => {
            const apiKey = 'h4vlQWzI/KrnH4Ic9UkOMA==SM4JBKGnazSoL5od'
            const imageUrls: string[] = [];
            try {
                for (let i = 0; i < fieldSize; i++) {
                    const response = await fetch ("https://api.api-ninjas.com/v1/randomimage?category=wildlife", {
                        headers: {
                            'X-Api-Key': apiKey,
                            'Accept': 'image/jpg'
                        }
                    });
                    if (!response.ok) {
                        console.error(`Ошибка при запросе: ${response.statusText}`);
                        return;
                    }
                    const blob = await response.blob();
                    const url = URL.createObjectURL(blob);
                    console.log("Загружено изображение:", url);
                    imageUrls.push(url);
                }
                setImages(imageUrls);
            } catch (error) {
                console.error("Ошибка при получении изображений:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchImages();
    }, [])
    console.log(<fetchImages />)

    const reducer = (state, action) => {
        switch (action.type) {

            case 'START_GAME' :

                return {
                    ...state,
                    selectTiles: [],
                    matchedTiles: [],
                    tiles: generateImages(action.payload)
                }

            case 'FLIP_IMAGE':
                return {...state, selectTiles : [...state.selectTiles, action.payload]}
                
            case 'CHECK_MATCH' :
                { const[firstTile, secondTile] = state.selectTiles;

                if (firstTile.image === secondTile.image && firstTile.id === secondTile.id) {
                    return {
                        ...state,
                        secondTiles: [],
                        decreaseScore: true,
                    }
                }

                if (firstTile.image === secondTile.image && firstTile.id !==secondTile.id) {
                    return {
                        ...state,
                        matchedTiles: [...state.matchedTiles, firstTile, secondTile],
                        selectTiles: [],
                        increaScore: true,
                        tiles: [...state.tiles],
                    }
                }else{
                    return {
                        ...state,
                        selectTiles: [],
                        decreaseScore: true,
                        tiles: [...state.tiles],
                    }
                } }

                default: 
                    return state;
            }

    };

    const [state, dispatch] = useReducer (reducer, initialState);

    useEffect (() => {
        if (!loading && images.length > 0) {
            dispatch ({ type: 'START_GAME', payload: images});
            setCurrentScore (0);
            setTimeLeft(gameTime)
            setGameQuantity((value:number)=> value+1)
        }
    }, [loading, images]);

    useEffect (() => {
        if (timeLeft > 0 && !loading && gameStart && !gameOver ){
            const timer = setInterval (()=> {
                setTimeLeft((value:number)=> value-1);
                setElapsedTime((value)=> value + 1);
            },1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setGameOver(true);
        }

    }, [timeLeft,loading,gameStart]);

    useEffect(() => {
        if (state.selectTiles.length === 2){
            setTimeout (() => {
                dispatch({ type: "CHECK_MATCH"});
            }, 800);
        }
    }, [state.selectTiles]);


    useEffect(() => {
        if (state.increaScore === true) {
            const increment = getScoreIncrement (fieldSize);
            setCurrentScore((prevScore) => prevScore + increment);
            state.increaScore = false;
        }
    }, [state.increaScore]);

    useEffect (() => {
        if (state.decreaseScore === true) {
            setCurrentScore((prevScore) => prevScore - 1);
            state.decreaseScore = false;
            setMistake((value)=>value+1);
        }
    }, [state.decreaseScore]);

    useEffect(() => {
        if (state.matchedTiles.length >= fieldSize * 2) {
            setGameOver(true);
        }
    }, [state.matchedTiles]);

    function getLevel(fieldSize: number) {
        const size = Number(fieldSize);
        return size === 2 ? 'Kids' :
           size === 8 ? 'Human' :
           size === 18 ? 'Computer' :
           size === 32 ? 'Cyborg' : '';
    }

    function getScoreIncrement(fieldSize:number) {
        const size = Number(fieldSize);
        return size === 2 ? 3 :
            size === 8 ? 5 :
                size === 18 ? 10 :
                    size === 32 ? 20 : 0; 
    }

    useEffect(() => {
        if (gameOver) {
            const gameResult = {
                lvl: getLevel(fieldSize),
                score: currentScore,
                mistakes: mistake,
                timeSpend: elapsedTime,
                date: new Date().toISOString(),
            };

           const storeResults = JSON.parse(localStorage.getItem('gameResult') as string) || [];

            const updateResults = JSON.parse(localStorage.getItem('gameResult') || '[]');
            updateResults.push(gameResult);
            localStorage.setItem('gameResult', JSON.stringify(updateResults));


           if (currentScore > maxScore) {
            setMaxScore(currentScore);
            sessionStorage.setItem("maxScore", currentScore.toString());
           }

        }
    }, [gameOver, state.matchedTiles]);


    return(
        <>
            {loading?
                <div className='loading'>
                    <div className='loader'></div>
                    <div>Загрузка изображений</div>
                </div>
                :
                <>  
                    {gameOver && <ResultsTable currentScore={currentScore} mistake={mistake} time={elapsedTime} repeatgame={repeatGame}/>}
                    <div className='battlefield'>
                        <div className='scoreboard'>
                            <div
                                className='level'>{fieldSize==='2' ? '' : fieldSize === '8' ? '' : fieldSize === '18' ? '' : fieldSize === '32' ? '' : ''}
                            </div>
                            <div className='score'>Score<span>{currentScore}</span></div>
                            <div className="timer">Time <span>{timeLeft}</span></div>
                        </div>
                        <div className={`board-${fieldSize}`}>
                            {state.tiles.map((image:any, index:any) => (
                                <div className={`${state.selectTiles?.includes(image) ? 'tile-flip' : 'tile'}`} key={image.id}>
                                    {(state.selectTiles.includes(image) || state.matchedTiles?.includes(image)) ? 
                                        <div>
                                            
                                            <img className='tile-img' key={index} src={image.image} alt='image'/>
                                        </div>
                                        :
                                        <div className='dark-tiles' onClick={() => {
                                            if (state.selectTiles?.length < 2 && !state.matchedTiles?.includes(image)) {
                                                dispatch({type: 'FLIP_IMAGE', payload: image});
                                                }
                                            }}
                                            >
                                            </div>
                                    }
                                </div>
                            ))}
                        </div>
                        <div className='scoreboard'>
                            <div className="timer">Record:{maxScore}<span></span></div>
                            <div className='level'>Mistakes:{mistake}</div>
                            <div className="timer">Game:{gameQuantity} <span></span></div>
                        </div>
                    
                    </div>
                </>
            }
        </>
    )
}


















        








































