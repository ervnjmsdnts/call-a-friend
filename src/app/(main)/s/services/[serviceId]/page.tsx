import { db } from '@/db';
import { notFound } from 'next/navigation';
import Service from '../_components/service';

export default async function SingleServicePage({
  params,
}: {
  params: { serviceId: string };
}) {
  const { serviceId } = params;

  const service = await db.service.findFirst({
    where: { id: serviceId },

    include: {
      user: true,
      invitations: true,
      ratings: { include: { jobPost: true } },
    },
  });

  if (!service || !service.id) return notFound();

  return <Service service={service} />;
}
