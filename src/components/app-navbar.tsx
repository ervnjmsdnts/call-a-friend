'use client';

import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  Bell,
  BookCopy,
  FileBadge,
  FileSearch,
  Loader2,
  LogOut,
  LucideIcon,
  MailPlus,
  Menu,
  PenSquare,
  Search,
  UserCog2,
} from 'lucide-react';
import { Button } from './ui/button';
import { UserRole } from '@prisma/client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { trpc } from '@/app/_trpc/client';
import { supabase } from '@/lib/supabase';

const routes: {
  href: string;
  label: string;
  Icon: LucideIcon;
  role: UserRole[];
}[] = [
  {
    href: '/posts',
    Icon: PenSquare,
    label: 'My Job Posts',
    role: ['CLIENT'],
  },
  {
    href: '/discover',
    Icon: Search,
    label: 'Discover Services',
    role: ['CLIENT'],
  },
  {
    href: '/my-invitations',
    Icon: MailPlus,
    label: 'My Invitations',
    role: ['CLIENT'],
  },
  {
    href: '/applications',
    Icon: FileBadge,
    label: 'Applications',
    role: ['CLIENT'],
  },
  {
    href: '/services',
    Icon: UserCog2,
    label: 'My Services',
    role: ['SERVICE'],
  },
  {
    href: '/discover',
    Icon: Search,
    label: 'Discover Jobs',
    role: ['SERVICE'],
  },
  {
    href: '/invitations',
    Icon: MailPlus,
    label: 'Invitations',
    role: ['SERVICE'],
  },
  {
    href: '/my-jobs',
    Icon: BookCopy,
    label: 'My Jobs',
    role: ['SERVICE'],
  },
  {
    href: '/my-applications',
    Icon: FileSearch,
    label: 'My Applications',
    role: ['SERVICE'],
  },
];

function SidebarSheet({
  userRole,
  userName,
}: {
  userRole: UserRole;
  userName: string;
}) {
  const [open, setOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const { mutate: logout } = trpc.auth.logout.useMutation({
    onSuccess: () => {
      router.replace('/');
      setOpen(false);
    },
  });

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Menu />
      </SheetTrigger>
      <SheetContent side='left' className='w-full'>
        <div className='flex flex-col h-full py-4'>
          <p className='text-lg font-bold'>Hello, {userName}</p>
          <div className='flex-grow flex flex-col mt-4 gap-3'>
            {routes
              .filter((fil) => fil.role.includes(userRole))
              .map((route, index) => (
                <Button
                  key={index}
                  asChild
                  onClick={() => setOpen(false)}
                  className='justify-start gap-2 flex'
                  variant={
                    pathname.includes(route.href) ? 'secondary' : 'ghost'
                  }>
                  <Link
                    href={
                      userRole === 'CLIENT'
                        ? `/c${route.href}`
                        : `/s${route.href}`
                    }>
                    <route.Icon />
                    <p>{route.label}</p>
                  </Link>
                </Button>
              ))}
            <Button
              onClick={() => logout()}
              className='flex justify-start gap-2'
              variant='ghost'>
              <LogOut />
              Log Out
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Notifications() {
  const { data: notifications, isLoading } =
    trpc.notifications.getUserNotifications.useQuery();

  const util = trpc.useUtils();

  const { mutate: readNotifications } =
    trpc.notifications.readAllNotificationsOfUser.useMutation({
      onSuccess: () => util.notifications.getUserNotifications.invalidate(),
    });

  const hasNewNotifications = notifications?.some((notif) => notif.isRead);

  useEffect(() => {
    const channel = supabase
      .channel('realtime_audits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'Notification',
        },
        (payload) => {
          util.notifications.getUserNotifications.invalidate();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [util]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          onClick={() => readNotifications()}
          className='rounded-full relative w-10 h-10 p-2'>
          {hasNewNotifications ? (
            <>
              <span className='flex h-3 w-3 z-10 right-0 top-0 absolute'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75'></span>
                <span className='relative inline-flex rounded-full h-3 w-3 bg-primary'></span>
              </span>
            </>
          ) : null}
          <Bell className='w-8 h-8 text-muted-foreground' />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        {notifications && notifications.length !== 0 ? (
          <div className='flex flex-col gap-1 max-h-52 overflow-y-auto'>
            {notifications.map((notif) => (
              <p className='text-xs' key={notif.id}>
                {notif.message}
              </p>
            ))}
          </div>
        ) : isLoading ? (
          <div className='justify-center items-center flex'>
            <Loader2 className='w-4 h-4 animate-spin' />
          </div>
        ) : (
          <div>No notifications</div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default function AppNavbar({
  userRole,
  userName,
}: {
  userRole: UserRole;
  userName: string;
}) {
  const router = useRouter();
  useEffect(() => {
    router.refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <nav className='px-4 border-b py-6'>
      <div className='flex items-center justify-between'>
        <SidebarSheet userRole={userRole} userName={userName} />
        <Notifications />
      </div>
    </nav>
  );
}
