import { useCallback, useEffect, useMemo, useState } from 'react';
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
import { Reservations } from './pages/Reservations';
import { NewReservation } from './pages/NewReservation';
import { CheckIn } from './pages/CheckIn';
import { CheckOut } from './pages/CheckOut';
import { InHouse } from './pages/InHouse';
import { Guests } from './pages/Guests';
import { WalkIn } from './pages/WalkIn';
import { Rooms } from './pages/Rooms';
import { RoomTypes } from './pages/RoomTypes';
import { RoomInventory } from './pages/RoomInventory';
import { StatusBoard } from './pages/StatusBoard';
import { Housekeeping } from './pages/Housekeeping';
import { Maintenance } from './pages/Maintenance';
import { Billing } from './pages/Billing';
import { Payments } from './pages/Payments';
import { Invoices } from './pages/Invoices';
import { Expenses } from './pages/Expenses';
import { Rates } from './pages/Rates';
import { Reports } from './pages/Reports';
import { OccupancyReport } from './pages/OccupancyReport';
import { RevenueReport } from './pages/RevenueReport';
import { ArrivalsReport } from './pages/ArrivalsReport';
import { Staff } from './pages/Staff';
import { Properties } from './pages/Properties';
import { Settings } from './pages/Settings';

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
    <div className="flex min-h-screen" style={{ background: 'var(--color-page)', color: 'var(--color-ink)' }}>
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
        <main key={`${view}-${target.focusId ?? ''}-${target.query ?? ''}`} className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-5 sm:px-6">
          {page}
        </main>
        <footer
          className="border-t px-4 py-3 sm:px-6"
          style={{ borderColor: 'var(--color-border)', background: 'var(--color-sidebar)' }}
        >
          <p className="tnum mx-auto w-full max-w-[1200px] text-[11.5px]" style={{ color: 'var(--color-ink-secondary)' }}>
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
