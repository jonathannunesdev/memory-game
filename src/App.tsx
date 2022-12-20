import { useEffect, useState } from 'react';
import * as C from './App.styles'
import logoImage from './assets/devmemory_logo.png'
import { Button } from './Components/Button';
import { InfoItem } from './Components/InfoItem';
import iconImage from './svgs/restart.svg'
import { GridItemType } from './types/GridItemTypes';
import { GridItem } from './Components/GridItem';
import { items } from './data/items';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';


const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [moveCount, setMoveCount] = useState<number>(0);
  const [shownCount, setShownCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  


  useEffect(()=> resetAndCreatGrid() , []);

  useEffect(() => {
    const timer = setInterval(()=> {
      if(playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer)
  }, [playing, timeElapsed]);

  useEffect(() => {
    if(shownCount === 2){
      let opened = gridItems.filter(item => item.shown === true);
      if(opened.length === 2){

        if(opened[0].item === opened[1].item){
          let tempGrid = [...gridItems];
          for(let i in tempGrid){
            if(tempGrid[i].shown){
              tempGrid[i].permanentShown = true;
              tempGrid[i].shown = false;
            }
          }
          setGridItems(tempGrid);
          setShownCount(0);
        } else {
          setTimeout(() => {
            let tempGrid = [...gridItems];
            for(let i in tempGrid){
              tempGrid[i].shown = false;
            }
            setGridItems(tempGrid);
            setShownCount(0)
          }, 1000);
        }
        setMoveCount(moveCount => moveCount +1);
      }
    }
  }, [shownCount, gridItems]);

  useEffect(()=> {
    if(moveCount > 0 && gridItems.every(item => item.permanentShown === true)){
      setPlaying(false);
    }
  },[moveCount, gridItems])

  const resetAndCreatGrid = () => {
    //step 1 - reset the game
    setTimeElapsed(0);
    setMoveCount(0);
    setShownCount(0);

    // step 2 - create the grid
    // step 2.1 - create the empty grid
    let tempGrid: GridItemType[] = [];
    for(let i = 0; i < (items.length * 2); i++){
      tempGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      })
    }

    // step 2.2 - fill the grid 
    for(let w = 0; w < 2; w++){
      for(let i = 0; i < items.length; i++){
        let pos = -1;
        while(pos < 0 || tempGrid[pos].item !== null){
          pos = Math.floor((Math.random() * (items.length * 2)))
        }
        tempGrid[pos].item = i;
      }
    }

    // step 2.3 - put on state 
    setGridItems(tempGrid);

    // step 3 - start the game
    setPlaying(true);

  }
 
  const handleItemCLick = (index: number) => {
    if(playing && index !== null && shownCount < 2){
      let tempGrid = [...gridItems];
      if(tempGrid[index].permanentShown === false && tempGrid[index].shown === false){
        tempGrid[index].shown = true;
        setShownCount(shownCount + 1); 
      }
      setGridItems(tempGrid);
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink>
          <img src={logoImage} width='200' alt=''></img>
        </C.LogoLink>

        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}/>
          <InfoItem label='Movimentos' value={moveCount.toString()}/>
        </C.InfoArea>

        <Button label='Reiniciar' icon={iconImage} OnClick={resetAndCreatGrid}></Button>
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index)=> (
            <GridItem key={index} item={item} onClick={() => handleItemCLick(index)}/>
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
};

export default App