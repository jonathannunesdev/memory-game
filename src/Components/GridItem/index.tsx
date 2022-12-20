import * as C from './styles'
import { GridItemType } from '../../types/GridItemTypes';
import b7SVG from '../../svgs/b7.svg'
import { items } from '../../data/items';

export type Props = {
    item: GridItemType;
    onClick: () => void 
}

export const GridItem = ({ item, onClick }:Props) => {
    return (
        <C.Container onClick={onClick} showBg={item.permanentShown || item.shown}>
            {(item.permanentShown === false && item.shown === false) && <C.Icon src={b7SVG} opacity={.1} alt=""/>}
            {(item.permanentShown || item.shown) && item.item !== null &&
                <C.Icon src={items[item.item].icon} alt=""/>
            }
        </C.Container>
    )
}