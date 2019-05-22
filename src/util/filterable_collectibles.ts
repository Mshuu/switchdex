import { isDutchAuction } from './orders';
import { SortableCollectible } from './sortable_collectibles';
import { Collectible } from './types';

export enum CollectibleFilterType {
    ShowAll = 'Show all',
    FixedPrice = 'Fixed Price',
    DecliningAuction = 'Declining Auction',
    Name = 'Name',
}

const isCollectibleSoldInDutchAuction = (collectible: Collectible): boolean => {
    if (collectible.order === null) {
        return false;
    }
    return isDutchAuction(collectible.order);
};

const isCollectibleSoldInBasicSell = (collectible: Collectible): boolean => {
    if (collectible.order === null) {
        return false;
    }
    return !isDutchAuction(collectible.order);
};

const filterCollectibleByNameFn = (collectible: Collectible, name: string): boolean => {
    const collectibleName = collectible.name.toLowerCase();
    const filterName = name.toLowerCase();
    return collectibleName.startsWith(filterName);
};

export const getFilterFunction = (filterType: CollectibleFilterType): ((sc: SortableCollectible) => boolean) => {
    switch (filterType) {
        case CollectibleFilterType.DecliningAuction:
            return (sc: SortableCollectible) => isCollectibleSoldInDutchAuction(sc.collectible);
        case CollectibleFilterType.FixedPrice:
            return (sc: SortableCollectible) => isCollectibleSoldInBasicSell(sc.collectible);
        case CollectibleFilterType.Name:
            return (sc: SortableCollectible) => filterCollectibleByNameFn(sc.collectible, sc.name);
        default:
            return (c: any) => true;
    }
};

export const getFilteredCollectibles = (
    collectibles: SortableCollectible[],
    filterType: CollectibleFilterType,
): SortableCollectible[] => {
    const filterFunction = getFilterFunction(filterType);
    return collectibles.filter(filterFunction);
};
