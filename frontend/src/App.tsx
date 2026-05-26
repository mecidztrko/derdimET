import { HashRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useMe } from './hooks/useMe'
import { FeatureRoute } from './components/role-app/FeatureRoute'
import {
  defaultBuyerPath,
  defaultSellerPath,
  defaultSlaughterhousePath,
  isBuyerRouteEnabled,
  isSellerRouteEnabled,
  isSlaughterhouseRouteEnabled,
} from './config/routeFeatures'
import { BuyerLayout } from './layouts/BuyerLayout'
import { SellerLayout } from './layouts/SellerLayout'
import { SlaughterhouseLayout } from './layouts/SlaughterhouseLayout'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LoginPage from './pages/LoginPage'
import ProfileDashboardPage from './pages/ProfileDashboardPage'
import RegisterPage from './pages/RegisterPage'
import RoleSelectorPage from './pages/RoleSelectorPage'
import VerifyEmailPage from './pages/VerifyEmailPage'
import { BuyerFavorites } from './pages/buyer/BuyerFavorites'
import { BuyerHome } from './pages/buyer/BuyerHome'
import { BuyerMessages } from './pages/buyer/BuyerMessages'
import { BuyerOffers } from './pages/buyer/BuyerOffers'
import { BuyerPurchases } from './pages/buyer/BuyerPurchases'
import { BuyerSearch } from './pages/buyer/BuyerSearch'
import { BuyerSettings } from './pages/buyer/BuyerSettings'
import { SellerBrowse } from './pages/seller/SellerBrowse'
import { SellerHome } from './pages/seller/SellerHome'
import { SellerListings } from './pages/seller/SellerListings'
import { SellerMessages } from './pages/seller/SellerMessages'
import { SellerOffers } from './pages/seller/SellerOffers'
import { SellerSettings } from './pages/seller/SellerSettings'
import { SlaughterhouseBuyAnimals } from './pages/slaughterhouse/SlaughterhouseBuyAnimals'
import { SlaughterhouseDashboard } from './pages/slaughterhouse/SlaughterhouseDashboard'
import { SlaughterhouseMessages } from './pages/slaughterhouse/SlaughterhouseMessages'
import { SlaughterhouseOffers } from './pages/slaughterhouse/SlaughterhouseOffers'
import { SlaughterhousePurchaseRequests } from './pages/slaughterhouse/SlaughterhousePurchaseRequests'
import { SlaughterhouseSellMeat } from './pages/slaughterhouse/SlaughterhouseSellMeat'
import { SlaughterhouseSettings } from './pages/slaughterhouse/SlaughterhouseSettings'
import { PageLoader } from './components/role-app/PageLoader'
import { AppEntryRedirect } from './components/role-app/AppEntryRedirect'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading, error } = useMe()
  if (loading) {
    return <PageLoader message="Oturum kontrol ediliyor…" />
  }
  if (error === 'unauthorized' || !user) {
    return <Navigate to="/login" replace />
  }
  return <>{children}</>
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="min-h-screen animate-fade-in">
      <Routes location={location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProfileDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/role-selector"
          element={
            <ProtectedRoute>
              <RoleSelectorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer"
          element={
            <ProtectedRoute>
              <BuyerLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <FeatureRoute enabled={isBuyerRouteEnabled('home')} fallbackTo={defaultBuyerPath()}>
                <BuyerHome />
              </FeatureRoute>
            }
          />
          <Route
            path="search"
            element={
              <FeatureRoute enabled={isBuyerRouteEnabled('search')} fallbackTo={defaultBuyerPath()}>
                <BuyerSearch />
              </FeatureRoute>
            }
          />
          <Route
            path="offers"
            element={
              <FeatureRoute enabled={isBuyerRouteEnabled('offers')} fallbackTo={defaultBuyerPath()}>
                <BuyerOffers />
              </FeatureRoute>
            }
          />
          <Route
            path="purchases"
            element={
              <FeatureRoute
                enabled={isBuyerRouteEnabled('purchases')}
                fallbackTo={defaultBuyerPath()}
              >
                <BuyerPurchases />
              </FeatureRoute>
            }
          />
          <Route
            path="favorites"
            element={
              <FeatureRoute
                enabled={isBuyerRouteEnabled('favorites')}
                fallbackTo={defaultBuyerPath()}
              >
                <BuyerFavorites />
              </FeatureRoute>
            }
          />
          <Route
            path="messages"
            element={
              <FeatureRoute
                enabled={isBuyerRouteEnabled('messages')}
                fallbackTo={defaultBuyerPath()}
              >
                <BuyerMessages />
              </FeatureRoute>
            }
          />
          <Route
            path="settings"
            element={
              <FeatureRoute enabled={isBuyerRouteEnabled('settings')} fallbackTo={defaultBuyerPath()}>
                <BuyerSettings />
              </FeatureRoute>
            }
          />
        </Route>
        <Route
          path="/seller"
          element={
            <ProtectedRoute>
              <SellerLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <FeatureRoute enabled={isSellerRouteEnabled('home')} fallbackTo={defaultSellerPath()}>
                <SellerHome />
              </FeatureRoute>
            }
          />
          <Route
            path="listings"
            element={
              <FeatureRoute
                enabled={isSellerRouteEnabled('listings')}
                fallbackTo={defaultSellerPath()}
              >
                <SellerListings />
              </FeatureRoute>
            }
          />
          <Route
            path="offers"
            element={
              <FeatureRoute enabled={isSellerRouteEnabled('offers')} fallbackTo={defaultSellerPath()}>
                <SellerOffers />
              </FeatureRoute>
            }
          />
          <Route
            path="browse"
            element={
              <FeatureRoute enabled={isSellerRouteEnabled('browse')} fallbackTo={defaultSellerPath()}>
                <SellerBrowse />
              </FeatureRoute>
            }
          />
          <Route
            path="messages"
            element={
              <FeatureRoute
                enabled={isSellerRouteEnabled('messages')}
                fallbackTo={defaultSellerPath()}
              >
                <SellerMessages />
              </FeatureRoute>
            }
          />
          <Route
            path="settings"
            element={
              <FeatureRoute enabled={isSellerRouteEnabled('settings')} fallbackTo={defaultSellerPath()}>
                <SellerSettings />
              </FeatureRoute>
            }
          />
        </Route>
        <Route
          path="/slaughterhouse"
          element={
            <ProtectedRoute>
              <SlaughterhouseLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('dashboard')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhouseDashboard />
              </FeatureRoute>
            }
          />
          <Route
            path="buy-animals"
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('buyAnimals')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhouseBuyAnimals />
              </FeatureRoute>
            }
          />
          <Route
            path="purchase-requests"
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('purchaseRequests')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhousePurchaseRequests />
              </FeatureRoute>
            }
          />
          <Route
            path="sell-meat"
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('sellMeat')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhouseSellMeat />
              </FeatureRoute>
            }
          />
          <Route
            path="offers"
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('offers')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhouseOffers />
              </FeatureRoute>
            }
          />
          <Route
            path="messages"
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('messages')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhouseMessages />
              </FeatureRoute>
            }
          />
          <Route
            path="settings"
            element={
              <FeatureRoute
                enabled={isSlaughterhouseRouteEnabled('settings')}
                fallbackTo={defaultSlaughterhousePath()}
              >
                <SlaughterhouseSettings />
              </FeatureRoute>
            }
          />
        </Route>
        <Route path="/" element={<AppEntryRedirect />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AnimatedRoutes />
    </HashRouter>
  )
}
