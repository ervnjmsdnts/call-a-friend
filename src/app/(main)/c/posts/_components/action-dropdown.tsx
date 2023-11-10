import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Pencil, Trash } from 'lucide-react';
import EditJobPost from './edit-job-post';
import { JobPost } from '@prisma/client';
import DeletePostDialog from './delete-post-dialog';

export default function ActionDropdown({ post }: { post: JobPost }) {
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
        <EditJobPost post={post} />
        <DeletePostDialog postId={post.id} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
