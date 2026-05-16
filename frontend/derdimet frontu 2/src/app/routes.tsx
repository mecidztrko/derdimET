import { createBrowserRouter } from 'react-router';
import { BuyerLayout } from './layouts/BuyerLayout';
import { SellerLayout } from './layouts/SellerLayout';
import { SlaughterhouseLayout } from './layouts/SlaughterhouseLayout';
import { BuyerHome } from './pages/buyer/BuyerHome';
import { BuyerSearch } from './pages/buyer/BuyerSearch';
import { BuyerOffers } from './pages/buyer/BuyerOffers';
import { BuyerFavorites } from './pages/buyer/BuyerFavorites';
import { BuyerMessages } from './pages/buyer/BuyerMessages';
import { BuyerSettings } from './pages/buyer/BuyerSettings';
import { SellerHome } from './pages/seller/SellerHome';
import { SellerListings } from './pages/seller/SellerListings';
import { SellerOffers } from './pages/seller/SellerOffers';
import { SellerBrowse } from './pages/seller/SellerBrowse';
import { SellerMessages } from './pages/seller/SellerMessages';
import { SellerSettings } from './pages/seller/SellerSettings';
import { SlaughterhouseDashboard } from './pages/slaughterhouse/SlaughterhouseDashboard';
import { SlaughterhouseBuyAnimals } from './pages/slaughterhouse/SlaughterhouseBuyAnimals';
import { SlaughterhouseSellMeat } from './pages/slaughterhouse/SlaughterhouseSellMeat';
import { SlaughterhouseOffers } from './pages/slaughterhouse/SlaughterhouseOffers';
import { SlaughterhouseMessages } from './pages/slaughterhouse/SlaughterhouseMessages';
import { SlaughterhouseSettings } from './pages/slaughterhouse/SlaughterhouseSettings';
import { RoleSelector } from './pages/RoleSelector';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RoleSelector,
  },
  {
    path: '/buyer',
    Component: BuyerLayout,
    children: [
      { index: true, Component: BuyerHome },
      { path: 'search', Component: BuyerSearch },
      { path: 'offers', Component: BuyerOffers },
      { path: 'favorites', Component: BuyerFavorites },
      { path: 'messages', Component: BuyerMessages },
      { path: 'settings', Component: BuyerSettings },
    ],
  },
  {
    path: '/seller',
    Component: SellerLayout,
    children: [
      { index: true, Component: SellerHome },
      { path: 'listings', Component: SellerListings },
      { path: 'offers', Component: SellerOffers },
      { path: 'browse', Component: SellerBrowse },
      { path: 'messages', Component: SellerMessages },
      { path: 'settings', Component: SellerSettings },
    ],
  },
  {
    path: '/slaughterhouse',
    Component: SlaughterhouseLayout,
    children: [
      { index: true, Component: SlaughterhouseDashboard },
      { path: 'buy-animals', Component: SlaughterhouseBuyAnimals },
      { path: 'sell-meat', Component: SlaughterhouseSellMeat },
      { path: 'offers', Component: SlaughterhouseOffers },
      { path: 'messages', Component: SlaughterhouseMessages },
      { path: 'settings', Component: SlaughterhouseSettings },
    ],
  },
]);