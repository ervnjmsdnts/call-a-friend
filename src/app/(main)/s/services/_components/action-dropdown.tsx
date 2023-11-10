import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Service } from '@prisma/client';
import { MoreVertical } from 'lucide-react';
import EditService from './edit-service';
import DeleteService from './delete-service';

export default function ActionDropdown({ service }: { service: Service }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='w-10 h-10 p-2 rounded-full'>
          <MoreVertical className='w-6 h-6' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <EditService service={service} />
        <DeleteService serviceId={service.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
