import { Outlet, NavLink } from 'react-router';
import { Search, Bell, User, Menu, LayoutDashboard, ShoppingCart, Package, TrendingUp, MessageCircle, Settings, Factory } from 'lucide-react';
import { Button } from '../components/Button';
import { RolePill } from '../components/RolePill';
import { cn } from '../../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/slaughterhouse', icon: LayoutDashboard, end: true },
  { name: 'Hayvan Al', href: '/slaughterhouse/buy-animals', icon: ShoppingCart },
  { name: 'Et Sat', href: '/slaughterhouse/sell-meat', icon: Package },
  { name: 'Teklifler', href: '/slaughterhouse/offers', icon: TrendingUp },
  { name: 'Mesajlar', href: '/slaughterhouse/messages', icon: MessageCircle },
  { name: 'Profil & Ayarlar', href: '/slaughterhouse/settings', icon: Settings },
];

export function SlaughterhouseLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation Bar */}
      <nav className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="size-5" />
            </Button>
            <NavLink to="/" className="flex items-center gap-2">
              <div className="size-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">dE</span>
              </div>
              <span className="font-heading font-semibold text-lg hidden sm:block">derdimET</span>
            </NavLink>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="İlanlar, teklifler, satıcılar ara..."
                className="w-full h-10 pl-10 pr-4 bg-muted rounded-lg border-0 outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="size-5" />
              <span className="absolute top-2 right-2 size-2 bg-destructive rounded-full"></span>
            </Button>
            <Button variant="ghost" size="icon">
              <User className="size-5" />
            </Button>
            <div className="hidden sm:flex items-center gap-3 ml-2 pl-2 border-l border-border">
              <div className="text-right">
                <p className="text-small font-medium">Anadolu Kesimhane</p>
                <RolePill role="SLAUGHTERHOUSE" className="mt-0.5" />
              </div>
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Factory className="size-5 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Left Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-border bg-card sticky top-16 h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-small font-medium transition-colors relative',
                    isActive
                      ? 'bg-primary-soft text-foreground before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-primary before:rounded-r'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )
                }
              >
                <item.icon className="size-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
