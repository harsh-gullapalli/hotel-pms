import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import { Header, Sidebar } from './components/layout';
import type { NavTarget, ViewId } from './components/nav';
import { labelOf, sectionOf } from './components/nav';
import { ThemeSwatcher } from './components/ThemeSwatcher';
import { AppCrashFallback, ErrorBoundary, PanelCrashFallback } from './components/ErrorBoundary';
import { ThemeProvider } from './theme/ThemeContext';
import { useTheme } from './theme/useTheme';
import { THEME_PRESETS } from './theme/presets';
import { Toaster } from './components/overlays';
import { Dashboard } from './pages/Dashboard';

const Reservations = lazy(() => import('./pages/Reservations').then((m) => ({ default: m.Reservations })));
const NewReservation = lazy(() => import('./pages/NewReservation').then((m) => ({ default: m.NewReservation })));
const CheckIn = lazy(() => import('./pages/CheckIn').then((m) => ({ default: m.CheckIn })));
const CheckOut = lazy(() => import('./pages/CheckOut').then((m) => ({ default: m.CheckOut })));
const InHouse = lazy(() => import('./pages/InHouse').then((m) => ({ default: m.InHouse })));
const Guests = lazy(() => import('./pages/Guests').then((m) => ({ default: m.Guests })));
const WalkIn = lazy(() => import('./pages/WalkIn').then((m) => ({ default: m.WalkIn })));
const Rooms = lazy(() => import('./pages/Rooms').then((m) => ({ default: m.Rooms })));
const RoomTypes = lazy(() => import('./pages/RoomTypes').then((m) => ({ default: m.RoomTypes })));
const RoomInventory = lazy(() => import('./pages/RoomInventory').then((m) => ({ default: m.RoomInventory })));
const StatusBoard = lazy(() => import('./pages/StatusBoard').then((m) => ({ default: m.StatusBoard })));
const Housekeeping = lazy(() => import('./pages/Housekeeping').then((m) => ({ default: m.Housekeeping })));
const Maintenance = lazy(() => import('./pages/Maintenance').then((m) => ({ default: m.Maintenance })));
const Billing = lazy(() => import('./pages/Billing').then((m) => ({ default: m.Billing })));
const Payments = lazy(() => import('./pages/Payments').then((m) => ({ default: m.Payments })));
const Invoices = lazy(() => import('./pages/Invoices').then((m) => ({ default: m.Invoices })));
const Expenses = lazy(() => import('./pages/Expenses').then((m) => ({ default: m.Expenses })));
const Rates = lazy(() => import('./pages/Rates').then((m) => ({ default: m.Rates })));
const Reports = lazy(() => import('./pages/Reports').then((m) => ({ default: m.Reports })));
const OccupancyReport = lazy(() => import('./pages/OccupancyReport').then((m) => ({ default: m.OccupancyReport })));
const RevenueReport = lazy(() => import('./pages/RevenueReport').then((m) => ({ default: m.RevenueReport })));
const ArrivalsReport = lazy(() => import('./pages/ArrivalsReport').then((m) => ({ default: m.ArrivalsReport })));
const Staff = lazy(() => import('./pages/Staff').then((m) => ({ default: m.Staff })));
const Properties = lazy(() => import('./pages/Properties').then((m) => ({ default: m.Properties })));
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));

function PageFallback() {
  return (
    <div className="flex flex-col gap-3" aria-busy="true" aria-label="Loading page">
      <div className="pms-card p-4 sm:p-5">
        <div className="h-5 w-40 rounded-full" style={{ background: 'var(--color-muted-surface)' }} />
        <div className="mt-2 h-4 w-64 max-w-full rounded-full" style={{ background: 'var(--color-divider)' }} />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="pms-card min-h-[112px] p-4" />
        ))}
      </div>
    </div>
  );
}

const VIEW_META: Record<ViewId, { title: string; subtitle: string }> = {
  dashboard: { title: 'Good evening, Atrium', subtitle: 'Friday, Oct 10 · 124 in-house · 24 arrivals · 18 departures' },
  reservations: { title: 'Reservations', subtitle: 'Bookings, calendar and channel mix' },
  'new-reservation': { title: 'New Reservation', subtitle: 'Create a booking with live price breakdown' },
  'check-in': { title: 'Check-in', subtitle: 'Front-desk arrivals workflow' },
  'check-out': { title: 'Check-out', subtitle: 'Departures, folios and settlement' },
  'in-house': { title: 'In-house Guests', subtitle: 'Everyone currently staying' },
  guests: { title: 'Guest Directory', subtitle: 'Profiles, tiers and lifetime value' },
  'walk-in': { title: 'Walk-in Registration', subtitle: 'Register guests without a booking' },
  'room-overview': { title: 'Room Overview', subtitle: '159 rooms · 5 floors · live status' },
  'room-types': { title: 'Room Types', subtitle: 'Categories, occupancy and base rates' },
  'room-inventory': { title: 'Room Inventory', subtitle: 'Every room in one operational table' },
  'status-board': { title: 'Room Status Board', subtitle: 'Compact live board by floor' },
  housekeeping: { title: 'Housekeeping', subtitle: 'Turnover queue and inspections' },
  maintenance: { title: 'Maintenance', subtitle: 'Work orders and out-of-service rooms' },
  folios: { title: 'Folios & Billing', subtitle: 'Guest folios and balances' },
  payments: { title: 'Payments', subtitle: 'Ledger, receipts and collection' },
  invoices: { title: 'Invoices', subtitle: 'Bills, previews and print' },
  expenses: { title: 'Expenses', subtitle: 'Property spend and approvals' },
  'rate-management': { title: 'Rate Management', subtitle: 'Plans, seasons and availability calendar' },
  reports: { title: 'Reports', subtitle: 'Operations and finance analytics' },
  'occupancy-report': { title: 'Occupancy Report', subtitle: 'Occupancy trends by day and segment' },
  'revenue-report': { title: 'Revenue Report', subtitle: 'Revenue, ADR and RevPAR' },
  'arrivals-departures': { title: 'Arrivals & Departures', subtitle: 'Movement report' },
  'staff-roles': { title: 'Staff & Roles', subtitle: 'Team, departments and permissions' },
  properties: { title: 'Properties', subtitle: 'Branches in the group' },
  settings: { title: 'Settings', subtitle: 'Property defaults and appearance' },
};

function Shell() {
  const [target, setTarget] = useState<NavTarget>({ view: 'dashboard' });
  const [navOpen, setNavOpen] = useState(false);
  const [swatcherOpen, setSwatcherOpen] = useState(false);
  const { preset } = useTheme();
  const view = target.view;
  const meta = VIEW_META[view];

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view, target.focusId]);

  const go = useCallback((t: NavTarget) => {
    setTarget(t);
    setNavOpen(false);
  }, []);

  const page = useMemo(() => {
    switch (view) {
      case 'dashboard':
        return <Dashboard go={go} />;
      case 'reservations':
        return <Reservations initialQuery={target.query} focusId={target.focusId} go={go} />;
      case 'new-reservation':
        return <NewReservation go={go} />;
      case 'check-in':
        return <CheckIn />;
      case 'check-out':
        return <CheckOut />;
      case 'in-house':
        return <InHouse go={go} />;
      case 'guests':
        return <Guests initialQuery={target.query} focusId={target.focusId} go={go} />;
      case 'walk-in':
        return <WalkIn go={go} />;
      case 'room-overview':
        return <Rooms initialQuery={target.query} focusId={target.focusId} />;
      case 'room-types':
        return <RoomTypes />;
      case 'room-inventory':
        return <RoomInventory />;
      case 'status-board':
        return <StatusBoard />;
      case 'housekeeping':
        return <Housekeeping />;
      case 'maintenance':
        return <Maintenance />;
      case 'folios':
        return <Billing />;
      case 'payments':
        return <Payments />;
      case 'invoices':
        return <Invoices />;
      case 'expenses':
        return <Expenses />;
      case 'rate-management':
        return <Rates />;
      case 'reports':
        return <Reports go={go} />;
      case 'occupancy-report':
        return <OccupancyReport />;
      case 'revenue-report':
        return <RevenueReport />;
      case 'arrivals-departures':
        return <ArrivalsReport />;
      case 'staff-roles':
        return <Staff />;
      case 'properties':
        return <Properties />;
      case 'settings':
        return <Settings onOpenThemes={() => setSwatcherOpen(true)} />;
    }
  }, [view, target.query, target.focusId, go]);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-page)', backgroundImage: 'var(--gradient-page)', backgroundAttachment: 'fixed', color: 'var(--color-ink)' }}>
      <a href="#pms-main" className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-[70] focus:rounded-[10px] focus:border focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold" style={{ background: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-ink)' }}>
        Skip to main content
      </a>
      <Sidebar active={view} onNavigate={(v) => go({ view: v })} mobileOpen={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          crumb={`${sectionOf(view)} · ${labelOf(view)}`}
          onMenu={() => setNavOpen(true)}
          onOpenThemes={() => setSwatcherOpen(true)}
          onGo={go}
        />
        <main id="pms-main" tabIndex={-1} key={`${view}-${target.focusId ?? ''}-${target.query ?? ''}`} className="pms-animate-fade-up mx-auto w-full max-w-[1280px] flex-1 px-3 py-4 sm:px-5 sm:py-6 lg:px-8 2xl:max-w-[1440px]">
          <Suspense fallback={<PageFallback />}>{page}</Suspense>
        </main>
        <footer
          className="border-t px-4 py-3.5 sm:px-6"
          style={{ borderColor: 'var(--color-border)', background: 'color-mix(in srgb, var(--color-sidebar) 88%, var(--color-surface))', boxShadow: '0 -8px 24px -16px rgb(40 30 20 / 0.18)' }}
        >
          <p className="tnum mx-auto w-full max-w-[1280px] text-[11.5px] font-medium 2xl:max-w-[1440px]" style={{ color: 'var(--color-ink-secondary)' }}>
            Atrium PMS · {THEME_PRESETS[preset].name} · 6 colour themes ·
            status colours fixed across themes · static demo data
          </p>
        </footer>
      </div>
      <ErrorBoundary
        resetKeys={[swatcherOpen]}
        onReset={() => setSwatcherOpen(false)}
        fallback={(reset) => <PanelCrashFallback reset={reset} onClose={() => setSwatcherOpen(false)} />}
      >
        <ThemeSwatcher open={swatcherOpen} onClose={() => setSwatcherOpen(false)} />
      </ErrorBoundary>
      <Toaster />
    </div>
  );
}

function ShellWithBoundary() {
  return (
    <ErrorBoundary fallback={(reset) => <AppCrashFallback reset={reset} />}>
      <Shell />
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ShellWithBoundary />
    </ThemeProvider>
  );
}

export default App;
